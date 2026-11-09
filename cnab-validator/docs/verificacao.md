# Verificação da entrega

Conferência realizada em04/11/2026, com dados exclusivamente fictícios.

- 43 testes automatizados aprovados com node:test, incluindo interpretação da conta completa, preservação dos zeros, bloqueio de composição incompleta, padrões exclusivos do Safra, carteira1 no banco/01 no Sistema e regressões do validador.
- No navegador, informar agência12345 e conta001234567 gerou automaticamente conta Sistema00123456, DV7 e cedente12345001234567, sem clicar em conferir.
- O DV da agência inicia em0 e é editável; não integra a identificação. A observação explica sua necessidade no Sistema, sem certificá-lo como DV oficial.
- Conta incompleta removeu a identificação calculada e bloqueou o botão de copiar o cedente.
- O botão de exemplo preencheu somente os dados fictícios fornecidos. A cópia do cadastro incluiu banco422, agência12345, DV da agência0, conta00123456, DV7, cedente12345001234567, carteira01 e layoutCNAB400.
- A cópia exclusiva do código retornou12345001234567.
- As regras e os algoritmos de remessa foram preservados. Nesta atualização, mensagens que citavam a nomenclatura anterior passaram a usar Sistema; os identificadores e as condições das regras permaneceram iguais.
- Abertura por arquivo local continua usando os pacotes JavaScript já incluídos. A execução do worker sem importações externas é testada automaticamente. A ferramenta de navegador não permite inspeção automatizada de navegação file://.

Essas verificações não constituem homologação do aplicativo pelo banco nem confirmam titularidade ou validade matemática de DV. O escopo técnico continua em regras-safra.md.

Navegação: o clique em CNAB Validator abriu a ferramenta como página completa na mesma aba; nenhum iframe foi encontrado. O retorno Central Técnica abriu as notas com4 registros, e o endereço antigo com#cnab-validator redirecionou corretamente. A leitura do texto visível da configuração não encontrou a nomenclatura anterior.


O módulo Safra apresenta dois cadastros separados: **Cadastro do banco no Sistema** (422, BANCO SAFRA, Layout da Remessa C400, carteira 01, aceite Não e mensagem PAGÁVEL EM QUALQUER BANCO DO SISTEMA DE COMPENSAÇÃO) e **Cadastro da conta corrente** (agência, DV da agência, conta, DV da conta e cedente). Cada cadastro pode ser copiado separadamente. A identificação CNAB permanece agência (5) + conta (8) + DV da conta (1). Essas orientações são específicas desta integração, sem alterar as regras de validação.

Última análise dos parâmetros de cadastro Safra: **04/11/2026**. Essa data é histórica e fixa: não é recalculada ao abrir a página nem confundida com a data de conferência de uma remessa. Ela também acompanha as cópias de ambos os cadastros.


## Itaú — 09/11/2026

53 testes automatizados passaram: incluem agência de 4 posições, DV de agência vazio, zeros preservados, conta e DAC separados, rejeição de campos incompletos, cópias com data e rejeição de análise Itaú sem validador próprio. O worker Safra empacotado continua executando as regras anteriores.

No navegador: Itaú selecionável em Configuração Bancária e em Bancos Disponíveis; exemplo fictício e cópias separados; conta incompleta limpa o trecho e bloqueia cópia; Limpar sessão apaga os campos Itaú; alternar para Safra restaura o DV padrão 0 e mantém a data 04/11/2026. A validação Itaú exibe indisponibilidade sem carregar remessa. Nenhum erro de console foi observado.
