const FABRICANTES = [
  { id: "blum", nome: "Blum", cor: "#003a70", logo: "assets/logos/blum.png" },
  { id: "hafele", nome: "Häfele", cor: "#c8102e", logo: "assets/logos/hafele.png" },
  { id: "hettich", nome: "Hettich", cor: "#e6852c", logo: "assets/logos/hettich.png" }
];

const CATALOGO = [
  {
    id: "blum-aventos-hk-xs",
    fabricanteId: "blum",
    nome: "Articulador Aventos HK-XS",
    categoria: "Sistema de elevação",
    origem: "catalogo",
    imagem: "assets/produtos/blum-aventos-hk-xs.jpg",
    passos: [
      { texto: "Fixe a base de montagem do HK-XS na lateral do móvel, respeitando a distância indicada na tabela de furação.", imagem: "assets/produtos/blum-aventos-hk-xs-passo-1.png" },
      { texto: "Encaixe o braço elevador na base e prenda com o parafuso de fixação central.", imagem: "assets/produtos/blum-aventos-hk-xs-passo-2.png" },
      { texto: "Regule a força de elevação através do parafuso de ajuste, testando a abertura da porta.", imagem: "assets/produtos/blum-aventos-hk-xs-passo-3.png" },
      { texto: "Instale a porta no braço e ajuste o alinhamento lateral e de profundidade.", imagem: "assets/produtos/blum-aventos-hk-xs-passo-4.png" }
    ]
  },
  {
    id: "blum-tandem",
    fabricanteId: "blum",
    nome: "Corrediça Tandem",
    categoria: "Corrediça de gaveta",
    origem: "catalogo",
    imagem: "assets/produtos/blum-tandem.png",
    passos: [
      { texto: "Fixe os trilhos laterais nas laterais do móvel na altura marcada no projeto.", imagem: "assets/produtos/blum-tandem-passo-1.png" },
      { texto: "Encaixe os trilhos da gaveta nas laterais da caixa da gaveta.", imagem: "assets/produtos/blum-tandem-passo-2.png" },
      { texto: "Insira a gaveta nos trilhos fixos até ouvir o clique de travamento.", imagem: "assets/produtos/blum-tandem-passo-3.png" },
      { texto: "Teste o curso completo da gaveta e ajuste o nivelamento se necessário.", imagem: "assets/produtos/blum-tandem-passo-4.png" }
    ]
  },
  {
    id: "hafele-pe-rodape-80",
    fabricanteId: "hafele",
    nome: "Pé para rodapé 80",
    categoria: "Pé / nivelamento",
    origem: "catalogo",
    imagem: "assets/produtos/hafele-pe-rodape-80.jpg",
    passos: [
      { texto: "Marque a posição dos pés no fundo do móvel, respeitando as distâncias das bordas.", imagem: "assets/produtos/hafele-pe-rodape-80-passo-1.png" },
      { texto: "Fixe a base do pé com os parafusos indicados no fundo do móvel.", imagem: "assets/produtos/hafele-pe-rodape-80-passo-2.png" },
      { texto: "Rosqueie o pé regulável na base até a altura desejada.", imagem: "assets/produtos/hafele-pe-rodape-80-passo-3.png" },
      { texto: "Nivele o móvel ajustando cada pé individualmente com auxílio de um nível.", imagem: "assets/produtos/hafele-pe-rodape-80-passo-4.png" }
    ]
  },
  {
    id: "hafele-trilho-telescopico",
    fabricanteId: "hafele",
    nome: "Trilho telescópico",
    categoria: "Corrediça / trilho",
    origem: "catalogo",
    imagem: "assets/produtos/hafele-trilho-telescopico.png",
    passos: [
      { texto: "Posicione o trilho fixo na lateral do vão e marque os furos de fixação.", imagem: "assets/produtos/hafele-trilho-telescopico-passo-1.png" },
      { texto: "Fixe o trilho com os parafusos fornecidos, mantendo o esquadro.", imagem: "assets/produtos/hafele-trilho-telescopico-passo-2.png" },
      { texto: "Encaixe o trilho móvel na gaveta ou bandeja correspondente.", imagem: "assets/produtos/hafele-trilho-telescopico-passo-3.png" },
      { texto: "Teste a extensão completa do trilho e o travamento nas duas extremidades.", imagem: "assets/produtos/hafele-trilho-telescopico-passo-4.png" }
    ]
  },
  {
    id: "hettich-sensys",
    fabricanteId: "hettich",
    nome: "Dobradiça Sensys",
    categoria: "Dobradiça com amortecimento",
    origem: "catalogo",
    imagem: "assets/produtos/hettich-sensys.jpg",
    passos: [
      { texto: "Fixe o copo da dobradiça na porta, respeitando a distância de furação de 35mm.", imagem: "assets/produtos/hettich-sensys-passo-1.png" },
      { texto: "Fixe o suporte da dobradiça na lateral do móvel, na altura de instalação prevista.", imagem: "assets/produtos/hettich-sensys-passo-2.png" },
      { texto: "Encaixe o braço da dobradiça no suporte até travar.", imagem: "assets/produtos/hettich-sensys-passo-3.png" },
      { texto: "Regule a lateral, a profundidade e o amortecimento pelos parafusos de ajuste.", imagem: "assets/produtos/hettich-sensys-passo-4.png" }
    ]
  },
  {
    id: "hettich-quadro",
    fabricanteId: "hettich",
    nome: "Sistema Quadro",
    categoria: "Sistema de gaveta",
    origem: "catalogo",
    imagem: "assets/produtos/hettich-quadro.png",
    passos: [
      { texto: "Fixe os corpos do Quadro nas laterais do móvel respeitando o furo padrão de 32mm.", imagem: "assets/produtos/hettich-quadro-passo-1.png" },
      { texto: "Monte a caixa da gaveta encaixando as laterais Quadro na frente e no fundo.", imagem: "assets/produtos/hettich-quadro-passo-2.png" },
      { texto: "Insira a gaveta montada nos trilhos até travar.", imagem: "assets/produtos/hettich-quadro-passo-3.png" },
      { texto: "Ajuste altura, lateral e profundidade pelos parafusos de regulagem frontais.", imagem: "assets/produtos/hettich-quadro-passo-4.png" }
    ]
  }
];

