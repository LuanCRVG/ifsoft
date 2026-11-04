# Verificação da entrega

Conferência realizada em04/11/2026.

- 39 testes automatizados com node:test, todos aprovados.
- Modelo fixo conferido no navegador: 13800 /0 /00592448 /6 resulta em13800005924486. O dígito da agência fica fora da composição.
- Seletor de perfil removido; conjunto Safra único, com regras condicionais por título.
- Testes de títulos sem juros/multa/baixa e títulos mistos; multa com percentual diferente de2%; baixa com prazo diferente de30 dias; combinação05/16 sem exigir01.
- Exemplo sintético processado no navegador: 3 títulos, R$600,00, duas divergências intencionais. As comparações com conta cadastrada podem acrescentar divergências se o cadastro não corresponder ao exemplo.
- Clique na ocorrência de Instrução1 destacou as posições157–158 no registro original.
- Arquivo local selecionado pelo leitor de arquivos; PDF e JSON baixados e reabertos para conferir conteúdo.
- Interface verificada em desktop e viewport390×844; temas claro/escuro, navegação, limpeza da sessão e bloqueio de banco não implementado.
- Nenhum erro ou aviso de execução no console na conferência final da interface.

Estas verificações usam dados de teste e não constituem homologação do aplicativo pelo banco. Os limites e referências das regras permanecem em regras-safra.md.

A geração e a execução do worker empacotado também são verificadas automaticamente, sem importações externas. O empacotamento permite que o arquivo local carregue scripts clássicos; a inspeção automatizada de navegação file:// não está disponível nesta ferramenta de navegador.
