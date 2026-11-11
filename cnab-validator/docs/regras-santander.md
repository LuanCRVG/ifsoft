# Santander H7800 · validação CNAB 400

Referência: manual entregue pelo banco **H7800_Layout_de_Cobranca_353_400_posicoes_V_2_38_Out_2026_Portugues.pdf**, edição **V2.38, Outubro/2026**. Análise em **11/11/2026**. Páginas abaixo são as numerações impressas no manual (a página do PDF é a impressa + 1).

| Conferência | Campo / referência |
|---|---|
| Estrutura | 400 bytes por registro, controles, codificação, sequência 395–400, Header 0 e Trailer 9 únicos (pp. 7–18) |
| Banco e transmissão | 033 ou 353 em 077–079; transmissão numérica de 20 posições em 027–046 e confronto com cadastro (Header, nota 1) |
| Agência e contas | Detalhe 018–037, identificador 383 e complemento 384–385; conta legada ou de 10 posições (nota 2) |
| Carteira e movimento | Tipo de cobrança em 108, movimento 109–110 (notas 20–21). Cadastro informado 101 corresponde ao tipo 5 neste cenário |
| Nosso número | 063–070, atribuição obrigatória na cobrança rápida com emissão pelo beneficiário; duplicidade de entradas (nota 3) |
| Vencimento e emissão | Datas reais, emissão anterior ao vencimento, vencimento posterior à entrada e até 10 anos (notas 7 e 9) |
| Valor e espécie | Nominal positivo, exceto BDP/BCC; encargos vedados nessas espécies na entrada (notas 6, 8, 10 e 24) |
| Juros | Mora monetária diária 161–173; instrução 08 significa não cobrar juros (nota 25) |
| Multa opcional | Código 4 em 078 e percentual positivo em 079–082; 0200 = 2,00%. Data 102–107 zerada ou posterior ao vencimento (nota 4) |
| Baixa | Instrução 02 = 15 dias; 03 = 30 dias; 04 = não baixar. Sem exigir baixa em todo título (nota 25) |
| Protesto | 06 exige dias em 392–393; 07 = não protestar; Seu Número essencial ao protesto. Não utiliza esses dias como prazo de baixa (notas 22, 25 e 28) |
| Perfil do beneficiário | Instrução 00 pode herdar protesto/baixa do perfil bancário; gera pendência de conferência, sem exigir um perfil na interface (nota 13) |
| Descontos e abatimento | Valores menores que o nominal, datas válidas, segundo desconto em data distinta e soma desconto + abatimento menor que nominal (notas 11–12) |
| Pagador | CPF/CNPJ, inclusive alfanumérico, alinhamento, DV, raiz distinta salvo BDA, endereço e UF (notas 26–27 e 38) |
| Mensagens 2/4/5/6/7 | Associação ao título, conta, sequência, limites de quantidade e áreas reservadas (pp. 7, 14–15) |
| Registro 8 | Tipo/quantidade de pagamentos, limites mínimo/máximo, chave DICT informada e TXID opcional com formato e unicidade (p. 13, notas 16–18 e 34–37) |
| Trailer | Quantidade de todos os registros em 002–007 e total nominal em 008–020; valores ilegíveis deixam soma parcial (p. 18) |

Juros, multa e baixa são condicionais às configurações do título. Não é criada exigência universal desses encargos.

Vigências utilizam o envio pretendido, se informado; caso contrário, a geração do Header ou a data de conferência. O vencimento usa essa referência local como aproximação da entrada bancária, que não pode ser consultada pelo aplicativo.

IOF: desconsiderado a partir de 01/01/2027; o manual informa aceitação sem recolhimento até março/2027 e rejeição após esse período (nota 5). Indicações positivas geram aviso no período de transição e erro a partir de 01/04/2027.

O registro 3 e as operações novas de duplicata não podem ser enviados antes de 06/02/2027 (p. 16). São conferidos vigência, tipos e campos básicos. A análise desses ativos é marcada como parcial: a registradora, a documentação fiscal, o aceite e as condições contratuais não são consultados. Mensagens têm uma ambiguidade documental: a tabela repete 02 na terceira subsequência (p. 14); o aplicativo não inventa uma correção obrigatória para 03.

Não são consultados cadastros bancários, perfil de cobrança, titularidade/existência da chave PIX, contratação ou registradora. Não são recalculados DVs de conta/agência ou Nosso Número: a nota 3 não apresenta uma fórmula na edição recebida. Retornos e CNAB 240 são identificados e ficam fora desta análise de remessa. Datas DDMMAA são interpretadas entre 2000 e 2099.

O cálculo do DV do CNPJ numérico/alfanumérico segue a [documentação técnica da Receita Federal](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf). O teste local de DV não consulta a situação cadastral.

Módulos, UI, exemplos e testes são próprios do Santander. Nenhuma regra é reutilizada implicitamente por outro banco.
