// ---------------------------------------------------------------------
// Catálogo: fabricantes e acessórios vivem no backend (ver pasta
// backend/ na raiz do projeto), não mais em consts fixas aqui. Uma
// cópia fica em cache no localStorage ("catalogoCache") pra CONSULTAR
// offline; sincronizarCatalogo() busca a versão mais nova sempre que
// uma tela abre, e falha em silêncio se não tiver internet (mantém o
// cache antigo). Adicionar/editar/remover precisa de internet - fala
// direto com a API, sem gravar nada só localmente.
// ---------------------------------------------------------------------
function getCatalogoCache() {
  return JSON.parse(localStorage.getItem("catalogoCache") || "null") || { fabricantes: [], acessorios: [] };
}

async function sincronizarCatalogo() {
  try {
    const dados = await apiGet("/catalogo");
    localStorage.setItem("catalogoCache", JSON.stringify(dados));
  } catch (e) {
    // sem internet ou servidor fora do ar - segue com o que já tem em cache
  }
}

function getTodosFabricantes() {
  return getCatalogoCache().fabricantes;
}

function getFabricantePorId(id) {
  return getTodosFabricantes().find((f) => f.id === id);
}

async function criarFabricante(dados) {
  const criado = await apiPost("/fabricantes", dados);
  await sincronizarCatalogo();
  return criado;
}

async function editarFabricante(id, dados) {
  const editado = await apiPut(`/fabricantes/${id}`, dados);
  await sincronizarCatalogo();
  return editado;
}

async function removerFabricante(id) {
  await apiDelete(`/fabricantes/${id}`);
  await sincronizarCatalogo();
}

function getTodosAcessorios() {
  return getCatalogoCache().acessorios;
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

async function criarAcessorio(dados) {
  const criado = await apiPost("/acessorios", dados);
  await sincronizarCatalogo();
  return criado;
}

async function editarAcessorio(id, dados) {
  const editado = await apiPut(`/acessorios/${id}`, dados);
  await sincronizarCatalogo();
  return editado;
}

async function removerAcessorio(id) {
  await apiDelete(`/acessorios/${id}`);
  await sincronizarCatalogo();
  const favoritos = getFavoritos().filter((fid) => fid !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// ---------------------------------------------------------------------
// Avaliação do passo a passo ("essa instrução te ajudou?") - pública,
// não exige login. jaAvaliou()/marcarAvaliado() usam localStorage só pra
// impedir votar mais de uma vez no mesmo aparelho pelo mesmo aparelho
// (celular); não sincroniza com o backend.
// ---------------------------------------------------------------------
function jaAvaliou(acessorioId) {
  return !!localStorage.getItem(`avaliado-${acessorioId}`);
}

async function avaliarAcessorio(acessorioId, util) {
  await apiPost(`/acessorios/${acessorioId}/avaliacao`, { util });
  localStorage.setItem(`avaliado-${acessorioId}`, "1");
  await sincronizarCatalogo();
}

// ---------------------------------------------------------------------
// Favoritos: lista de ids de acessório marcados pelo usuário, guardada
// no localStorage. É só uma preferência do aparelho - nunca sincroniza
// com o backend, funciona 100% offline, vale tanto pra item de catálogo
// quanto pra próprio.
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
