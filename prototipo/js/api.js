// Fala com o backend (ver pasta backend/ na raiz do projeto), publicado
// no Render (ver ESCOPO.md > "Como publicar o backend").
const API_BASE_URL = "https://acessorios-manual-app.onrender.com";

// Erro específico de "não deu pra falar com o servidor" (sem internet,
// servidor fora do ar, etc.) - quem chama pode diferenciar isso de um
// erro de verdade (ex: "usuário ou senha incorretos").
class ErroSemInternet extends Error {}

function tokenAtual() {
  const logado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  return logado ? logado.token : null;
}

async function apiFetch(caminho, opcoes) {
  // Timeout curto pra quando não tem internet: sem isso, o navegador pode
  // demorar 20-30s tentando conectar antes de desistir, travando a tela
  // (que devia continuar funcionando offline com o cache local).
  const controle = new AbortController();
  const timeout = setTimeout(() => controle.abort(), 6000);

  let resp;
  try {
    resp = await fetch(`${API_BASE_URL}${caminho}`, { ...opcoes, signal: controle.signal });
  } catch (e) {
    throw new ErroSemInternet("Sem internet ou o servidor está fora do ar.");
  } finally {
    clearTimeout(timeout);
  }
  if (!resp.ok) {
    const corpo = await resp.json().catch(() => ({}));
    throw new Error(corpo.erro || `Erro ${resp.status} ao falar com o servidor.`);
  }
  if (resp.status === 204) return null;
  return resp.json();
}

function cabecalhosComToken() {
  const headers = { "Content-Type": "application/json" };
  const token = tokenAtual();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function apiGet(caminho) {
  return apiFetch(caminho);
}

function apiPost(caminho, dados) {
  return apiFetch(caminho, { method: "POST", headers: cabecalhosComToken(), body: JSON.stringify(dados) });
}

function apiPut(caminho, dados) {
  return apiFetch(caminho, { method: "PUT", headers: cabecalhosComToken(), body: JSON.stringify(dados) });
}

function apiDelete(caminho) {
  return apiFetch(caminho, { method: "DELETE", headers: cabecalhosComToken() });
}
