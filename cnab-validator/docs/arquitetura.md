# Arquitetura

- index.html e css/styles.css: cinco telas, acessibilidade por teclado, responsividade e tema.
- js/app.js: estado temporário, navegação por hash, leitura local, filtros e visualizador. Só o tema vai para localStorage.
- js/cnab-parser.js: Uint8Array, delimitadores e fatias posicionais; funções monetárias e datas puras.
- js/bank-registry.js: registro de bancos e importações dinâmicas independentes.
- js/banks/safra-config.js: interpretação dos dados de e-mail Safra, separação textual da conta9 em8+1, identificação5+9, padrões do Sistema e mapeamento da carteira1 para01, sem conversões numéricas.
- js/validation-worker.js: executa o motor em Web Worker para manter a interface disponível. Limpar sessão termina o worker ativo.
- js/validation-engine.js: carrega somente o módulo do banco/layout selecionado e consolida a saída padronizada.
- js/validators/safra400.js: regras do Safra, fontes e escopo. Não é compartilhado com outros bancos.
- js/report-generator.js: JSON sem registros brutos e PDF1.4 com fontes padrão WinAnsi, quebra de linha e paginação; nenhum serviço remoto.
- js/demo.js: gerador exclusivamente sintético, também usado nos testes. Não produz remessas aptas para uso bancário.
- tests/: node:test, sem dependências.
- scripts/: servidor HTTP local, verificação e preparação da pasta pública para Pages.

## Interface de um banco

Registre code, name, implemented, layouts, load e loadConfiguration. Cada loader retorna um ES Module próprio. O módulo de validação exporta validate(context). O contexto fornece parsed.records (line/text/length), opções, bank e add(check). A saída contém supported, titleCount, totalCents (string de centavos), totalComplete, generationDate, recordCount e recordTypes.

Cada check deve ter level (error/warning/info), code estável, field, description, reference e, quando se refere a bytes, line, recordType, start, end, found e expected. Posições são inclusivas e começam em1. Comparações financeiras usam BigInt; a fronteira de serialização converte centavos para string.

1. Crie banks/novo-config.js e validators/novo-layout.js com regras e fontes próprias.
2. Adicione testes sintéticos, inclusive um teste que prove que arquivos de outro banco não recebem essas regras.
3. Registre os loaders e marque apenas layouts já cobertos como disponíveis.
4. Atualize a documentação e a lista de suporte na interface. Nunca delegue banco desconhecido ao módulo Safra por padrão.

## Segurança

Sem eval, scripts carregados de arquivos, innerHTML não escapado para conteúdo de remessas ou envio de arquivo. As visualizações usam textContent ou escape explícito. O HTML contém CSP que restringe scripts a self e bloqueia conexões de dados. O worker recebe bytes por clonagem estruturada, sem persistência. Os downloads são Blobs locais e suas URLs são revogadas.

## Verificação

npm test executa cenários sintéticos. npm run check confere sintaxe e referências relativas. O workflow de Pages executa ambos antes de publicar só os ativos públicos. O servidor de desenvolvimento fica limitado a127.0.0.1 e não deve ser exposto como servidor de produção.

## Abertura por arquivo local

O HTML carrega js/app.bundle.js como script clássico. scripts/build.mjs empacota os módulos em fábricas isoladas, com cache de importação, sem dependências externas. O worker é gerado a partir dos mesmos módulos e instanciado por um Blob local, autorizado por worker-src self/blob na CSP. As URLs de Blob são revogadas no resultado, erro ou término do worker. Os fontes ES Modules continuam sendo a referência para manutenção e testes. O empacotador aceita apenas as formas de import/export usadas pelo projeto e recusa módulos fora da lista explícita.

## Navegação da Central Técnica

O menu do site usa um link normal para cnab-validator/index.html, na mesma aba, sem iframe. Na versão integrada, o body contém data-portal-url=../index.html#notas-tecnicas; o aplicativo mostra o link Central Técnica para retorno. O pacote independente omite esse atributo e não exibe um retorno para um site ausente. A URL antiga index.html#cnab-validator redireciona para a página completa.


O módulo Safra apresenta dois cadastros separados: **Cadastro do banco no Sistema** (422, BANCO SAFRA, Layout da Remessa C400, carteira 01, aceite Não e mensagem PAGÁVEL EM QUALQUER BANCO DO SISTEMA DE COMPENSAÇÃO) e **Cadastro da conta corrente** (agência, DV da agência, conta, DV da conta e cedente). Cada cadastro pode ser copiado separadamente. A identificação CNAB permanece agência (5) + conta (8) + DV da conta (1). Essas orientações são específicas desta integração, sem alterar as regras de validação.


O registro de bancos mantém carregadores independentes de configuração e validação. O motor utiliza a identificação e as referências do módulo selecionado.
