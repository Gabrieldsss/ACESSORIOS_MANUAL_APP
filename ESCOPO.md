# Escopo — App Manual do Montador (Acessórios para Móveis - Madeirol)

## Objetivo
Ferramenta de apoio para montadores de móveis: consultar acessórios/ferragens
(dobradiças, corrediças, pés, articuladores etc.) organizados por fabricante —
Blum, Häfele, Hettich — com imagem, especificações e passo a passo de
instalação. O próprio montador também pode cadastrar acessórios adicionais.

## Público-alvo
Montadores de móveis autônomos ou de empresas de montagem, que trabalham com
ferragens de fabricantes diferentes e precisam consultar rapidamente como
instalar cada peça.

## Funcionalidades (v1 / MVP)
1. **Lista de fabricantes** — Blum, Häfele, Hettich pré-cadastrados (cada um
   com sua logo, slot editável, ver seção "Imagens e logos" abaixo), mais os
   fabricantes que o próprio usuário cadastrar (item 6).
2. **Lista de acessórios por fabricante** — catálogo pré-cadastrado +
   acessórios do próprio usuário, com busca por nome/categoria.
3. **Detalhe do acessório** — imagem do produto, fabricante, categoria,
   botão "Ver instalação".
4. **Passo a passo de instalação** — 1 imagem + 1 texto por tela, navegação
   anterior/próximo, indicador "Passo X de Y".
5. **Cadastro de acessório próprio** — escolhe o fabricante, nome, categoria,
   foto do produto, e N passos de instalação (cada um com foto + texto).
   Vai direto pro backend (ver seção "Backend" abaixo) e passa a aparecer
   pra **todo mundo** que usa o app, não só em quem cadastrou.
6. **Cadastro de fabricante próprio** — na mesma tela "Adicionar", alternando
   para a aba "Fabricante": nome, cor de destaque e logo (upload, opcional).
   O fabricante criado passa a aparecer na lista de fabricantes e no seletor
   de fabricante do cadastro de acessório (pra todo mundo, via backend).
7. **Login restrito para quem cadastra, com permissão por usuário** — tela
   "Conta" (aba 👤) fala com o backend (`POST /auth/login`), que confere a
   senha com hash e devolve um token; cada usuário tem um campo
   `pode_adicionar` no banco. A aba "Adicionar" da barra inferior e o botão
   flutuante "+" só aparecem para quem está logado **e** tem permissão;
   quem só quer consultar os fabricantes e os manuais não precisa entrar
   nem de internet (usa o catálogo em cache). Ver "Backend" abaixo — antes
   disso o login era só de protótipo (senha visível no JS); agora é de
   verdade.
8. **Editar e remover qualquer fabricante/acessório** — botões "Editar" e
   "Remover" na tela de detalhe do acessório e na tela do fabricante,
   visíveis para **qualquer** item (inclusive o catálogo original), mas só
   aparecem para quem tem permissão. Editar reaproveita a tela "Adicionar"
   pré-preenchida; remover pede confirmação antes de apagar, e remover um
   fabricante também remove os acessórios cadastrados nele (o backend faz
   isso em cascata no banco).
9. **Menu lateral** — ícone ☰ no topo de toda tela, abre um painel deslizante
   (por cima da própria tela, não precisa sair dela) com o link para
   "Favoritos" e a versão do app. Não duplica a navegação da barra inferior
   (Início/Adicionar/Conta); serve pra coisas que não têm outro lugar fixo.
10. **Favoritos** — botão de estrela (☆/★) em qualquer acessório, tanto na
    lista de um fabricante quanto na tela de detalhe, pra marcar/desmarcar
    como favorito sem precisar estar logado (é só uma preferência de
    consulta, não uma edição). A tela "Favoritos" (acessível pelo menu
    lateral) lista todos os acessórios marcados, de qualquer fabricante,
    com um atalho pra cada um. Remover um acessório também tira ele dos
    favoritos automaticamente.
