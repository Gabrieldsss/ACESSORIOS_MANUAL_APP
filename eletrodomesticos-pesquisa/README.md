# Pesquisa: eletrodomésticos de embutir (pra aba Eletrodomésticos do app)

Pesquisa de fabricantes/aparelhos comuns em armários planejados (forno,
cooktop/fogão, coifa, micro-ondas, lava-louças, geladeira de coluna),
compilada de manuais oficiais e páginas de suporte dos próprios
fabricantes, pra servir de ponto de partida no cadastro da aba
**Eletrodomésticos** (ver `ESCOPO.md` > funcionalidade 13).

## ⚠️ Antes de publicar isso pros montadores, leia isto

1. **Medidas de corte/nicho variam por modelo, mesmo dentro da mesma
   marca.** Sempre que um passo pede uma medida exata de recorte
   (bancada, nicho), tratei como **referência de faixa/exemplo**, nunca
   como valor definitivo — o texto final que for pro app precisa deixar
   claro "confira o gabarito impresso que acompanha o aparelho antes de
   cortar", porque é assim que os próprios fabricantes recomendam (errar
   o corte estraga bancada/marcenaria ou o aparelho).
2. **Fogão e forno a gás**: instalação/conexão de gás no Brasil segue a
   NBR 13103 e normalmente exige instalador credenciado pela
   concessionária local (ou pelo menos alguém habilitado) — o
   papel do montador de móveis aqui é **posicionar e fixar o
   aparelho no nicho**, não fazer a ligação de gás. Isso precisa ficar
   escrito no app pra não incentivar ninguém a ligar gás por conta
   própria.
3. Todo item abaixo tem a fonte (link) de onde a informação veio. Não
   inventei nenhuma medida — onde a busca não trouxe um número
   específico e confiável, deixei como orientação geral (ex: "20mm de
   folga lateral, confirme no manual do modelo") em vez de chutar.

## Como usar isso no app

Cada arquivo `.json` aqui representa **um fabricante**, no formato que
bate com o que `POST /fabricantes` e `POST /acessorios` esperam
(`prototipo/js/data.js` → `criarFabricante()`/`criarAcessorio()`):

```json
{
  "fabricante": { "nome": "...", "cor": "#......", "tipo": "eletrodomestico" },
  "aparelhos": [
    {
      "nome": "...",
      "categoria": "...",
      "fonte": "URL de onde veio a informação (não faz parte do cadastro, é só referência)",
      "passos": [ { "texto": "..." }, { "texto": "..." } ]
    }
  ]
}
```

O campo `"fonte"` é só documentação minha — **não mandar esse campo pro
backend**, ele não existe no schema. Antes de cadastrar de verdade pela
tela "Adicionar" (ou por um script), dá pra:
1. Revisar/ajustar os textos dos passos (deixei no tom que o app já usa,
   mas vale seu olhar antes de publicar).
2. Adicionar fotos de cada aparelho e de cada passo (aqui só tem texto —
   isso eu não tenho como pesquisar/gerar).
3. Decidir se quer cadastrar todos os itens ou só uma seleção.

## Fabricantes incluídos

- `brastemp.json` — Fogão/cooktop de embutir, micro-ondas de embutir,
  lava-louças de embutir, coifa de parede, geladeira de coluna embutida.
- `electrolux.json` — Forno de embutir, cooktop de embutir.
- `fischer.json` — Cooktop de embutir, forno de embutir.
- `continental.json` — Fogão de embutir.

## Fonte de referência cruzada (medidas de nicho por marca/modelo)

Tabela comparativa útil (várias marcas, nichos de fogão de embutir):
https://www.portaldoeletrodomestico.com.br/tabela_dimensao_embutir.htm
