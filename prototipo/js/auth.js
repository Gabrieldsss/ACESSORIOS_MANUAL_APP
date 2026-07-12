// Login de verdade: fala com o backend (POST /auth/login em
// prototipo/js/api.js), que confere a senha com hash e devolve um token.
// Precisa de internet pra entrar; depois de logado, a sessão (token +
// permissão) fica guardada no localStorage do aparelho.
function getUsuarioLogado() {
  return JSON.parse(localStorage.getItem("usuarioLogado") || "null");
}

// Permissão de adicionar/editar/remover fabricante e acessório. Vem
// pronta do backend na hora do login (campo podeAdicionar), não precisa
// consultar o servidor de novo pra cada checagem.
function podeAdicionar() {
  const logado = getUsuarioLogado();
  return !!(logado && logado.podeAdicionar);
}

// Lança o mesmo erro de apiPost (ErroSemInternet ou "usuário/senha
// incorretos") pra quem chamou tratar - ver login.html.
async function fazerLogin(usuario, senha) {
  const resposta = await apiPost("/auth/login", { usuario, senha });
  localStorage.setItem("usuarioLogado", JSON.stringify({
    usuario: resposta.usuario,
    nome: resposta.nome,
    token: resposta.token,
    podeAdicionar: resposta.podeAdicionar
  }));
  return true;
}

function fazerLogout() {
  localStorage.removeItem("usuarioLogado");
}

// Chame no topo de páginas restritas. Retorna true se pode continuar
// renderizando a página; se não, já disparou o redirecionamento pro login.
// Usado na tela Adicionar/Editar.
function exigirPermissaoAdicionar(voltarPara) {
  if (!podeAdicionar()) {
    window.location.href = `login.html?next=${encodeURIComponent(voltarPara || window.location.href)}`;
    return false;
  }
  return true;
}

// Esconde a aba "Adicionar" da tabbar e o botão flutuante "+" pra quem não
// tem permissão (deslogado ou logado sem podeAdicionar). Roda direto (sem
// esperar DOMContentLoaded) porque este script sempre é incluído depois do
// HTML da tabbar nas páginas que a usam.
(function () {
  if (podeAdicionar()) return;
  const tab = document.getElementById("tab-adicionar");
  if (tab) tab.remove();
  const fab = document.getElementById("fab-adicionar");
  if (fab) fab.remove();
})();
