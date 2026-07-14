# Escopo — App Manual do Montador (Acessórios para Móveis - Madeirol)

## Objetivo
Ferramenta de apoio para montadores de móveis: consultar acessórios/ferragens
(dobradiças, corrediças, pés, articuladores etc.) organizados por fabricante —
Blum, Häfele, Hettich — com imagem, especificações e passo a passo de
instalação. Desde 2026-07-14 também dá pra consultar manuais de
**eletrodomésticos** (geladeira, fogão etc.), num catálogo separado dentro da
mesma tela Início. O próprio montador também pode cadastrar acessórios e
aparelhos adicionais.

## Público-alvo
Montadores de móveis autônomos ou de empresas de montagem, que trabalham com
ferragens de fabricantes diferentes e precisam consultar rapidamente como
instalar cada peça.

## Funcionalidades (v1 / MVP)
1. **Catálogo de acessórios (tela Início)** — desde 2026-07-13 o principal
   da tela Início é o catálogo de acessórios (não mais a lista de
   fabricantes): uma busca por nome/categoria e uma lista única com todos
   os acessórios (catálogo + cadastrados pelo usuário), cada card já
   mostrando de qual fabricante é. O fabricante virou informação
   **secundária**: uma fileira de chips (Blum, Häfele, Hettich... + "Todos")
   filtra a lista rápido, sem precisar abrir uma tela separada; busca e
   filtro por chip funcionam juntos. Desde 2026-07-14, um alternador no
   topo ("Ferragens" / "Eletrodomésticos") troca entre os dois catálogos
   (ver item 13) — cada fabricante tem um `tipo`, e a busca/chips/lista
   só mostram o que pertence à aba ativa.
2. **Tela do fabricante** — acessível pela tela de detalhe do acessório
   (seta "←" volta pra ela) ou pela edição de um acessório existente; lista
   os acessórios daquele fabricante e tem os botões de editar/remover o
   próprio fabricante (item 8).
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
   (por cima da própria tela, não precisa sair dela) com links pra
   "Favoritos" e "Como encontrar um manual" (item 12); mais a versão do
   app no rodapé. Não duplica a navegação da barra inferior (Início/
   Adicionar/Conta); serve pra coisas que não têm outro lugar fixo.
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
    `prototipo/js/atualizacao.js` e `prototipo/js/versao.js`. Desde
    2026-07-13, o app detecta quando está rodando instalado de verdade
    (`prototipo/js/plataforma.js`, via `window.Capacitor.isNativePlatform()`)
    e usa a tela cheia nesse caso em **qualquer tamanho de aparelho**
    (celular ou tablet) — antes disso a regra olhava só a largura da tela
    e não cobria tablet. No navegador de computador (preview de
    desenvolvimento) continua mostrando a moldura de celular.
12. **Tela de ajuda** ("Como encontrar um manual", acessível pelo menu
    lateral) — explica em 3 passos as formas de achar um manual: busca por
    nome, navegação por fabricante e favoritos.
13. **Catálogo de eletrodomésticos** (desde 2026-07-14) — segundo catálogo,
    separado do de ferragens (item 1), acessível pelo alternador na tela
    Início. Cada fabricante tem um campo `tipo` (`ferragem` ou
    `eletrodomestico`, ver "Backend"); ao cadastrar um fabricante novo
    (aba "Fabricante" da tela Adicionar) você escolhe o tipo. Ao cadastrar
    um acessório/aparelho, o seletor de fabricante mostra os dois grupos
    separados ("Ferragens" / "Eletrodomésticos"). Começou vazio e foi
    populado em 2026-07-14 com 4 fabricantes e 10 aparelhos de exemplo
    pesquisados (ver "Catálogo pré-cadastrado" abaixo); se um fabricante
    novo for cadastrado sem nenhum outro do mesmo tipo existir ainda, a
    tela "Adicionar" cai direto na aba "Fabricante" já com o tipo
    pré-selecionado, pra guiar o cadastro.
