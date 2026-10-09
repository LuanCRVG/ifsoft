# NT 2026.008 v1.00 - Valor Líquido do Produto

Análise realizada em **01/10/2026** para acompanhamento técnico, com base no [PDF enviado](documentos/nt-2026-008-v1.00-rtc-valor-liquido-produto.pdf) e no [tópico do Projeto ACBr](https://www.projetoacbr.com.br/forum/topic/95140-publicada-nota-t%C3%A9cnica-criando-novos-campos-de-valoriza%C3%A7%C3%A3o-para-maior-transpar%C3%AAncia-na-nota-fiscal/).

## Escopo e cronograma

A NT altera o XML e as regras de valorização da **NF-e, modelo 55**, e da **NFC-e, modelo 65**, com campos que distinguem o valor líquido do produto dos tributos incorporados ao preço. O grupo de ICMS previsto no pagamento antecipado tem uso restrito à NF-e, conforme as condições abaixo.

| Entrega | Homologação | Produção |
| --- | --- | --- |
| Alterações gerais do leiaute e das regras listadas na primeira linha do cronograma | 05/10/2026 | 03/11/2026 |
| Exigência do grupo de ICMS previsto: regra NB01-30 | 01/02/2027 | 01/03/2027 |

Os dois marcos constam da **página 3**. O registro do site usa o prazo geral de novembro; a exceção NB01-30 permanece nas observações, sem duplicar a contagem da NT.

A nova nota não recebeu marcação manual de urgência. Pela regra de 30 dias antes da produção, entra automaticamente em Urgentes em **04/10/2026**. A nota do DANFE mantém a prioridade manual já solicitada.

A capa indica setembro/2026, enquanto o ACBr anuncia a publicação em 01/10/2026. A análise está datada de 01/10/2026; os prazos do cadastro seguem o cronograma do PDF.

## Novos campos

O leiaute da **página 6** acrescenta:

| Campo / grupo | ID | Papel |
| --- | --- | --- |
| `vUnComLiq` | I11b | Valor unitário líquido, sem tributos; formato 11v0-10 |
| `vProdLiq` | I11c | Valor líquido do item, sem tributos; formato 13v2 |
| `ICMSPrevistoPagtoAntecip` | NB01 | Grupo específico de ICMS previsto no pagamento antecipado |
| `vICMSPrevisto` | NB02 | ICMS que incidirá no fornecimento futuro; formato 13v2 |
| `vProdLiqTot` | W01a | Soma dos valores líquidos dos itens; formato 13v2 |

`vUnComLiq` e `vProdLiq` pertencem a uma sequência com ocorrência **0-1**, indicada como obrigatória futuramente. Os dois campos têm ocorrência **1-1 dentro dessa sequência**. A regra de ausência de `vProdLiq`, I11c-10, também está marcada como implementação futura na página 7. Não confundir disponibilidade dos campos e validação do conteúdo informado com ativação da obrigatoriedade geral.

## Cálculo e totalização

**Valor líquido do item:** para nota normal (`finNFe=1`), quando `vProdLiq` for informado, a regra I11c-20 compara esse valor com `vUnComLiq × qCom`, aceitando diferença de até **0,01 para mais ou para menos**. Divergência gera a rejeição **1279** (página 7).

**Total líquido:** se algum item tiver `vProdLiq`, a regra W01a-10 exige `vProdLiqTot` (rejeição **1282**). Se o total for informado, W01a-20 exige que corresponda à soma dos valores líquidos dos itens (rejeição **1283**). Ambas constam da página 10.

**Preço bruto e tributos:** a introdução, página 4, explica que IBS/CBS incorporados a `vProd` não devem ser adicionados novamente a `vNFTot`. A observação do leiaute, página 6, indica que **a partir de 2027** IBS/CBS/IS compõem o valor bruto, com exceção das importações. É necessário respeitar a transição temporal; a data de disponibilização do campo não deve ser confundida com o início dessa composição.

**Regras de `vItem`:** nas páginas 9 e 10, as parcelas adicionais de IBS/CBS/IS estão riscadas, assim como as antigas exceções de 2025/2026. A extração simples do texto ainda mostra essas parcelas. A leitura visual confirma sua remoção da redação. As regras VB01-10 e VB01-20 permanecem com a observação **Implementação Futura**.

Como encaminhamento de desenvolvimento, revisar a origem do preço e as rotinas de `vProd`, `vItem` e `vNFTot` em conjunto, evitando contabilizar os mesmos tributos duas vezes. Esta é uma recomendação derivada da leitura da NT; não representa uma implementação fiscal já validada no sistema.

## Pagamento antecipado

O grupo `ICMSPrevistoPagtoAntecip` é admitido nos cenários de **NF-e modelo 55** com `tpNFDebito=06` ou `tpOperGov=4` (páginas 6-8). Quando não houver ICMS devido no fornecimento futuro, a página 6 orienta informar **zero** em `vICMSPrevisto`.

| Regra | Modelo | Situação | Rejeição no PDF |
| --- | --- | --- | --- |
| NB01-10 | 65 | Grupo NB informado na NFC-e | 1280 |
| NB01-20 | 55 | Grupo NB informado fora dos dois cenários previstos | 1280 |
| NB01-30 | 55 | Grupo NB ausente em um dos cenários previstos | 1281 |

NB01-30 tem os prazos próprios de fevereiro/março de 2027. O tópico do ACBr apresenta **1280** para essa regra; a **página 8 do PDF informa 1281**, adotado nesta análise.

B25-80 ganha uma exceção que permite o grupo `ICMS/ICMSPrevistoPagtoAntecip` quando `tpNFDebito=06`. As demais exceções da regra devem ser preservadas (página 7).

## Regra removida

A regra **UB16-10**, associada à rejeição **1104** por divergência da base de IBS/CBS, foi removida. A página 8 apresenta a redação antiga riscada e identifica a remoção. Isso altera a validação do documento; não dispensa a determinação correta da base dos tributos.

## Dependência do ACBr

O tópico consultado em 01/10/2026 informa que adequações nas soluções ACBr serão necessárias e cita a tarefa **ACBr-9950**. A postagem anuncia a tarefa, sem confirmar sua entrega.

Como encaminhamento técnico, acompanhar a implementação e conferir os schemas, componentes e eventuais rotinas próprias de valorização utilizadas pelo sistema. O cadastro contém o PDF para consulta e o link para acompanhar o tópico.

## Verificações recomendadas

Os itens abaixo são recomendações de teste derivadas da análise:

- Conferir os novos campos em NF-e e NFC-e, incluindo emissão com e sem a sequência líquida, respeitando as regras de ativação.
- Testar `vUnComLiq` com até 10 casas decimais e quantidades fracionárias, preservando a precisão até a totalização.
- Testar a comparação do item nos limites de ±0,01 e fora deles, com `finNFe=1`.
- Testar total líquido ausente e total líquido divergente em notas com vários itens.
- Testar NFC-e com o grupo NB para confirmar a rejeição por uso indevido.
- Testar NF-e com pagamento antecipado e operação governamental aplicável, com ICMS previsto positivo e zero.
- Separar o teste da exigência NB01-30 dos testes de novembro, conforme seus prazos de 2027.
- Revisar cenários de importação e a transição 2026/2027, sem duplicar IBS/CBS/IS nas totalizações.

Observação documental: o cabeçalho da página 6 menciona NT 2026.006, embora a capa, o cronograma e as demais páginas identifiquem NT 2026.008. A identificação do cadastro segue a capa e o conteúdo do documento enviado.
