require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { pool, garantirSchema } = require("./db");
const { hashSenha, conferirSenha, gerarToken, exigirPermissaoAdicionar } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json({ limit: "60mb" })); // fotos e videos em base64 podem ser grandes

// Serve os arquivos de imagem do catalogo original (prototipo/assets/) -
// usado pela pagina publica /manual/:id, que roda fora do app e nao tem
// como ler o APK. As imagens ja sao publicas dentro do app, entao nao ha
// nada de sensivel sendo exposto aqui.
app.use("/assets", express.static(path.join(__dirname, "..", "prototipo", "assets")));

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

const TIPOS_FABRICANTE = ["ferragem", "eletrodomestico"];

function mapFabricante(row) {
  return {
    id: row.id,
    nome: row.nome,
    cor: row.cor,
    logo: row.logo || undefined,
    logoBase64: row.logo_base64 || undefined,
    origem: row.origem,
    tipo: row.tipo
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
    avaliacoesUtil: row.avaliacoes_util || 0,
    avaliacoesNaoUtil: row.avaliacoes_nao_util || 0,
    passos: passos.map((p) => ({
      texto: p.texto,
      imagem: p.imagem || undefined,
      imagemBase64: p.imagem_base64 || undefined,
      videoBase64: p.video_base64 || undefined
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
  const { nome, cor, logoBase64, tipo } = req.body || {};
  if (!nome) return res.status(400).json({ erro: "Nome é obrigatório." });

  const tipoFinal = TIPOS_FABRICANTE.includes(tipo) ? tipo : "ferragem";
  const id = gerarId(nome);
  const { rows } = await pool.query(
    `INSERT INTO fabricantes (id, nome, cor, logo_base64, origem, tipo, criado_por)
     VALUES ($1, $2, $3, $4, 'usuario', $5, $6) RETURNING *`,
    [id, nome, cor || "#2f6b4f", logoBase64 || null, tipoFinal, req.usuario.id]
  );
  res.status(201).json(mapFabricante(rows[0]));
});

app.put("/fabricantes/:id", exigirPermissaoAdicionar, async (req, res) => {
  const atual = await pool.query("SELECT * FROM fabricantes WHERE id = $1", [req.params.id]);
  if (!atual.rows[0]) return res.status(404).json({ erro: "Fabricante não encontrado." });

  const antigo = atual.rows[0];
  const { nome, cor, logoBase64, tipo } = req.body || {};
  const tipoFinal = TIPOS_FABRICANTE.includes(tipo) ? tipo : antigo.tipo;
  const { rows } = await pool.query(
    `UPDATE fabricantes SET nome = $1, cor = $2, logo_base64 = $3, tipo = $4 WHERE id = $5 RETURNING *`,
    [nome ?? antigo.nome, cor ?? antigo.cor, logoBase64 ?? antigo.logo_base64, tipoFinal, req.params.id]
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
    res.status(201).json(mapAcessorio(rows[0], (passos || []).map((p) => ({ texto: p.texto, imagem_base64: p.imagemBase64, video_base64: p.videoBase64 }))));
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
      `INSERT INTO passos (acessorio_id, ordem, texto, imagem_base64, video_base64) VALUES ($1, $2, $3, $4, $5)`,
      [acessorioId, i, passos[i].texto, passos[i].imagemBase64 || null, passos[i].videoBase64 || null]
    );
  }
}

// ---------------------------------------------------------------------
// Avaliação do passo a passo ("essa instrução te ajudou?") - publica,
// sem login (quem consulta os manuais nem sempre esta logado); 1 voto
// por aparelho e controlado no cliente via localStorage.
// ---------------------------------------------------------------------
app.post("/acessorios/:id/avaliacao", async (req, res) => {
  const { util } = req.body || {};
  const coluna = util ? "avaliacoes_util" : "avaliacoes_nao_util";
  const { rows } = await pool.query(
    `UPDATE acessorios SET ${coluna} = ${coluna} + 1 WHERE id = $1 RETURNING avaliacoes_util, avaliacoes_nao_util`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ erro: "Acessório não encontrado." });
  res.json({ avaliacoesUtil: rows[0].avaliacoes_util, avaliacoesNaoUtil: rows[0].avaliacoes_nao_util });
});

// ---------------------------------------------------------------------
// Página pública do manual (/manual/:id) - usada pelo botão "Compartilhar"
// do app: gera um link que abre o passo a passo numa página web comum,
// sem precisar ter o app instalado nem estar logado.
// ---------------------------------------------------------------------
function escapeHtml(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function imagemHtml(imagem, imagemBase64, alt) {
  // "imagem" ja vem com o prefixo "assets/..." (mesmo caminho usado no
  // app, relativo a prototipo/) - so precisa da barra na frente.
  const src = imagemBase64 || (imagem ? `/${imagem}` : null);
  if (!src) return "";
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy">`;
}

app.get("/manual/:id", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT a.*, f.nome AS fabricante_nome, f.cor AS fabricante_cor
     FROM acessorios a JOIN fabricantes f ON f.id = a.fabricante_id
     WHERE a.id = $1`,
    [req.params.id]
  );
  const acessorio = rows[0];
  if (!acessorio) {
    return res.status(404).send("<!doctype html><meta charset=\"utf-8\"><p>Manual não encontrado.</p>");
  }

  const passos = await pool.query("SELECT * FROM passos WHERE acessorio_id = $1 ORDER BY ordem", [req.params.id]);

  const passosHtml = passos.rows.map((p, i) => `
    <div class="passo">
      <div class="passo-num">${i + 1}</div>
      <div class="passo-corpo">
        ${imagemHtml(p.imagem, p.imagem_base64, `Passo ${i + 1}`)}
        ${p.video_base64 ? `<video src="${p.video_base64}" controls preload="none"></video>` : ""}
        <p>${escapeHtml(p.texto)}</p>
      </div>
    </div>
  `).join("");

  res.send(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(acessorio.nome)} — Manual do Montador</title>
<style>
  :root { --cor: ${escapeHtml(acessorio.fabricante_cor || "#2f6b4f")}; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: #f7f8fa; color: #1f2430; }
  .topo { background: var(--cor); color: #fff; padding: 24px 20px; }
  .topo .fabricante { font-size: 13px; opacity: .85; text-transform: uppercase; letter-spacing: .04em; }
  .topo h1 { margin: 4px 0 0; font-size: 22px; }
  .topo .categoria { margin-top: 6px; font-size: 14px; opacity: .9; }
  main { max-width: 480px; margin: 0 auto; padding: 20px; }
  .capa img { width: 100%; border-radius: 12px; margin-bottom: 20px; object-fit: cover; max-height: 260px; }
  .passo { display: flex; gap: 14px; margin-bottom: 24px; }
  .passo-num { flex: none; width: 28px; height: 28px; border-radius: 50%; background: var(--cor); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
  .passo-corpo { flex: 1; min-width: 0; }
  .passo-corpo img, .passo-corpo video { width: 100%; border-radius: 10px; margin-bottom: 8px; max-height: 240px; object-fit: cover; background: #000; }
  .passo-corpo p { margin: 0; line-height: 1.5; }
  footer { text-align: center; padding: 24px; font-size: 12px; color: #8a93a6; }
</style>
</head>
<body>
  <div class="topo">
    <div class="fabricante">${escapeHtml(acessorio.fabricante_nome)}</div>
    <h1>${escapeHtml(acessorio.nome)}</h1>
    <div class="categoria">${escapeHtml(acessorio.categoria)}</div>
  </div>
  <main>
    <div class="capa">${imagemHtml(acessorio.imagem, acessorio.imagem_base64, acessorio.nome)}</div>
    ${passosHtml}
  </main>
  <footer>Manual do Montador — Madeirol</footer>
</body>
</html>`);
});

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
