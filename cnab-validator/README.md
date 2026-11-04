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

## Uso

1. Em Configuração Bancária, selecione Safra, informe agência (5), dígito da agência (1), conta (8) e dígito da conta (1), todos como texto, e clique em Conferir composição. O código do cedente é calculado como agência + conta + dígito da conta, sem acrescentar o dígito da agência. A conta só é usada como identificação esperada depois dessa conferência. Dados não são persistidos.
2. Em Validador de Remessa, escolha a data de conferência e, opcionalmente, a data pretendida de envio.
3. O Safra CNAB400 usa um conjunto único de regras. Juros, multa e baixa são identificados e conferidos por título; não há seletor de perfil nem exigência global de multa ou baixa.
4. Selecione ou arraste um .rem, .txt ou .ret de até 5 MiB. A extensão não determina a direção: o Header é inspecionado.
5. Filtre erros/avisos e clique no ícone de código para destacar o intervalo exato no registro original. Os controles do visualizador também permitem escolher qualquer linha e posição.
6. Em Relatórios, baixe PDF ou JSON. O PDF é um download real, paginado, sem biblioteca remota ou diálogo de impressão. O JSON inclui todas as conferências e exclui os registros brutos completos.
7. Limpar sessão descarta arquivo, dados de conta, resultados e conteúdo do visualizador. Downloads que você já salvou permanecem no seu dispositivo.

O exemplo da interface é explicitamente sintético e é processado pelo mesmo motor dos arquivos carregados. Contém três títulos e duas divergências intencionais; as quantidades na tela são resultados reais. Os samples/ têm geração em 15/01/2030: para reproduzir, escolha 2030-01-15 como referência. A demonstração da interface usa a data de referência selecionada.

## Modelo de configuração da nossa integração Safra CNAB400

| Campo | Exemplo | Tamanho |
| --- | --- | --- |
| Agência | 13800 | 5 |
| Dígito da agência | 0 | 1 |
| Conta corrente | 00592448 | 8 |
| Dígito da conta | 6 | 1 |
| Código do cedente, calculado | 13800005924486 | 14 |

O dígito da agência é obrigatório no cadastro do nosso ERP, mas não participa da composição. Este modelo descreve a nossa integração homologada e não impõe a mesma forma de cadastro a outros sistemas ERP.

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

Detectar UTF-8 multibyte é uma heurística conservadora: certas sequências ANSI podem também ser UTF-8 válido. Nesses casos a leitura posicional é bloqueada e a codificação precisa ser conferida no ERP. BOM é rejeitado. Os bytes originais não são regravados.

## Privacidade

Nenhum arquivo ou dado bancário é enviado. Não há fetch, analytics, fontes remotas, cache offline, serviço de armazenamento ou API. A CSP bloqueia conexões de dados (connect-src 'none'). Os arquivos do aplicativo são servidos pelo GitHub Pages; o próprio acesso ao site tem o comportamento normal da hospedagem. Links técnicos externos só são abertos por ação do usuário.

O único item salvo em localStorage é cnab-theme, sem dados bancários. Arquivo e configurações permanecem em memória da aba e do worker durante a análise. Ao limpar, os dados são descartados da sessão; isso não promete sobrescrita física da memória gerenciada pelo navegador. Os relatórios baixados podem conter dados dos campos bancários, por ação explícita do usuário. Não há logs de remessas. Conteúdo carregado é inserido como texto/HTML escapado e jamais executado.

## Testes e manutenção

    npm test
    npm run check

Os testes usam node:test e dados sintéticos. Confira [docs/arquitetura.md](docs/arquitetura.md) para adicionar bancos. Nenhum pacote de terceiros é necessário. O desenvolvimento usa scripts Node apenas para servir, testar e preparar os arquivos públicos. Licença MIT.
