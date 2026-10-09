# NT 2026.010 v1.00 - DANFE Reforma Tributária

Análise realizada em **01/10/2026** para acompanhamento técnico, com base no [PDF enviado](documentos/nt-2026-010-v1.00-danfe-rtc.pdf) e no [tópico do Projeto ACBr](https://www.projetoacbr.com.br/forum/topic/95131-publicado-leiaute-do-danfe-com-os-campos-da-reforma-tribut%C3%A1ria/).

## Cadastro e cronograma

| Campo | Valor |
| --- | --- |
| Documento fiscal | NF-e, modelo 55 |
| Escopo | Leiaute de impressão em papel e PDF do DANFE |
| Versão | 1.00, outubro/2026 |
| Publicação anunciada pelo ACBr | 01/10/2026 |
| Produção | 01/12/2026 |
| Testes/homologação | Sem data informada; o cronograma traz um traço |
| Prioridade | Urgente, por definição manual |
| NT vigente no cadastro | Sim, como versão de referência; não indica produção já implantada |

O cronograma consta na página 3. O escopo da página 4 é o DANFE da **NF-e modelo 55**; esta análise não estende a mudança à NFC-e, NFS-e ou MDF-e.

## Mudanças de impressão

**Emitente (seção 4.2, página 5):** imprimir o Código do Regime Tributário, `CRT` (C21). O tipo de regime de apuração IBS/CBS tem área reservada, mas sua tag/ID será definida em NT futura. A página 6 determina que esse campo não receba conteúdo até existir definição da origem da informação.

**Produtos/serviços (seção 4.3, página 5):** representar a classificação tributária e os valores que já constam do XML, respeitando o grupo de cada tributo.

| Informação | Tag / ID |
| --- | --- |
| Classificação tributária IBS/CBS | `cClassTrib` / UB14 |
| Base de cálculo IBS/CBS | `vBC` / UB16 |
| Alíquota IBS UF | `pIBSUF` / UB18; com `gRed`, `pAliqEfet` / UB28 |
| Valor IBS UF | `vIBSUF` / UB35 |
| Alíquota IBS Município | `pIBSMun` / UB37; com `gRed`, `pAliqEfet` / UB47 |
| Valor IBS Município | `vIBSMun` / UB54 |
| Alíquota CBS | `pCBS` / UB56; com `gRed`, `pAliqEfet` / UB66 |
| Valor CBS | `vCBS` / UB67 |
| Base de cálculo do IS | `vBCIS` / UB05 |
| Alíquota do IS | `pIS` / UB06 |
| Valor do IS | `vIS` / UB11 |

O nome correto da base do IS no PDF é **`vBCIS`**. A tabela do tópico do ACBr consultado apresenta `vCBIS`; para o mapeamento, seguir a NT enviada.

Quando `gRed` estiver presente, inclusive nas hipóteses de compra governamental descritas na NT, imprimir a **alíquota efetiva**, não apenas a alíquota nominal. Sem `gRed`, imprimir `pIBSUF`, `pIBSMun` e `pCBS`. Para IS, a regra apresentada permanece `pIS`.

**Totais (seção 4.1, páginas 4-5):** incluir o bloco "Total do IBS/CBS/IS" logo após "Total do ICMS/IPI".

| Total | Tag / ID |
| --- | --- |
| CBS | `vCBS` / W56 |
| IBS UF | `vIBSUF` / W41 |
| IBS Município | `vIBSMun` / W46 |
| Imposto Seletivo | `vIS` / W33 |
| IBS monofásico | `vIBSMono` / W58 |
| CBS monofásica | `vCBSMono` / W59 |
| IBS monofásico por retenção | `vIBSMonoReten` / W59a |
| CBS monofásica por retenção | `vCBSMonoReten` / W59b |

**Quadros facultativos (seção 4.4, páginas 5-6):** os modelos identificam em azul e borda tracejada os quadros de exibição facultativa ou condicionada. A impressão depende da existência e da aplicabilidade dos dados no XML. Essa faculdade não permite criar ou inferir conteúdo ausente. Observar as regras próprias de canhoto, duplicatas, FCP/DIFAL, monofásicos/retenções, ISSQN e transporte.

**QR Code (seção 4.5, página 6):** a NT reserva espaço e cita `qrCode` (ZX02) e `urlChave` (ZX03). A ampliação expressa para retrato (`tpImp=1`) e paisagem (`tpImp=2`), com regras de preenchimento, formação e validação, depende de alteração específica em outra NT. A imagem do QR Code no modelo, por si só, não define essas regras.

## Dependência do ACBr

O tópico consultado em 01/10/2026 informa a criação da tarefa **ACBR-9948** para implementar o novo DANFE e indica que as novidades serão divulgadas ali. Essa postagem não comprova que a mudança já foi entregue.

Como encaminhamento técnico, acompanhar a tarefa e conferir a versão do componente e dos relatórios utilizados pelo sistema antes de considerar a impressão pronta. Este é um encaminhamento de implementação derivado da leitura das fontes, não um prazo adicional publicado na NT.

## Verificações técnicas recomendadas

Os modelos das páginas 8 e 9 usam valores fictícios. A página 7 define retrato como referência principal e paisagem como alternativa. Não usar os valores ilustrativos como parâmetros de cálculo.

As verificações abaixo são recomendações da análise para validar a implementação:

- Conferir impressão e exportação PDF em A4, nas orientações utilizadas pelo sistema.
- Testar muitos itens, descrições longas, valores altos e quebras de página, preservando a legibilidade.
- Conferir IBS UF e Município separadamente, CBS, IS e os totais de monofásicos/retenções quando aplicáveis.
- Testar itens sem redução, com `gRed` e com compra governamental, verificando a alíquota efetivamente impressa.
- Validar operações sem dados facultativos, sem inventar informações nem preencher o campo de regime de apuração reservado.
- Conferir correspondência entre os valores impressos e o XML autorizado.
- Tratar o QR Code conforme as regras aplicáveis e reavaliar quando a alteração específica for publicada.
- Concluir os testes internos antes de 01/12/2026; a NT não define uma data própria de homologação.
