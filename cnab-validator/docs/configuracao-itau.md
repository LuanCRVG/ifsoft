# Itaú CNAB 400 — configuração e validação

Última análise documental: **09/11/2026**. Referência: [manual oficial público do Itaú](https://download.itau.com.br/bankline/layout_cobranca_400bytes_cnab_itau.pdf), edição identificada como Janeiro/2017. A pesquisa não confirmou uma edição oficial pública mais recente.

## Cadastro do banco

Banco 341, carteira 109, layout C400 no Sistema. A mensagem de local de pagamento segue a referência consultada. Não existe valor de aceite imposto a todos os títulos; o arquivo deve informar A ou N conforme cada título.

## Cadastro da conta

Agência com 4 dígitos; dígito da agência vazio; conta com 5 dígitos; DAC agência/conta com 1 dígito separado. A composição do trecho na remessa é agência (4) + 00 (2) + conta (5) + DAC (1), totalizando 12 posições. Header: 027–038; detalhe: 018–029. A aplicação verifica formato e comparação, sem calcular matematicamente o DAC ou consultar a titularidade da conta.

## Regras do validador

- Arquivo: 400 bytes por registro, codificação de um byte por posição, delimitadores, Header, direção, banco, serviço, Trailer e sequência.
- Identificação: conta do Header, dos movimentos e do cadastro, carteira e código de carteira, nosso número e duplicidade de novas entradas.
- Movimentos: requisitos diferenciados para entrada, alteração, baixa e cancelamento; datas e dados de pagador são cobrados conforme o movimento.
- Datas e valores: emissão, vencimento, geração, conferência, envio; valores numéricos e totais calculados com BigInt, incluindo indicação de soma parcial.
- Juros: valor diário, data de mora e instrução 44 quando utilizada. A inexistência de juros não é tratada como erro.
- Instruções: códigos da nota 11, prazo variável nas posições 392–393 e prazos fixos definidos pela instrução. A instrução 16 significa devolução em 55 dias; a instrução 92 usa prazo variável. Multa não é inferida dessas instruções.
- Multa: registro tipo 2 opcional, associação ao título, duplicidade, código 0/1/2, data DDMMAAAA, valor/percentual e limites da nota 35. Títulos sem multa não precisam desse registro.
- Desconto e abatimento: datas, limites, campos adicionais da nota 16 e indicação da dependência contratual para múltiplos descontos.
- Complemento 4: associação ao título, sequência, contas de crédito, tipo e soma do rateio, limites e incompatibilidade com descontos.
- Complemento 5: e-mail, inscrição e dados do sacador/avalista, quando informado.

O Trailer de remessa contém brancos nas posições 002–394 e sequência em 395–400. Não contém total financeiro ou quantidade de títulos em campo próprio. O total apresentado é calculado a partir dos valores informados nos registros tipo 1; não representa saldo da carteira.

## Limites documentados

O módulo trabalha com o layout de cobrança registrada e os tipos 0, 1, 2, 4, 5 e 9. Tipos adicionais não abrangidos geram pendência. Agrupamento personalizado por conta, com múltiplos Headers/Trailers, é detectado como análise específica fora do escopo atual. Rateio líquido depende do recebimento e permanece pendente para confronto no retorno. Boleto de proposta e condições contratuais especiais exigem confirmação específica. Os resultados não substituem homologação bancária.

## Arquitetura e uso

As regras estão em `js/validators/itau400.js`. A configuração e a interface ficam em `js/banks/itau-config.js` e `js/ui/itau-config-ui.js`. O motor seleciona o módulo pelo banco e layout; referências, tamanho da identificação esperada e resultados pertencem ao módulo selecionado.

Selecione Itaú, confira a conta, carregue a remessa e leia as ocorrências por posição. O exemplo sintético e os relatórios PDF/JSON usam o mesmo banco selecionado. Limpar sessão mantém a instituição selecionada e apaga os dados informados.
