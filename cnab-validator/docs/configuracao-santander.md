# Santander · cadastro no Sistema

Última análise: **11/11/2026**. Referência: manual fornecido pelo banco **H7800, V2.38, Outubro/2026**, 62 páginas, e imagem de parametrização enviada pelo usuário. A data identifica a conferência; não é uma homologação bancária.

## Cadastro do banco

| Campo | Configuração desta integração |
|---|---|
| Código | 033 · BANCO SANTANDER |
| Carteira no Sistema | 101 |
| Layout Remessa | C400 |
| Mensagem para local de pagamento | PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO |

Carteira e modalidade no Sistema: **101**, conforme o cadastro informado para esta integração. O cadastro exibe os campos utilizados no Sistema. As regras técnicas da remessa permanecem documentadas no módulo de validação.

## Cadastro da conta corrente

Agência com 4 dígitos e dígito da agência **0**, preenchido por padrão em campo separado; conta com 8 dígitos e DV separado; código cedente de 7 dígitos; Convênio do banco vazio; modalidade **101**; código de transmissão C400 de 20 dígitos.

O banco enviou a agência com 4 dígitos. O preenchimento do dígito com **0** é necessário no cadastro desta integração no Sistema; não é uma confirmação de DV oficial informado pelo banco. O zero não é concatenado novamente à transmissão.

**Não existe campo Complemento 400 no Sistema.** O formulário não solicita esse campo. Ele aparece apenas como dado técnico calculado para a remessa.

O código de transmissão é fornecido pelo banco (nota 1), não é calculado por uma fórmula universal nem acrescido novamente de DV da agência ou complemento. O código C240 é outro campo de parametrização e não deve ser usado na remessa C400.

No cenário de conta cobrança com complemento, a conta do cadastro (8 + DV) é normalizada para 10 posições com zero à esquerda. As 8 primeiras posições vão ao detalhe 030–037; as 2 últimas ao complemento 384–385, com identificador I em 383. O complemento é calculado automaticamente das duas últimas posições dessa conta normalizada, sem exigir preenchimento adicional no Sistema. O código de transmissão é comparado integralmente ao Header 027–046.

A nota 2 também documenta contas legadas de 8 posições, com identificador e complemento em branco. O validador reconhece esse formato, embora o formulário desta integração siga o cadastro informado pelo usuário.

Dados reais da imagem não são distribuídos. Exemplos são fictícios, ficam somente na sessão e não confirmam existência de conta ou validade matemática de DV bancário.
