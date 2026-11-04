# Mapa de regras e proveniência — Safra CNAB 400

## Fontes

1. **Manual oficial público:** Banco Safra, Manual de Transferência de Arquivos, Cobrança Produto 001, versão maio/2026. [Página oficial](https://www.safra.com.br/servicos/pessoa-juridica/cash-management.htm), seção Cobrança, layout 400; [PDF](https://www.safra.com.br/data/files/7A/96/C0/51/EE79E910E792D4E901B9F9C2/CNAB%20400_05.26.pdf). Consulta em 04/11/2026. Os números abaixo são páginas impressas, começando em 1.
2. **Guia de implantação fornecido:** arquivo 001281%29.pdf, 20 páginas, sem revisão explícita identificada. Não se atribui revisão pela data dos metadados. Usado para cotejar empresa, juros, multa e Trailer. Não é distribuído aqui.
3. **Confirmação da equipe de homologação Safra:** fornecida pelo solicitante e reiterada expressamente na conversa. Cenário de juros monetários diários, multa e baixa após 30 dias. É evidência específica desse cenário, não regra universal do Safra.
4. **Referência técnica:** ACBrBancoSafra.pas fornecido pelo solicitante, sem revisão explícita identificada. Não é especificação bancária. Não é redistribuído aqui.

## Conferência base

| Regra / campo | Posições inclusivas | Origem e comportamento |
| --- | --- | --- |
| Registro, direção, serviço | 1; 2–9; 10–11 | Manual §6.1.1, p8; header0, remessa1/REMESSA, cobrança01 |
| Banco | Header 77–79 | Manual §6.1.1: 422; outro código interrompe regras Safra |
| Empresa | Header 27–40; tipo1 18–31 | Manual pp8–9 e guia fornecido pp5–6; 14 dígitos; compara os dois e o cadastro quando disponível |
| Geração | Header 95–100 | Manual p8; DDMMAA, separada de hoje, conferência e envio |
| Sequência | 395–400 | Manual §6.1; conta todos os registros, começando em000001 |
| Tipos | 1 | Manual §5 p6: 0/1/2/4/6/7/8/9; regras internas de adicionais pendentes |
| Vencimento | Tipo1 121–126 | Manual p9–10; data discriminada obrigatória; confronto com referência é aviso |
| Valor nominal | Tipo1 127–139 | Manual p9; 13 dígitos, duas casas implícitas; BigInt em centavos |
| Juros diários | Tipo1 161–173 | Manual p9 e guia p7; valor monetário diário; zero não é erro por si só |
| Data juros | Tipo1 86–91 | Manual p9 e ACBr; conferência indicativa e aviso para data com valor zero |
| Quantidade de títulos | Trailer 369–376 | Manual p16 e guia p9; compara tipos1 nas remessas convencionais |
| Soma dos títulos | Trailer 377–391 | Manual p16 e guia p9; compara soma nominal exata quando completa |

O leitor mede bytes antes de decodificar em Windows-1252 e exclui somente delimitadores CRLF/LF (CR isolado gera aviso). Linha em branco intermediária ou uma segunda linha vazia no fim não é removida. Não usa trim, não preenche espaços nem completa zeros. UTF-8 multibyte e BOM interrompem a análise posicional por ambiguidade / incompatibilidade com ANSI (§4.2).

## Conjunto único Safra CNAB400

Não há seletor de perfil. As regras abaixo são aplicadas conforme os campos de cada título, utilizando as orientações confirmadas diretamente com a equipe de homologação:

| Campo | Posições | Regra nesse cenário |
| --- | --- | --- |
| Instrução1 | 157–158 | 05 quando houver prazo de baixa positivo |
| Instrução2 | 159–160 | 16 quando houver multa; com baixa, fica na Instrução2 |
| Juros | 161–173 | Valor monetário por dia, por exemplo0000000000033 = R$0,33; não exigir instrução01 |
| Início multa | 206–211 | Vencimento +1 dia em DDMMAA |
| Percentual | 212–215 | 99v99; 0200 significa multa de2%, sem exigir esse percentual em todos os títulos |
| Complemento | 216–218 | 000 |
| Baixa | 382–384 | prazo configurado no título; 030 significa30 dias |

A instrução16 indica multa: valida data, percentual positivo e complemento000. Com prazo de baixa, a combinação precisa ser05/16; sem baixa,16 pode ocupar qualquer instrução admitida na tabela do banco. O percentual não é fixado globalmente em2%. Prazo positivo em382–384 exige05;030 é30 dias, mas outros prazos numéricos configurados não são convertidos para030.

Sem16, o campo compartilhado com abatimento não prova multa. Conteúdo com aparência de data e percentual gera aviso, indicando a possível ausência de16; não gera erro baseado apenas nessa inferência. Instrução05 sem prazo positivo também gera aviso para conferência. Nenhum título é obrigado a cobrar juros, multa ou ter baixa quando não configurados. Baixa não significa quitação da dívida.

A confirmação posterior do usuário sobre05/16 e juros sem01 fundamenta essas regras condicionais. A existência de outra combinação em documentação pública não transforma05/16 em erro. Os bancos futuros permanecem com módulos próprios e indisponíveis até terem regras implementadas.

## Diferenças entre referências

- O manual público §4.1 p5 define agência5 sem DV + conta9 com DV. O módulo recebe agência5 e conta completa9 como no e-mail fictício. Separa conta8+DV1 automaticamente e utiliza o DV da agência0 apenas no cadastro do ERP. Exemplo fictício:12345 +001234567 =12345001234567; no ERP, conta00123456 e DV7. Isso verifica formato, sem calcular ou certificar DV, e não define o cadastro de todos os ERPs.
- O guia fornecido p6 reserva72–101 e p8 reserva382–388. O manual de2026 e o ACBr usam86–91 para juros e382–384 para baixa. O prazo e sua instrução são conferidos quando configurados no título.
- A nota pública §6.2.7 menciona16 na primeira instrução, enquanto a tabela de instruções permite16 nas duas. A homologação confirmada usa05/16. O guia local p12 mostra16/01 para juros+multa e p10 mostra16/10 para protesto+juros+multa. São cenários diferentes.
- A tabela de2026 prevê6 posições para data de juros; sua nota §6.2.9 cita DDMMAAAA. Essa divergência impede afirmar validação definitiva desse campo; datas suspeitas geram aviso.
- Tipo8 representa transferência de carteira, não é presumido como mero complemento de tipo1. Seus totais exigem tratamento próprio; o aplicativo não reprova um Trailer por essa inferência.
- A contagem de títulos pelos tipos1 é a interpretação operacional de remessa convencional, consistente com o ACBr fornecido. O manual não fornece fórmula explícita para arquivos com transferências.

## Integração ACBr: pistas, não regras bancárias

Na referência local, o gerador400 usa Cedente.Agencia com5 posições (sem concatenar AgenciaDigito), Cedente.Conta com8 e ContaDigito com1; header/detalhe usam essa composição. DataMoraJuros preenche86–91, ValorMoraJuros preenche161–173 e DataBaixa−Vencimento preenche382–384. Instrucao1/Instrucao2 são gravadas nas respectivas posições; a rotina de baixa não insere05 automaticamente. Portanto, o ERP precisa produzir as instruções corretas para seu cenário.

O gerador fornecido emite os campos de multa para ocorrência01, PercentualMulta positivo e16 em algum slot. Este comportamento não vira uma regra universal do validador. CodigoCedente aparece no caminho de retorno, não substitui a composição na remessa400. A versão integrada ao ERP pode comportar-se de outra maneira.

## Limites e classificação

Erro é uma divergência com uma regra aplicável. Aviso sinaliza dúvida, escopo parcial, conflito documental, suspeita ou condição contratual. Informação representa uma verificação atendida. Uma conferência corresponde a um item do array checks; as contagens são derivadas desse array. O aplicativo nunca mostra dados simulados como se fossem análise real.

Não são cobertos todos os campos do manual, dados cadastrais, códigos de ocorrência, produtos, instruções alternativas, duplicidade de nosso número, regras específicas de modalidade/carteira ou condições de aceite. Novos controles precisam de evidência primária e testes. Todo relatório declara esse escopo parcial.

## Interpretação do e-mail para o ERP Safra

Os únicos dados de exemplo são fictícios: NOME DA EMPRESA; agência12345 - Barra; conta001234567; EMISSÃO EMPRESA;100% SAFRA; padrão400; produtoCOBRANÇA; carteira1. Nenhuma conta real de cliente é incluída.

O usuário informa somente a agência completa de5 posições e a conta completa de9 posições. O módulo separa001234567 em conta00123456 e DV7. Essa separação é estrutural e não valida matematicamente o dígito. A identificação calculada é12345001234567, atualizada sem preenchimento manual, usada no Header027–040 e detalhe018–031.

O ERP desta integração precisou de0 no campo do dígito da agência para gerar a remessa; o Safra não o confirmou como DV oficial. O padrão0 é editável e fica restrito ao módulo. O banco já informou5 posições de agência: não concatenar esse campo novamente.

A carteira1 recebida permanece1 no contexto do banco e é apresentada como01 no cadastro deste ERP. A configuração não altera posições nem regras do arquivo CNAB. Mapeamentos de outras carteiras para esse ERP permanecem pendentes até haver documentação, sem conversão inventada. Os padrões e a interpretação são exportados somente por js/banks/safra-config.js. Os demais bancos não recebem essas regras.
