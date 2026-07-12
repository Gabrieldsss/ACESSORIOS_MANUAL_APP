require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool, garantirSchema } = require("./db");
const { conferirSenha, gerarToken, exigirLogin, exigirPermissaoAdicionar } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" })); // fotos em base64 podem ser grandes

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "item";
}

function gerarId(nome) {
  return `${slugify(nome)}-${Date.now().toString(36)}`;
}

function mapFabricante(row) {
  return {
    id: row.id,
    nome: row.nome,
    cor: row.cor,
    logo: row.logo || undefined,
    logoBase64: row.logo_base64 || undefined,
    origem: row.origem
  };
}

function mapAcessorio(row, passos) {
  return {
    id: row.id,
    fabricanteId: row.fabricante_id,
    nome: row.nome,
    categoria: row.categoria,
    imagem: row.imagem || undefined,
    imagemBase64: row.imagem_base64 || undefined,
    origem: row.origem,
    passos: passos.map((p) => ({
      texto: p.texto,
      imagem: p.imagem || undefined,
      imagemBase64: p.imagem_base64 || undefined
    }))
  };
}

// ---------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------
app.post("/auth/login", async (req, res) => {
  const { usuario, senha } = req.body || {};
  if (!usuario || !senha) return res.status(400).json({ erro: "Usuário e senha são obrigatórios." });

  const { rows } = await pool.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario]);
  const encontrado = rows[0];
  if (!encontrado || !(await conferirSenha(senha, encontrado.senha_hash))) {
    return res.status(401).json({ erro: "Usuário ou senha incorretos." });
  }

  res.json({
    token: gerarToken(encontrado),
    usuario: encontrado.usuario,
    nome: encontrado.nome,
    podeAdicionar: encontrado.pode_adicionar
  });
});

// ---------------------------------------------------------------------
// Catálogo (leitura pública - não exige login, é o que o app consulta
// offline via cache local depois do primeiro fetch)
// ---------------------------------------------------------------------
app.get("/catalogo", async (req, res) => {
  const [fabricantes, acessorios, passos] = await Promise.all([
    pool.query("SELECT * FROM fabricantes ORDER BY nome"),
    pool.query("SELECT * FROM acessorios ORDER BY nome"),
    pool.query("SELECT * FROM passos ORDER BY acessorio_id, ordem")
  ]);

  const passosPorAcessorio = {};
  for (const p of passos.rows) {
    (passosPorAcessorio[p.acessorio_id] ||= []).push(p);
  }

  res.json({
    fabricantes: fabricantes.rows.map(mapFabricante),
    acessorios: acessorios.rows.map((a) => mapAcessorio(a, passosPorAcessorio[a.id] || []))
  });
});

// ---------------------------------------------------------------------
// Fabricantes (exige permissão)
// ---------------------------------------------------------------------
app.post("/fabricantes", exigirPermissaoAdicionar, async (req, res) => {
  const { nome, cor, logoBase64 } = req.body || {};
  if (!nome) return res.status(400).json({ erro: "Nome é obrigatório." });

  const id = gerarId(nome);
  const { rows } = await pool.query(
    `INSERT INTO fabricantes (id, nome, cor, logo_base64, origem, criado_por)
     VALUES ($1, $2, $3, $4, 'usuario', $5) RETURNING *`,
    [id, nome, cor || "#2f6b4f", logoBase64 || null, req.usuario.id]
  );
  res.status(201).json(mapFabricante(rows[0]));
});

app.put("/fabricantes/:id", exigirPermissaoAdicionar, async (req, res) => {
  const atual = await pool.query("SELECT * FROM fabricantes WHERE id = $1", [req.params.id]);
  if (!atual.rows[0]) return res.status(404).json({ erro: "Fabricante não encontrado." });

  const antigo = atual.rows[0];
  const { nome, cor, logoBase64 } = req.body || {};
  const { rows } = await pool.query(
    `UPDATE fabricantes SET nome = $1, cor = $2, logo_base64 = $3 WHERE id = $4 RETURNING *`,
    [nome ?? antigo.nome, cor ?? antigo.cor, logoBase64 ?? antigo.logo_base64, req.params.id]
  );
  res.json(mapFabricante(rows[0]));
});

app.delete("/fabricantes/:id", exigirPermissaoAdicionar, async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM fabricantes WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ erro: "Fabricante não encontrado." });
  res.status(204).end();
});

// ---------------------------------------------------------------------
// Acessórios (exige permissão)
// ---------------------------------------------------------------------
app.post("/acessorios", exigirPermissaoAdicionar, async (req, res) => {
  const { fabricanteId, nome, categoria, imagemBase64, passos } = req.body || {};
  if (!fabricanteId || !nome || !categoria) {
    return res.status(400).json({ erro: "Fabricante, nome e categoria são obrigatórios." });
  }

  const id = gerarId(nome);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO acessorios (id, fabricante_id, nome, categoria, imagem_base64, origem, criado_por)
       VALUES ($1, $2, $3, $4, $5, 'usuario', $6) RETURNING *`,
      [id, fabricanteId, nome, categoria, imagemBase64 || null, req.usuario.id]
    );
    await inserirPassos(client, id, passos || []);
    await client.query("COMMIT");
    res.status(201).json(mapAcessorio(rows[0], (passos || []).map((p) => ({ texto: p.texto, imagem_base64: p.imagemBase64 }))));
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
});

app.put("/acessorios/:id", exigirPermissaoAdicionar, async (req, res) => {
  const atual = await pool.query("SELECT * FROM acessorios WHERE id = $1", [req.params.id]);
  if (!atual.rows[0]) return res.status(404).json({ erro: "Acessório não encontrado." });

  const antigo = atual.rows[0];
  const { nome, categoria, imagemBase64, passos } = req.body || {};
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `UPDATE acessorios SET nome = $1, categoria = $2, imagem_base64 = $3 WHERE id = $4 RETURNING *`,
      [nome ?? antigo.nome, categoria ?? antigo.categoria, imagemBase64 ?? antigo.imagem_base64, req.params.id]
    );
    if (passos) {
      await client.query("DELETE FROM passos WHERE acessorio_id = $1", [req.params.id]);
      await inserirPassos(client, req.params.id, passos);
    }
    await client.query("COMMIT");
    const passosFinais = await pool.query("SELECT * FROM passos WHERE acessorio_id = $1 ORDER BY ordem", [req.params.id]);
    res.json(mapAcessorio(rows[0], passosFinais.rows));
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
});

app.delete("/acessorios/:id", exigirPermissaoAdicionar, async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM acessorios WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ erro: "Acessório não encontrado." });
  res.status(204).end();
});

async function inserirPassos(client, acessorioId, passos) {
  for (let i = 0; i < passos.length; i++) {
    await client.query(
      `INSERT INTO passos (acessorio_id, ordem, texto, imagem_base64) VALUES ($1, $2, $3, $4)`,
      [acessorioId, i, passos[i].texto, passos[i].imagemBase64 || null]
    );
  }
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

const PORT = process.env.PORT || 3000;
garantirSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`API do Manual do Montador rodando na porta ${PORT}`));
  })
  .catch((e) => {
    console.error("Falha ao preparar o banco:", e);
    process.exit(1);
  });