14. **Vídeo nos passos de instalação** (desde 2026-07-14) — cada passo,
    além da foto, aceita opcionalmente um vídeo (upload direto do
    celular, máx. 15MB, mesmo esquema de base64 usado pra fotos — ver
    "Imagens e logos"). Aparece no passo a passo (tela "Passo a passo")
    logo acima do texto, com os controles padrão de vídeo do navegador.
15. **Avaliação do passo a passo** (desde 2026-07-14) — no último passo,
    "Chegou ao fim! Essa instrução te ajudou?" com botões 👍/👎. Não exige
    login; 1 voto por acessório por aparelho (controlado via
    `localStorage`, não é à prova de burla, mas suficiente pra um app
    interno). Quem tem permissão de editar (`podeAdicionar`) vê a
    contagem agregada ("👍 12 · 👎 3") na tela de detalhe do acessório —
    serve de sinal de quais textos/passos precisam ser reescritos.
16. **Compartilhar manual** (desde 2026-07-14) — botão "📤 Compartilhar" na
    tela de detalhe do acessório. Gera um link público
    (`<API_BASE_URL>/manual/:id`) que abre o passo a passo numa página
    web simples, **sem precisar ter o app instalado nem estar logado**
    (rota pública nova no backend, ver "Backend"). Usa o compartilhamento
    nativo do aparelho quando disponível; senão abre o WhatsApp com o
    link pronto.

## Catálogo pré-cadastrado (exemplos incluídos no protótipo)
- **Blum**: Articulador Aventos HK-XS, Corrediça Tandem
- **Häfele**: Pé para rodapé 80, Trilho telescópico
- **Hettich**: Dobradiça Sensys (com amortecimento), Sistema Quadro

Os textos de instalação desses itens são **genéricos/placeholder** — ajuste
para o passo a passo real de cada peça depois.

## Catálogo de eletrodomésticos (cadastrado em 2026-07-14)
Populado a partir de uma pesquisa em manuais/páginas oficiais dos
fabricantes (fontes documentadas em `eletrodomesticos-pesquisa/README.md`,
pasta que fica fora de `prototipo/` — não é embarcada no APK, é só
material de referência usado pra montar o cadastro):
- **Brastemp**: Fogão de Embutir Clean 5 Bocas, Micro-ondas de Embutir 40L,
  Lava-louças de Embutir, Coifa de Parede, Geladeira de Coluna Embutida
- **Electrolux**: Forno de Embutir Elétrico ou a Gás, Cooktop de Embutir 5
  Queimadores (Celebrate)
- **Fischer**: Cooktop de Embutir Infinity, Forno de Embutir
- **Continental**: Fogão de Embutir Evidenza 5 Bocas

**Duas ressalvas importantes que ficaram nos próprios passos cadastrados:**
1. Medidas de nicho/recorte variam por modelo mesmo dentro da mesma marca —
   os passos que citam uma medida pedem pra conferir o gabarito/manual do
   modelo específico antes de cortar bancada ou fechar marcenaria.
2. Fogão/forno/cooktop **a gás**: a ligação de gás no Brasil segue a NBR
   13103 e exige instalador credenciado — os passos deixam claro que o
   papel do montador é preparar e fixar o nicho, não fazer a ligação de gás.

Nenhum desses itens tem foto (nem do produto nem dos passos) ainda — foi
cadastrado só com texto; fica como próximo passo adicionar fotos reais.

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
  ver `backend/schema.sql`). Cada fabricante tem uma coluna `tipo`
  (`ferragem` ou `eletrodomestico`, default `ferragem`) que separa os dois
  catálogos que aparecem no alternador da tela Início (item 1/13).
- **Rotas**: `POST /auth/login` (público), `GET /catalogo` (público — é o
  que o app consulta), `POST/PUT/DELETE /fabricantes[/:id]` e
  `POST/PUT/DELETE /acessorios[/:id]` (exigem token **e** `pode_adicionar`),
  `POST /acessorios/:id/avaliacao` (público, `{util: true|false}` — item
  15), `GET /manual/:id` (público, página HTML do manual — item 16) e
  `GET /assets/*` (estático, serve `prototipo/assets/` pra essa página
  funcionar fora do app).
