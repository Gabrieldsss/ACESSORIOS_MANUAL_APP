// Popula o banco com o catalogo original (3 fabricantes + 6 acessorios,
// copiados de prototipo/js/data.js) e o usuario de exemplo
// ("montador"/"1234", com permissao de adicionar). Seguro rodar mais de
// uma vez: usa ON CONFLICT DO NOTHING, entao nao duplica nem sobrescreve
// o que ja tiver sido editado a mao no banco.
require("dotenv").config();
const { pool, garantirSchema } = require("./db");
const { hashSenha } = require("./auth");

const FABRICANTES = [
  { id: "blum", nome: "Blum", cor: "#003a70", logo: "assets/logos/blum.png" },
  { id: "hafele", nome: "Häfele", cor: "#c8102e", logo: "assets/logos/hafele.png" },
  { id: "hettich", nome: "Hettich", cor: "#e6852c", logo: "assets/logos/hettich.png" }
];

const CATALOGO = [
  {
    id: "blum-aventos-hk-xs", fabricanteId: "blum", nome: "Articulador Aventos HK-XS",
    categoria: "Sistema de elevação", imagem: "assets/produtos/blum-aventos-hk-xs.jpg",
    passos: [
      { texto: "Fixe a base de montagem do HK-XS na lateral do móvel, respeitando a distância indicada na tabela de furação.", imagem: "assets/produtos/blum-aventos-hk-xs-passo-1.png" },
      { texto: "Encaixe o braço elevador na base e prenda com o parafuso de fixação central.", imagem: "assets/produtos/blum-aventos-hk-xs-passo-2.png" },
      { texto: "Regule a força de elevação através do parafuso de ajuste, testando a abertura da porta.", imagem: "assets/produtos/blum-aventos-hk-xs-passo-3.png" },
      { texto: "Instale a porta no braço e ajuste o alinhamento lateral e de profundidade.", imagem: "assets/produtos/blum-aventos-hk-xs-passo-4.png" }
    ]
  },
  {
    id: "blum-tandem", fabricanteId: "blum", nome: "Corrediça Tandem",
    categoria: "Corrediça de gaveta", imagem: "assets/produtos/blum-tandem.png",
    passos: [
      { texto: "Fixe os trilhos laterais nas laterais do móvel na altura marcada no projeto.", imagem: "assets/produtos/blum-tandem-passo-1.png" },
      { texto: "Encaixe os trilhos da gaveta nas laterais da caixa da gaveta.", imagem: "assets/produtos/blum-tandem-passo-2.png" },
      { texto: "Insira a gaveta nos trilhos fixos até ouvir o clique de travamento.", imagem: "assets/produtos/blum-tandem-passo-3.png" },
      { texto: "Teste o curso completo da gaveta e ajuste o nivelamento se necessário.", imagem: "assets/produtos/blum-tandem-passo-4.png" }
    ]
  },
  {
    id: "hafele-pe-rodape-80", fabricanteId: "hafele", nome: "Pé para rodapé 80",
    categoria: "Pé / nivelamento", imagem: "assets/produtos/hafele-pe-rodape-80.jpg",
    passos: [
      { texto: "Marque a posição dos pés no fundo do móvel, respeitando as distâncias das bordas.", imagem: "assets/produtos/hafele-pe-rodape-80-passo-1.png" },
      { texto: "Fixe a base do pé com os parafusos indicados no fundo do móvel.", imagem: "assets/produtos/hafele-pe-rodape-80-passo-2.png" },
      { texto: "Rosqueie o pé regulável na base até a altura desejada.", imagem: "assets/produtos/hafele-pe-rodape-80-passo-3.png" },
      { texto: "Nivele o móvel ajustando cada pé individualmente com auxílio de um nível.", imagem: "assets/produtos/hafele-pe-rodape-80-passo-4.png" }
    ]
  },
  {
    id: "hafele-trilho-telescopico", fabricanteId: "hafele", nome: "Trilho telescópico",
    categoria: "Corrediça / trilho", imagem: "assets/produtos/hafele-trilho-telescopico.png",
    passos: [
      { texto: "Posicione o trilho fixo na lateral do vão e marque os furos de fixação.", imagem: "assets/produtos/hafele-trilho-telescopico-passo-1.png" },
      { texto: "Fixe o trilho com os parafusos fornecidos, mantendo o esquadro.", imagem: "assets/produtos/hafele-trilho-telescopico-passo-2.png" },
      { texto: "Encaixe o trilho móvel na gaveta ou bandeja correspondente.", imagem: "assets/produtos/hafele-trilho-telescopico-passo-3.png" },
      { texto: "Teste a extensão completa do trilho e o travamento nas duas extremidades.", imagem: "assets/produtos/hafele-trilho-telescopico-passo-4.png" }
    ]
  },
  {
    id: "hettich-sensys", fabricanteId: "hettich", nome: "Dobradiça Sensys",
    categoria: "Dobradiça com amortecimento", imagem: "assets/produtos/hettich-sensys.jpg",
    passos: [
      { texto: "Fixe o copo da dobradiça na porta, respeitando a distância de furação de 35mm.", imagem: "assets/produtos/hettich-sensys-passo-1.png" },
      { texto: "Fixe o suporte da dobradiça na lateral do móvel, na altura de instalação prevista.", imagem: "assets/produtos/hettich-sensys-passo-2.png" },
      { texto: "Encaixe o braço da dobradiça no suporte até travar.", imagem: "assets/produtos/hettich-sensys-passo-3.png" },
      { texto: "Regule a lateral, a profundidade e o amortecimento pelos parafusos de ajuste.", imagem: "assets/produtos/hettich-sensys-passo-4.png" }
    ]
  },
  {
    id: "hettich-quadro", fabricanteId: "hettich", nome: "Sistema Quadro",
    categoria: "Sistema de gaveta", imagem: "assets/produtos/hettich-quadro.png",
    passos: [
      { texto: "Fixe os corpos do Quadro nas laterais do móvel respeitando o furo padrão de 32mm.", imagem: "assets/produtos/hettich-quadro-passo-1.png" },
      { texto: "Monte a caixa da gaveta encaixando as laterais Quadro na frente e no fundo.", imagem: "assets/produtos/hettich-quadro-passo-2.png" },
      { texto: "Insira a gaveta montada nos trilhos até travar.", imagem: "assets/produtos/hettich-quadro-passo-3.png" },
      { texto: "Ajuste altura, lateral e profundidade pelos parafusos de regulagem frontais.", imagem: "assets/produtos/hettich-quadro-passo-4.png" }
    ]
  }
];

