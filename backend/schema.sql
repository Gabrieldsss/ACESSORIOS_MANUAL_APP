-- Schema do Manual do Montador. Roda uma vez (na primeira conexao com um
-- banco Neon novo) pra criar as tabelas. Seguro rodar de novo: usa
-- "IF NOT EXISTS" em tudo.

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  usuario TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  nome TEXT NOT NULL,
  pode_adicionar BOOLEAN NOT NULL DEFAULT FALSE
);

-- "logo"/"imagem" (caminho de arquivo dentro de prototipo/assets/) guardam
-- os slots de imagem do catalogo fixo original; "*_base64" guarda foto
-- enviada por upload (o que o cropper.js gera). Um item so usa um dos
-- dois - o cliente tenta o base64 primeiro e cai pro caminho de arquivo
-- se nao tiver.
CREATE TABLE IF NOT EXISTS fabricantes (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL,
  logo TEXT,
  logo_base64 TEXT,
  origem TEXT NOT NULL DEFAULT 'usuario',
  criado_por INTEGER REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS acessorios (
  id TEXT PRIMARY KEY,
  fabricante_id TEXT NOT NULL REFERENCES fabricantes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  imagem TEXT,
  imagem_base64 TEXT,
  origem TEXT NOT NULL DEFAULT 'usuario',
  criado_por INTEGER REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS passos (
  id SERIAL PRIMARY KEY,
  acessorio_id TEXT NOT NULL REFERENCES acessorios(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL,
  texto TEXT NOT NULL,
  imagem TEXT,
  imagem_base64 TEXT
);

CREATE INDEX IF NOT EXISTS idx_acessorios_fabricante ON acessorios(fabricante_id);
CREATE INDEX IF NOT EXISTS idx_passos_acessorio ON passos(acessorio_id);