- **Vídeo dos passos** (item 14): coluna `video_base64` em `passos`, mesmo
  esquema de upload direto das fotos — **sem serviço de storage de vídeo
  separado**, o arquivo vira base64 e vai pro Postgres como os demais.
  Isso tem um limite prático: vídeo pesa muito mais que foto, então o
  upload é limitado a 15MB por vídeo no cliente (`prototipo/adicionar.html`)
  e o corpo das requisições no backend foi ampliado pra 60MB
  (`express.json({ limit: "60mb" })`). **Fique de olho no uso de
  armazenamento do Neon** (free tier tem limite de espaço) se muitos
  passos passarem a ter vídeo — se isso virar um problema, a solução
  correta é migrar pra um serviço de storage de vídeo de verdade
  (ex: Cloudinary, Bunny Stream), o que está fora do escopo atual.
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
- Tela de administração pra gerenciar usuários/permissões pelo app — foi
  implementada e depois desfeita a pedido (ver `HISTORICO.txt`,
  2026-07-13); criar/editar login continua sendo feito direto no banco.
- Orçamento, agenda ou gestão de clientes.

## Telas
| Tela | Descrição |
|---|---|
| Início | Alternador Ferragens/Eletrodomésticos + catálogo de acessórios (busca por nome + chips de fabricante pra filtrar, "Todos" por padrão) — fabricante é secundário aqui, ver itens 1 e 13 |
| Fabricante | Lista única de acessórios do fabricante (catálogo + meus, cada item com selo "Catálogo"/"Meu"), busca, botão "+ adicionar" (só visível com permissão); botões de editar/remover o fabricante |
| Detalhe do acessório | Foto, fabricante, categoria, resumo dos passos, botão "Ver instalação", botão "📤 Compartilhar" (item 16); contagem de avaliações (item 15) visível pra quem tem permissão |
| Passo a passo | Imagem grande + vídeo opcional (item 14) + texto do passo, navegação, progresso; no último passo, avaliação "essa instrução te ajudou?" (item 15) |
| Adicionar / Editar | Alterna entre aba "Acessório" (fabricante — agrupado por Ferragens/Eletrodomésticos no seletor — dados + passos dinâmicos com foto, vídeo opcional e texto) e aba "Fabricante" (tipo, nome, cor, logo). Mesma tela é reaproveitada, pré-preenchida, quando vem de "Editar". Exige login **com permissão** (`podeAdicionar`); a aba "Adicionar" da barra inferior e o botão "+" só aparecem pra quem tem essa permissão. |
| Manual público (`/manual/:id`) | Página HTML simples servida pelo backend (fora do app) — foto/vídeo/texto de cada passo, sem login, sem edição; é o que abre quando alguém recebe o link do "Compartilhar" (item 16) |
| Conta (login) | Login com usuário/senha, ou dados da conta logada + botão "Sair" |
| Favoritos | Lista de todos os acessórios marcados como favoritos, de qualquer fabricante |
| Ajuda | "Como encontrar um manual" — 3 dicas (busca, fabricante, favoritos) |
| Menu lateral (☰) | Painel deslizante com links pra Favoritos, Ajuda e a versão do app |

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
- Adicionar fotos (produto e passos) aos 10 aparelhos de eletrodoméstico
  cadastrados em 2026-07-14 — foram cadastrados só com texto.
- Revisar os textos de instalação de eletrodomésticos com alguém da área
  antes de divulgar pros montadores — foram compilados de manuais/páginas
  oficiais dos fabricantes, mas nunca testados na prática (ver ressalvas
  em "Catálogo de eletrodomésticos" acima).
- Acompanhar o uso de armazenamento do Neon depois que vídeos de passo
  começarem a ser cadastrados de verdade (ver "Backend" > vídeo dos
  passos) — se ficar apertado, migrar pra um serviço de storage de vídeo
  dedicado.
- Trocar a senha do usuário de exemplo `montador`/`1234` por uma senha de
  verdade — criar/editar login continua sendo feito direto via SQL no
  Neon (ver "Fora do escopo").
- Substituir os slots de imagem pelos arquivos reais (logos e fotos de
  produto), conforme `prototipo/assets/README.md`.
- Revisar/reescrever os textos de instalação dos itens de catálogo.
- Validar telas com o usuário final (montador).
