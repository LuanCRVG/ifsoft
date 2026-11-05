# CNAB Validator

Aplicação estática para configuração de contas e conferência de remessas Safra CNAB 400. HTML, CSS e JavaScript ES Modules, sem dependências de produção, backend, APIs ou telemetria. Interface em português, responsiva, com temas claro/escuro.

## Abrir no computador

Extraia o ZIP completo e dê dois cliques em index.html. O menu, a análise e os relatórios funcionam diretamente no navegador, sem instalar Node ou iniciar servidor. Não abra os arquivos de dentro do ZIP.

Os fontes continuam organizados como ES Modules. Os arquivos app.bundle.js e validation-worker.bundle.js são gerados a partir deles e eliminam a restrição de importação do protocolo file://. Nenhuma regra bancária foi duplicada manualmente.

## Desenvolvimento

Node.js20 ou superior é necessário apenas para desenvolvimento e testes:

    npm run build
    npm test
    npm start

A prévia opcional fica em http://127.0.0.1:4173. Depois de modificar qualquer fonte JavaScript, execute npm run build para atualizar os pacotes. Não há dependências npm ou serviços externos.

## Publicar no GitHub Pages

1. Extraia o projeto e envie seu conteúdo para um repositório GitHub. index.html deve estar na raiz, ao lado de .github/.
2. Use a branch main, ou ajuste o gatilho em .github/workflows/pages.yml.
3. Em Settings → Pages → Build and deployment, escolha GitHub Actions.
4. Envie um commit para main ou execute o workflow manualmente na aba Actions.
5. O workflow executa testes, confere a sintaxe, prepara apenas os arquivos públicos em _site e publica. A URL aparece no job de deployment.

Não é necessário instalar pacotes com npm install. Caminhos relativos permitem publicar em https://usuario.github.io/repositorio/ sem alterações. Alternativa: publique uma pasta estática com index.html, favicon.svg, css/, js/, docs/ e .nojekyll. Não há processo de build obrigatório.

## Uso e configuração Safra

1. Selecione Banco Safra em Configuração Bancária.
2. Informe a agência completa com5 posições e a conta completa com9 posições, exatamente como recebidas do banco. Preserve zeros à esquerda.
3. A aplicação separa automaticamente a conta em8 dígitos + DV de1. O dígito da agência inicia em0, editável, conforme a necessidade observada no nosso Sistema com ACBrBoleto; não é um DV oficial confirmado pelo banco.
4. O código do cedente é atualizado automaticamente: agência5 + conta com DV9. O quadro COMO CADASTRAR NO SEU SISTEMA mostra banco, agência, dígitos, conta, cedente, carteira e layout. Há cópia do cadastro e cópia exclusiva do cedente.
5. A carteira recebida1 é apresentada como01 no cadastro deste Sistema. A regra não altera a quantidade de posições ou as regras do arquivo CNAB. Outras carteiras ficam com conversão pendente até existir referência para o Sistema; não se presume um mapeamento.
6. Se os tamanhos estiverem incompletos, a identificação não é exibida como calculada. A separação não valida matematicamente o DV e não comprova conta ou titularidade.
7. No Validador de Remessa, selecione conferência/envio e carregue .rem/.txt/.ret de até5MiB. O conjunto Safra é único e condicional aos campos de cada título. As funções de análise, visualizador e relatórios permanecem independentes da configuração.
8. Limpar sessão descarta dados e resultados, restaurando somente os padrões do módulo Safra (DV da agência0 e carteira1). Nada bancário é persistido automaticamente.

## Exemplo exclusivamente fictício de e-mail

| Informação recebida | Valor fictício |
| --- | --- |
| Shortname | NOME DA EMPRESA |
| Agência | 12345 - Barra |
| Conta | 001234567 |
| Tipo de impressão | EMISSÃO EMPRESA |
| Praça de atendimento | 100% SAFRA |
| Padrão do arquivo | 400 |
| Produto | COBRANÇA |
| Carteira | 1 |

No Sistema: banco422 - Banco Safra; agência12345; dígito da agência0; conta00123456; dígito da conta7; cedente12345001234567; carteira01; layoutCNAB400. Na remessa, 12345+001234567=12345001234567. O dígito da agência não é concatenado. A identificação ocupa Header027–040 e detalhe tipo1 018–031.

O botão Usar exemplo fictício preenche somente esses dados de demonstração. A demonstração de remessa usa o mesmo identificador fictício e contém divergências intencionais, analisadas pelo motor real. Datas fixas dos arquivos samples/: geração15/01/2030; use2030-01-15 para reproduzir a conferência. A demonstração da interface usa a referência selecionada.

## Regras e referências

Leia [docs/regras-safra.md](docs/regras-safra.md). A confirmação direta da equipe de homologação, relatada pelo solicitante, estabelece a combinação 05 na Instrução 1, 16 na Instrução 2 e valor monetário dos juros diários, sem exigir instrução 01 nesse cenário. O módulo utiliza essas orientações conforme os campos de cada título. Regras de outros bancos continuam isoladas.

