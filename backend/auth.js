require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET nao configurado. Copie backend/.env.example para backend/.env e preencha.");
}

const JWT_SECRET = process.env.JWT_SECRET;

function hashSenha(senha) {
  return bcrypt.hash(senha, 10);
}

function conferirSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, usuario: usuario.usuario, nome: usuario.nome, podeAdicionar: usuario.pode_adicionar },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// Middleware: exige um token valido (qualquer usuario logado).
function exigirLogin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ erro: "Login necessario." });
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: "Sessao invalida ou expirada." });
  }
}

// Middleware: exige login E permissao de adicionar/editar/remover.
function exigirPermissaoAdicionar(req, res, next) {
  exigirLogin(req, res, () => {
    if (!req.usuario.podeAdicionar) {
      return res.status(403).json({ erro: "Sua conta nao tem permissao para adicionar ou editar." });
    }
    next();
  });
}

module.exports = { hashSenha, conferirSenha, gerarToken, exigirLogin, exigirPermissaoAdicionar };
