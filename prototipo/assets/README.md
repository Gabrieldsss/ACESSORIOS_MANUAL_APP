# Como colocar as imagens reais

Nenhum arquivo aqui é obrigatório — enquanto não existir, o app mostra um
placeholder com o caminho esperado no lugar da imagem. Basta colocar o
arquivo com o **nome exato** abaixo na pasta certa que ele aparece sozinho,
sem editar nenhum código.

**Já preenchidos:** as 3 logos (`blum.png`, `hafele.png`, `hettich.png`) e a
foto de capa de 3 acessórios (Aventos HK-XS, Pé para rodapé 80, Sensys —
esses três em `.jpg`, os demais nomes abaixo continuam em `.png`). Ainda
faltam as fotos de cada passo e a capa da Tandem, Trilho telescópico e
Quadro.

## Logos dos fabricantes → `assets/logos/`

- `blum.png`
- `hafele.png`
- `hettich.png`

## Fotos de produto e dos passos → `assets/produtos/`

Foto de capa do acessório: `<id-do-acessorio>.png`
Foto de cada passo: `<id-do-acessorio>-passo-<numero>.png`

| Acessório                         | id                          |
| ---------------------------------- | ---------------------------- |
| Articulador Aventos HK-XS (Blum)  | `blum-aventos-hk-xs`        |
| Corrediça Tandem (Blum)           | `blum-tandem`                |
| Pé para rodapé 80 (Häfele)        | `hafele-pe-rodape-80`        |
| Trilho telescópico (Häfele)       | `hafele-trilho-telescopico`  |
| Dobradiça Sensys (Hettich)        | `hettich-sensys`             |
| Sistema Quadro (Hettich)          | `hettich-quadro`             |

Exemplo: para a foto de capa do Aventos HK-XS, adicione
`assets/produtos/blum-aventos-hk-xs.png`. Para a foto do passo 2 desse mesmo
acessório, adicione `assets/produtos/blum-aventos-hk-xs-passo-2.png`.

Cada acessório de catálogo tem 4 passos (passo-1 a passo-4). Formatos aceitos:
qualquer extensão de imagem funciona, mas o app espera `.png` — se usar
`.jpg`, ajuste o caminho em `js/data.js`.

Acessórios que você cadastra pelo próprio app (tela "Adicionar") não
precisam de nada disso — a foto é enviada direto do formulário.