async function seed() {
  await garantirSchema();

  for (const f of FABRICANTES) {
    await pool.query(
      `INSERT INTO fabricantes (id, nome, cor, logo, origem) VALUES ($1, $2, $3, $4, 'catalogo')
       ON CONFLICT (id) DO NOTHING`,
      [f.id, f.nome, f.cor, f.logo]
    );
  }

  for (const a of CATALOGO) {
    await pool.query(
      `INSERT INTO acessorios (id, fabricante_id, nome, categoria, imagem, origem) VALUES ($1, $2, $3, $4, $5, 'catalogo')
       ON CONFLICT (id) DO NOTHING`,
      [a.id, a.fabricanteId, a.nome, a.categoria, a.imagem]
    );
    for (let i = 0; i < a.passos.length; i++) {
      const jaTemPassos = await pool.query("SELECT 1 FROM passos WHERE acessorio_id = $1 LIMIT 1", [a.id]);
      if (jaTemPassos.rows.length) break;
      await pool.query(
        `INSERT INTO passos (acessorio_id, ordem, texto, imagem) VALUES ($1, $2, $3, $4)`,
        [a.id, i, a.passos[i].texto, a.passos[i].imagem]
      );
    }
  }

  const senhaHash = await hashSenha("1234");
  await pool.query(
    `INSERT INTO usuarios (usuario, senha_hash, nome, pode_adicionar) VALUES ($1, $2, $3, TRUE)
     ON CONFLICT (usuario) DO NOTHING`,
    ["montador", senhaHash, "Equipe Madeirol"]
  );

  console.log("Seed concluído: 3 fabricantes, 6 acessórios e o usuário 'montador' (senha 1234).");
  await pool.end();
}

seed().catch((e) => {
  console.error("Erro no seed:", e);
  process.exit(1);
});
