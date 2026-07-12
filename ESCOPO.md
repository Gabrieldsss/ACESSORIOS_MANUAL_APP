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
   foto do produto, e N passos de instalação (cada um com foto + texto),
   salvos localmente (upload real de foto, sem precisar editar arquivos).
6. **Cadastro de fabricante próprio** — na mesma tela "Adicionar", alternando
   para a aba "Fabricante": nome, cor de destaque e logo (upload, opcional).
   O fabricante criado passa a aparecer na lista de fabricantes e no seletor
   de fabricante do cadastro de acessório.
7. **Login restrito para quem cadastra** — tela "Conta" (aba 👤) com
   usuário/senha fixos no código (ver `prototipo/js/auth.js`). Só quem
   estiver logado consegue abrir a tela "Adicionar" (fabricante ou
   acessório); quem só quer consultar os fabricantes e os manuais não
   precisa entrar. É um login **só de protótipo** (sem servidor): as senhas
   ficam no JavaScript, então não deve ser tratado como controle de acesso
   seguro de verdade — isso só existirá quando o app tiver backend (ver
   "Próximos passos").
8. **Editar e remover qualquer fabricante/acessório** — botões "Editar" e
   "Remover" na tela de detalhe do acessório e na tela do fabricante,
   visíveis para **qualquer** item (inclusive o catálogo fixo e os 3
   fabricantes fixos), mas só aparecem para quem está logado. Editar
   reaproveita a tela "Adicionar" pré-preenchida; remover pede confirmação
   antes de apagar, e remover um fabricante também remove os acessórios
   cadastrados nele. Como o catálogo fixo é código (não um cadastro de
   verdade), editar/remover um item fixo salva a alteração/remoção "por
   cima" no localStorage — ver `prototipo/js/data.js`.
9. **Menu lateral** — ícone ☰ no topo de toda tela, abre um painel deslizante
   (por cima da própria tela, não precisa sair dela) com o link para
   "Favoritos" e a versão do app. Não duplica a navegação da barra inferior
   (Início/Adicionar/Conta); serve pra coisas que não têm outro lugar fixo.
10. **Favoritos** — botão de coração (♡/♥) em qualquer acessório, tanto na
    lista de um fabricante quanto na tela de detalhe, pra marcar/desmarcar
    como favorito sem precisar estar logado (é só uma preferência de
    consulta, não uma edição). A tela "Favoritos" (acessível pelo menu
    lateral) lista todos os acessórios marcados, de qualquer fabricante,
    com um atalho pra cada um. Remover um acessório também tira ele dos
    favoritos automaticamente.

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

## Fora do escopo (v1)
- Login com backend / senhas com hash / sincronização em nuvem (o login
  atual é só um controle de acesso de protótipo, ver item 7 acima).
- Geração de APK ou publicação em loja.
- Orçamento, agenda ou gestão de clientes.

## Telas
| Tela | Descrição |
|---|---|
| Início | Lista de fabricantes — os 3 fixos + os cadastrados pelo usuário (logo + nome + qtd. de acessórios) |
| Fabricante | Lista de acessórios do fabricante (catálogo + meus), busca, botão "+ adicionar" |
| Detalhe do acessório | Foto, fabricante, categoria, resumo dos passos, botão "Ver instalação" |
| Passo a passo | Imagem grande + texto do passo, navegação, progresso |
| Adicionar / Editar | Alterna entre aba "Acessório" (fabricante, dados + passos dinâmicos foto+texto) e aba "Fabricante" (nome, cor, logo). Mesma tela é reaproveitada, pré-preenchida, quando vem de "Editar". Exige login. |
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

## Próximos passos (depois do protótipo)
- Substituir os slots de imagem pelos arquivos reais (logos e fotos de
  produto), conforme `prototipo/assets/README.md`.
- Revisar/reescrever os textos de instalação dos itens de catálogo.
- Validar telas com o usuário final (montador).
- Definir a lista real de pessoas com acesso a editar/adicionar/remover
  (hoje só tem 1 usuário de exemplo em `prototipo/js/auth.js`).
- Só então decidir stack definitiva (nativo/Flutter/RN) para gerar o app
  real — nesse momento o login também precisa virar de verdade (backend +
  senha com hash), já que o de protótipo não é seguro.
