-- Schema do Manual do Montador. Roda uma vez (na primeira conexao com um
-- banco Neon novo) pra criar as tabelas. Seguro rodar de novo: usa
-- "IF NOT EXISTS" em tudo.

-- pode_adicionar: pode criar/editar/remover fabricante e acessorio.
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
-- tipo: 'ferragem' (dobradica, corredica, pe...) ou 'eletrodomestico'
-- (geladeira, fogao...) - separa os dois catalogos que aparecem na tela
-- Inicio (alternador Ferragens/Eletrodomesticos).
CREATE TABLE IF NOT EXISTS fabricantes (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL,
  logo TEXT,
  logo_base64 TEXT,
  origem TEXT NOT NULL DEFAULT 'usuario',
  tipo TEXT NOT NULL DEFAULT 'ferragem',
  site TEXT,
  criado_por INTEGER REFERENCES usuarios(id)
);
-- Colunas adicionadas depois que a tabela ja existia em producao
-- (tipo em 2026-07-14, site em 2026-07-16); ADD COLUMN IF NOT EXISTS
-- deixa seguro rodar em bancos antigos e novos - os 3 fabricantes
-- originais (Blum/Hafele/Hettich) caem no default 'ferragem', que e o
-- que ja eram, e com site NULL (opcional).
ALTER TABLE fabricantes ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'ferragem';
ALTER TABLE fabricantes ADD COLUMN IF NOT EXISTS site TEXT;

-- avaliacoes_util/avaliacoes_nao_util: contagem de "essa instrucao te
-- ajudou?" respondida no final do passo a passo (sem login, 1 voto por
-- aparelho via localStorage) - sinaliza pra quem edita quais textos
-- precisam ser reescritos.
-- especificacoes: texto livre curto pra dado tecnico que nao e passo de
-- instalacao (capacidade de carga, vida util etc.) - opcional.
-- manual_tipo: 'passos' (foto+texto por etapa, o padrao de sempre),
-- 'pdf' ou 'video' - escolhido por item na tela Adicionar/Editar. Quando
-- nao e 'passos', a tabela "passos" fica vazia pra esse acessorio (nao e
-- mais obrigatoria) e o conteudo mora em manual_pdf_base64/
-- manual_video_base64 (upload direto, mesmo esquema sem servico de
-- storage separado usado pras fotos/videos de passo).
CREATE TABLE IF NOT EXISTS acessorios (
  id TEXT PRIMARY KEY,
  fabricante_id TEXT NOT NULL REFERENCES fabricantes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  imagem TEXT,
  imagem_base64 TEXT,
  origem TEXT NOT NULL DEFAULT 'usuario',
  especificacoes TEXT,
  manual_tipo TEXT NOT NULL DEFAULT 'passos',
  manual_pdf_base64 TEXT,
  manual_video_base64 TEXT,
  avaliacoes_util INTEGER NOT NULL DEFAULT 0,
  avaliacoes_nao_util INTEGER NOT NULL DEFAULT 0,
  criado_por INTEGER REFERENCES usuarios(id)
);
-- Colunas adicionadas depois que a tabela ja existia em producao
-- (avaliacoes e especificacoes em 2026-07-16, manual_* em 2026-07-16).
ALTER TABLE acessorios ADD COLUMN IF NOT EXISTS avaliacoes_util INTEGER NOT NULL DEFAULT 0;
ALTER TABLE acessorios ADD COLUMN IF NOT EXISTS avaliacoes_nao_util INTEGER NOT NULL DEFAULT 0;
ALTER TABLE acessorios ADD COLUMN IF NOT EXISTS especificacoes TEXT;
ALTER TABLE acessorios ADD COLUMN IF NOT EXISTS manual_tipo TEXT NOT NULL DEFAULT 'passos';
ALTER TABLE acessorios ADD COLUMN IF NOT EXISTS manual_pdf_base64 TEXT;
ALTER TABLE acessorios ADD COLUMN IF NOT EXISTS manual_video_base64 TEXT;

-- video_base64: video opcional do passo (upload direto, igual a foto -
-- ver "Imagens e logos" no ESCOPO.md; sem servico de storage separado).
CREATE TABLE IF NOT EXISTS passos (
  id SERIAL PRIMARY KEY,
  acessorio_id TEXT NOT NULL REFERENCES acessorios(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL,
  texto TEXT NOT NULL,
  imagem TEXT,
  imagem_base64 TEXT,
  video_base64 TEXT
);
ALTER TABLE passos ADD COLUMN IF NOT EXISTS video_base64 TEXT;

CREATE INDEX IF NOT EXISTS idx_acessorios_fabricante ON acessorios(fabricante_id);
CREATE INDEX IF NOT EXISTS idx_passos_acessorio ON passos(acessorio_id);