Foram cotejados o manual público Safra de maio/2026, o guia de implantação 001281%29.pdf e o ACBrBancoSafra.pas fornecidos. Os arquivos de referência originais não foram republicados neste projeto. Divergências entre fontes estão documentadas. O código do ACBr é referência de integração; não tem precedência sobre orientações oficiais do banco.

## O que é conferido

- Header/Trailer, tipos reconhecidos, sequência e quantidade de registros.
- 400 bytes por registro; CRLF/LF e codificação de um byte Windows-1252/ASCII, sem trim ou remoção de zeros.
- Banco 422 e direção remessa antes de executar regras específicas.
- Empresa Header 27–40 × detalhe 18–31 × configuração informada.
- Vencimento, comparação com conferência e envio; geração exibida separadamente.
- Valor nominal e juros diários em centavos; soma exata com BigInt.
- Regras Safra unificadas: baixa, instruções05/16 e campos de multa, quando configurados no título.
- Trailer: quantidade 369–376 e total 377–391 da remessa convencional.

## Limites explícitos

A análise é parcial e não é um certificado de conformidade integral. Não valida todos os campos, titularidade, CPF/CNPJ, autenticidade, condições contratuais, prazos de postagem ou aceite do banco. Vencimento futuro não garante aceite.

Bancos 341/033/237/104/756/748 e CNAB 240 não possuem módulo habilitado. Retornos são reconhecidos pelo Header e interrompem a validação específica. Tipos 2/4/6/7/8 são reconhecidos, com tamanho/sequência conferidos e conteúdo próprio pendente. Tipo 8 suspende a reconciliação integral de totais. Valores inválidos tornam a soma parcial e impedem falsa comparação com o Trailer.

AA é interpretado como 2000–2099, independentemente do relógio do navegador. Datas de juros em 86–91 são uma conferência indicativa por haver diferença entre referências. Campos de multa em206–218 também podem ser abatimento; sem instrução16, uma aparência de data e percentual gera aviso para evitar inferir uma cobrança indevida. Valores bancários nunca são completados ou convertidos automaticamente. O aplicativo não altera o arquivo.

Detectar UTF-8 multibyte é uma heurística conservadora: certas sequências ANSI podem também ser UTF-8 válido. Nesses casos a leitura posicional é bloqueada e a codificação precisa ser conferida no Sistema. BOM é rejeitado. Os bytes originais não são regravados.

## Privacidade

Nenhum arquivo ou dado bancário é enviado. Não há fetch, analytics, fontes remotas, cache offline, serviço de armazenamento ou API. A CSP bloqueia conexões de dados (connect-src 'none'). Os arquivos do aplicativo são servidos pelo GitHub Pages; o próprio acesso ao site tem o comportamento normal da hospedagem. Links técnicos externos só são abertos por ação do usuário.

O único item salvo em localStorage é cnab-theme, sem dados bancários. Arquivo e configurações permanecem em memória da aba e do worker durante a análise. Ao limpar, os dados são descartados da sessão; isso não promete sobrescrita física da memória gerenciada pelo navegador. Os relatórios baixados podem conter dados dos campos bancários, por ação explícita do usuário. Não há logs de remessas. Conteúdo carregado é inserido como texto/HTML escapado e jamais executado.

## Testes e manutenção

    npm test
    npm run check

Os testes usam node:test e dados sintéticos. Confira [docs/arquitetura.md](docs/arquitetura.md) para adicionar bancos. Nenhum pacote de terceiros é necessário. O desenvolvimento usa scripts Node apenas para servir, testar e preparar os arquivos públicos. Licença MIT.


O módulo Safra apresenta dois cadastros separados: **Cadastro do banco no Sistema** (422, BANCO SAFRA, Layout da Remessa C400, carteira 01, aceite Não e mensagem PAGÁVEL EM QUALQUER BANCO DO SISTEMA DE COMPENSAÇÃO) e **Cadastro da conta corrente** (agência, DV da agência, conta, DV da conta e cedente). Cada cadastro pode ser copiado separadamente. A identificação CNAB permanece agência (5) + conta (8) + DV da conta (1). Essas orientações são específicas desta integração, sem alterar as regras de validação.

Última análise dos parâmetros de cadastro Safra: **04/11/2026**. Essa data é histórica e fixa: não é recalculada ao abrir a página nem confundida com a data de conferência de uma remessa. Ela também acompanha as cópias de ambos os cadastros.


## Logos para o Sistema

O Dashboard oferece o download de `downloads/Logos.rar`. Extraia o arquivo e deixe a pasta **Logos** na pasta onde o **Sistema está instalado**. O arquivo mantém as subpastas Colorido e PretoBranco. O cadastro do Banco Safra exibe que a instalação da logo é obrigatória nesta integração. Essa orientação não altera a validação de arquivos CNAB.
