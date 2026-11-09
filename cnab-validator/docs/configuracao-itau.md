# Configuração Itaú CNAB 400

Última análise documental: **09/11/2026**. Esta data é fixa e não confirma homologação ou edição nova do manual.

## Referência consultada

[Manual oficial público Itaú — Cobrança CNAB 400](https://download.itau.com.br/bankline/layout_cobranca_400bytes_cnab_itau.pdf). Edição identificada no documento: **Janeiro/2017**. Não foi possível confirmar uma edição oficial pública mais recente. A página do módulo registra expressamente essa limitação.

## Cadastro do banco

- Código 341; BANCO ITAÚ.
- Carteira 109; layout C400 no Sistema, correspondente a registros CNAB de 400 bytes.
- A carteira consta da nota 5 como cobrança direta; a contratação de cada conta deve ser confirmada com o banco.
- A mensagem de local de pagamento segue a nota 25 e o modelo do boleto para cobrança registrada (páginas 35 e 53). Ela permite outros bancos; após o vencimento, orienta atualizar o boleto no site Itaú. Substitui a frase inicialmente informada, conforme escolha do usuário.
- Não foi definido aceite fixo para todos os títulos: esse parâmetro não foi solicitado para o cadastro Itaú.

## Cadastro da conta corrente

| Campo | Cadastro / referência |
| --- | --- |
| Agência | 4 dígitos; Header 027–030; detalhe 018–021 |
| Dígito da agência | Vazio no Sistema; o layout não contém campo separado para DV da agência do beneficiário |
| Conta | 5 dígitos; Header 033–037; detalhe 024–028 |
| DAC agência/conta | 1 dígito separado; Header 038; detalhe 029 |
| Zeros de complemento | 2 posições; Header 031–032; detalhe 022–023 |

O trecho de 12 posições exibido é agência (4) + zeros (2) + conta (5) + DAC (1). Não é o cedente de 14 posições do Safra. A aplicação confere somente formato: não calcula o DAC, não consulta titularidade ou contratação e não certifica a conta. O exemplo é fictício e não representa validação matemática do DAC.

## Arquitetura e escopo

`js/banks/itau-config.js` contém os parâmetros e a composição Itaú. `js/ui/itau-config-ui.js` controla seus campos e cópias. O registro de bancos distingue configuração disponível (`configurable`) de validação de remessas implementada (`implemented`).

O Itaú possui configuração disponível e validação de remessas ainda indisponível. O motor rejeita uma solicitação de análise Itaú; nunca aplica regras Safra por substituição. O módulo Safra mantém seus padrões, mensagens, data e regras anteriores. Limpar sessão também apaga os dados dos campos Itaú.