// ---------------------------------------------------------------------
// Fabricantes: os 3 fixos (FABRICANTES, acima) + os que o usuário
// cadastra. Como o catálogo fixo é código (não dá pra "apagar" ou
// "editar" um const), editar/remover um fabricante fixo fica guardado
// como uma sobreposição no localStorage e é aplicado por cima do valor
// original toda vez que a lista é montada.
// ---------------------------------------------------------------------
function getMeusFabricantes() {
  return JSON.parse(localStorage.getItem("meusFabricantes") || "[]");
}

function salvarMeuFabricante(fabricante) {
  const lista = getMeusFabricantes();
  lista.push(fabricante);
  localStorage.setItem("meusFabricantes", JSON.stringify(lista));
}

function getFabricantesRemovidos() {
  return JSON.parse(localStorage.getItem("fabricantesRemovidos") || "[]");
}

function getEdicoesFabricantes() {
  return JSON.parse(localStorage.getItem("fabricantesEditados") || "{}");
}

function getTodosFabricantes() {
  const removidos = getFabricantesRemovidos();
  const edicoes = getEdicoesFabricantes();
  const fixos = FABRICANTES
    .filter((f) => !removidos.includes(f.id))
    .map((f) => ({ ...f, ...(edicoes[f.id] || {}) }));
  return [...fixos, ...getMeusFabricantes()];
}

function getFabricantePorId(id) {
  return getTodosFabricantes().find((f) => f.id === id);
}

function editarFabricante(id, dados) {
  const fabricante = getFabricantePorId(id);
  if (!fabricante) return;
  if (fabricante.origem === "usuario") {
    const lista = getMeusFabricantes().map((f) => (f.id === id ? { ...f, ...dados } : f));
    localStorage.setItem("meusFabricantes", JSON.stringify(lista));
  } else {
    const edicoes = getEdicoesFabricantes();
    edicoes[id] = { ...(edicoes[id] || {}), ...dados };
    localStorage.setItem("fabricantesEditados", JSON.stringify(edicoes));
  }
}

