// Login "de mentira" (client-side) para o protótipo. Sem backend, então as
// senhas ficam visíveis para quem abrir o código-fonte — serve só para
// validar o fluxo de acesso restrito, não é segurança de verdade.
// Para adicionar/remover pessoas com acesso, edite a lista USUARIOS abaixo.
const USUARIOS = [
  { usuario: "montador", senha: "1234", nome: "Equipe Madeirol" }
];

function getUsuarioLogado() {
  return JSON.parse(localStorage.getItem("usuarioLogado") || "null");
}

function estaLogado() {
  return getUsuarioLogado() !== null;
}

function fazerLogin(usuario, senha) {
  const encontrado = USUARIOS.find((u) => u.usuario === usuario && u.senha === senha);
  if (!encontrado) return false;
  localStorage.setItem("usuarioLogado", JSON.stringify({ usuario: encontrado.usuario, nome: encontrado.nome }));
  return true;
}

function fazerLogout() {
  localStorage.removeItem("usuarioLogado");
}

// Chame no topo de páginas restritas. Retorna true se pode continuar
// renderizando a página; se não, já disparou o redirecionamento pro login.
function exigirLogin(voltarPara) {
  if (!estaLogado()) {
    window.location.href = `login.html?next=${encodeURIComponent(voltarPara || window.location.href)}`;
    return false;
  }
  return true;
}