11. **App instalável (APK) offline, com aviso de atualização** — o mesmo
    código do protótipo (`prototipo/`) é empacotado com
    [Capacitor](https://capacitorjs.com) num app Android real. Roda
    **100% offline**: os arquivos ficam dentro do APK, não depende de
    internet nem de nenhum site pra funcionar (mesmo padrão de outros
    apps internos da empresa). Ao abrir a tela Início, se houver
    internet, o app confere se existe uma versão mais nova publicada no
    GitHub Releases do projeto; se sim, mostra uma faixa **dispensável**
    ("Nova versão disponível" + botão "Atualizar") — o montador pode
    ignorar e seguir usando a versão instalada. Ver
    `prototipo/js/atualizacao.js` e `prototipo/js/versao.js`.

## Catálogo pré-cadastrado (exemplos incluídos no protótipo)
- **Blum**: Articulador Aventos HK-XS, Corrediça Tandem
- **Häfele**: Pé para rodapé 80, Trilho telescópico
- **Hettich**: Dobradiça Sensys (com amortecimento), Sistema Quadro

Os textos de instalação desses itens são **genéricos/placeholder** — ajuste
para o passo a passo real de cada peça depois.

## Imagens e logos
Não é possível baixar e reutilizar os arquivos oficiais de logo/fotos de
produto dos fabricantes (direitos autorais). Por isso, cada logo e cada foto
de produto do catálogo é um **slot de imagem com fallback**: enquanto o
arquivo não existir, aparece um textinho indicando o caminho esperado; assim
que você colocar o arquivo com o nome certo na pasta, a imagem aparece
automaticamente — sem precisar mexer no código. Ver
`prototipo/assets/README.md` para a lista exata de arquivos esperados.
Os acessórios cadastrados pelo próprio usuário usam upload direto (funciona
na hora, sem precisar editar pastas).

## Backend
A partir de 2026-07-12 o catálogo (fabricantes, acessórios e passos) e o
login deixaram de viver só no aparelho e passaram a ter um backend de
verdade — ver a pasta `backend/` na raiz do projeto.

- **Stack**: Node.js + Express, banco Postgres na nuvem ([Neon](https://neon.tech),
  free tier), login com senha em hash (`bcryptjs`) + sessão via token JWT
  (`jsonwebtoken`). Sem ORM — SQL direto (`pg`), schema pequeno (4 tabelas,
  ver `backend/schema.sql`).
- **Rotas**: `POST /auth/login` (público), `GET /catalogo` (público — é o
  que o app consulta), `POST/PUT/DELETE /fabricantes[/:id]` e
  `POST/PUT/DELETE /acessorios[/:id]` (exigem token **e** `pode_adicionar`).
- **Offline continua funcionando pra consulta**: toda vez que uma tela abre,
  o app tenta buscar `GET /catalogo` e guarda o resultado em
  `localStorage.catalogoCache` (`prototipo/js/data.js` →
  `sincronizarCatalogo()`); se não tiver internet, a busca falha rápido (6s
  de timeout) e a tela usa o que já tem em cache, sem travar. **Só
  adicionar/editar/remover exige internet de verdade** — sem escrita local
  "otimista", porque a fonte da verdade agora é o banco.
- **Favoritos continuam 100% locais** (`localStorage`, nunca vão pro
  backend) — são preferência do aparelho, não dado administrativo.
- **Imagens**: o catálogo original (3 fabricantes + 6 acessórios) continua
  usando os arquivos em `prototipo/assets/` (colunas `logo`/`imagem` no
  banco, mesmo esquema de slot-com-fallback de sempre); o que é cadastrado
  pelo próprio usuário continua indo direto como base64 (colunas
  `logo_base64`/`imagem_base64`), sem precisar de um serviço de storage de
  arquivo separado.
- **Rodar localmente**: `cd backend && npm install`, copiar
  `.env.example` pra `.env` e preencher `DATABASE_URL` (connection string
  do Neon) e `JWT_SECRET`, `npm run seed` (popula o catálogo original + o
  usuário `montador`/`1234`) e `npm start`. `prototipo/js/api.js` tem a
  constante `API_BASE_URL` apontando pro backend (`http://localhost:3000`
  em dev — trocar pela URL publicada quando o backend for hospedado, ver
  "Como publicar o backend" abaixo).

## Fora do escopo (v1)
- Publicação em loja (Play Store) — distribuição é por APK direto (ver
  item 11 e "Como gerar/publicar uma atualização" abaixo).
- Tela de administração pra gerenciar usuários/permissões (hoje é direto
  no banco — ver "Backend" acima e "Próximos passos").
- Orçamento, agenda ou gestão de clientes.

## Telas
| Tela | Descrição |
|---|---|
| Início | Lista de fabricantes — os 3 fixos + os cadastrados pelo usuário (logo + nome + qtd. de acessórios) |
| Fabricante | Lista única de acessórios do fabricante (catálogo + meus, cada item com selo "Catálogo"/"Meu"), busca, botão "+ adicionar" (só visível com permissão) |
| Detalhe do acessório | Foto, fabricante, categoria, resumo dos passos, botão "Ver instalação" |
| Passo a passo | Imagem grande + texto do passo, navegação, progresso |
| Adicionar / Editar | Alterna entre aba "Acessório" (fabricante, dados + passos dinâmicos foto+texto) e aba "Fabricante" (nome, cor, logo). Mesma tela é reaproveitada, pré-preenchida, quando vem de "Editar". Exige login **com permissão** (`podeAdicionar`); a aba "Adicionar" da barra inferior e o botão "+" só aparecem pra quem tem essa permissão. |
| Conta (login) | Login com usuário/senha, ou dados da conta logada + botão "Sair" |
| Favoritos | Lista de todos os acessórios marcados como favoritos, de qualquer fabricante |
| Menu lateral (☰) | Painel deslizante com link para Favoritos e a versão do app |

## Fluxo principal
Início → escolhe fabricante → lista de acessórios → escolhe acessório →
Detalhe → "Ver instalação" → Passo 1 → ... → Passo N → volta ao Detalhe.

Fluxo alternativo (acessório): Início → fabricante → "+ Adicionar" → se não
estiver logado, vai para Conta/login → após entrar, volta para o formulário
→ preenche dados e passos → salva → volta para a lista do fabricante com o
novo acessório.

Fluxo alternativo (fabricante): Início → aba "Adicionar" → se não estiver
logado, vai para Conta/login → após entrar, troca para a aba "Fabricante" →
preenche nome/cor/logo → salva → volta para a tela do novo fabricante.

## Como gerar/publicar uma atualização do APK
1. Mudar o que for preciso em `prototipo/` (o código-fonte de verdade).
2. Subir o número em `prototipo/js/versao.js` (ex: `"1.0.0"` → `"1.1.0"`)
   **e** em `android/app/build.gradle` (`versionCode` +1, `versionName`
   igual ao de versao.js) — os dois precisam mudar juntos.
3. `npx cap sync android` (copia os arquivos novos pro projeto Android).
4. Gerar o APK: dentro de `android/`, rodar
   `.\gradlew.bat assembleRelease --no-daemon` (o `--no-daemon` evita um
   problema conhecido no Windows de "Unable to delete directory" durante
   o build — ver HISTORICO.txt de 2026-07-12). Use `assembleDebug` só
   pra testar rápido; `assembleRelease` é o assinado, pra distribuir de
   verdade.
5. Publicar como uma "Release" nova no GitHub, com uma tag igual à versão
   (ex: `v1.1.0`) e o APK (`android/app/build/outputs/apk/release/app-release.apk`)
   anexado.
6. Da próxima vez que um montador abrir o app com internet, ele vê o
   aviso de atualização sozinho — não precisa reinstalar manualmente
   nem mandar o APK por fora.

## Como publicar o backend
Já feito em 2026-07-12: backend publicado no Render em
`https://acessorios-manual-app.onrender.com` (banco Neon), `API_BASE_URL`
em `prototipo/js/api.js` já aponta pra lá, e a v1.1.0 do APK (gerada com
essa URL) já foi publicada como Release no GitHub. Os passos abaixo ficam
registrados pra quando for preciso recriar/trocar de serviço:

1. Criar uma conta gratuita em [neon.tech](https://neon.tech) (se ainda
   não tiver) e um projeto Postgres; copiar a connection string.
2. Criar uma conta gratuita em [render.com](https://render.com), "New +"
   → "Web Service", apontando pro repositório do GitHub, pasta raiz
   `backend/`. Comando de build `npm install`, comando de start
   `npm start`.
3. Nas variáveis de ambiente do serviço no Render, adicionar
   `DATABASE_URL` (a connection string do Neon) e `JWT_SECRET` (um valor
   aleatório longo — igual ao `backend/.env` local, mas gerar um novo pra
   produção).
4. Depois do primeiro deploy, popular o catálogo original + usuário
   `montador`/`1234`: se o plano do Render tiver a aba "Shell", rodar
   `npm run seed` por lá; no plano free (sem Shell), rodar
   `npm run seed` numa máquina local com a `DATABASE_URL` do Neon no
   `backend/.env` — é o mesmo banco, então funciona igual.
5. Copiar a URL pública que o Render dá pro serviço (ex:
   `https://nome-do-servico.onrender.com`) e colar em `API_BASE_URL`, no
   topo de `prototipo/js/api.js`, no lugar da URL antiga.
6. Gerar um novo APK (ver "Como gerar/publicar uma atualização do APK"
   acima) e publicar a release — a partir daí o app fala com a API de
   verdade.

## Próximos passos
- Definir a lista real de pessoas com acesso e a permissão
  (`pode_adicionar`) de cada uma — hoje só existe o usuário de exemplo
  `montador`/`1234` (senha com hash no banco, mas ainda a senha de
  exemplo). Trocar via SQL direto no Neon (não tem tela de administração
  ainda, ver "Fora do escopo").
- Substituir os slots de imagem pelos arquivos reais (logos e fotos de
  produto), conforme `prototipo/assets/README.md`.
- Revisar/reescrever os textos de instalação dos itens de catálogo.
- Validar telas com o usuário final (montador).