function removerFabricante(id) {
  const fabricante = getFabricantePorId(id);
  if (!fabricante) return;
  if (fabricante.origem === "usuario") {
    const lista = getMeusFabricantes().filter((f) => f.id !== id);
    localStorage.setItem("meusFabricantes", JSON.stringify(lista));
  } else {
    const removidos = getFabricantesRemovidos();
    if (!removidos.includes(id)) {
      removidos.push(id);
      localStorage.setItem("fabricantesRemovidos", JSON.stringify(removidos));
    }
  }
  // remove em cascata os acessórios (catálogo ou próprios) desse fabricante
  getTodosAcessorios()
    .filter((a) => a.fabricanteId === id)
    .forEach((a) => removerAcessorio(a.id));
}

// ---------------------------------------------------------------------
// Acessórios: mesmo esquema — catálogo fixo (CATALOGO, acima) + os que o
// usuário cadastra, com edição/remoção do catálogo guardada como
// sobreposição no localStorage.
// ---------------------------------------------------------------------
function getMeusAcessorios() {
  return JSON.parse(localStorage.getItem("meusAcessorios") || "[]");
}

function salvarMeuAcessorio(acessorio) {
  const lista = getMeusAcessorios();
  lista.push(acessorio);
  localStorage.setItem("meusAcessorios", JSON.stringify(lista));
}

function getAcessoriosRemovidos() {
  return JSON.parse(localStorage.getItem("acessoriosRemovidos") || "[]");
}

function getEdicoesAcessorios() {
  return JSON.parse(localStorage.getItem("acessoriosEditados") || "{}");
}

function getTodosAcessorios() {
  const removidos = getAcessoriosRemovidos();
  const edicoes = getEdicoesAcessorios();
  const catalogoAtivo = CATALOGO
    .filter((a) => !removidos.includes(a.id))
    .map((a) => ({ ...a, ...(edicoes[a.id] || {}) }));
  const meus = getMeusAcessorios().filter((a) => !removidos.includes(a.id));
  return [...catalogoAtivo, ...meus];
}

function getAcessorioPorId(id) {
  return getTodosAcessorios().find((a) => a.id === id);
}

function getAcessoriosPorFabricante(fabricanteId) {
  const todos = getTodosAcessorios().filter((a) => a.fabricanteId === fabricanteId);
  return {
    catalogo: todos.filter((a) => a.origem === "catalogo"),
    meus: todos.filter((a) => a.origem === "usuario")
  };
}

function editarAcessorio(id, dados) {
  const acessorio = getAcessorioPorId(id);
  if (!acessorio) return;
  if (acessorio.origem === "usuario") {
    const lista = getMeusAcessorios().map((a) => (a.id === id ? { ...a, ...dados } : a));
    localStorage.setItem("meusAcessorios", JSON.stringify(lista));
  } else {
    const edicoes = getEdicoesAcessorios();
    edicoes[id] = { ...(edicoes[id] || {}), ...dados };
    localStorage.setItem("acessoriosEditados", JSON.stringify(edicoes));
  }
}

function removerAcessorio(id) {
  const acessorio = getAcessorioPorId(id);
  if (!acessorio) return;
  if (acessorio.origem === "usuario") {
    const lista = getMeusAcessorios().filter((a) => a.id !== id);
    localStorage.setItem("meusAcessorios", JSON.stringify(lista));
  } else {
    const removidos = getAcessoriosRemovidos();
    if (!removidos.includes(id)) {
      removidos.push(id);
      localStorage.setItem("acessoriosRemovidos", JSON.stringify(removidos));
    }
  }
  const favoritos = getFavoritos().filter((fid) => fid !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// ---------------------------------------------------------------------
// Favoritos: lista de ids de acessório marcados pelo usuário, guardada
// no localStorage. Vale tanto pra itens do catálogo quanto pra próprios.
// ---------------------------------------------------------------------
function getFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos") || "[]");
}

function isFavorito(id) {
  return getFavoritos().includes(id);
}

function alternarFavorito(id) {
  const lista = getFavoritos();
  const i = lista.indexOf(id);
  if (i === -1) {
    lista.push(id);
  } else {
    lista.splice(i, 1);
  }
  localStorage.setItem("favoritos", JSON.stringify(lista));
  return lista.includes(id);
}
