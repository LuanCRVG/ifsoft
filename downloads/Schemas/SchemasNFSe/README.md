# SchemasNFSe por municipio

Conjuntos inicialmente fornecidos em 15/10/2026, com atualizacoes por municipio descritas abaixo. Os arquivos sao distribuidos para consulta e download, sem certificacao de vigencia ou compatibilidade com provedores municipais.

| Municipio | UF | Pasta preservada | Arquivos no ZIP | Pacote |
| --- | --- | --- | --- | --- |
| Araruama | RJ | `Araruama_RJ` | 2 | ZIP recebido, sem alteracoes |
| Duque de Caxias (Padrao Nacional) | RJ | `Duque de Caxias_RJ` | 2 | ZIP recebido, com a subpasta `ISSNet-PadraoNacional/` |
| Niteroi | RJ | `Niteroi_RJ` | 2 | ZIP criado com os arquivos enviados |
| Rio de Janeiro (Padrao Nacional) | RJ | `Rio de Janeiro_RJ` | 11 | ZIP criado com os novos XSDs enviados |
| Santo Andre | SP | `Santo André_SP` | 24 | ZIP criado a partir do RAR atualizado em 21/10/2026 |
| Sao Caetano do Sul | SP | `Sao Caetano do Sul_SP` | 23 | ZIP recebido, sem alteracoes |
| Sao Paulo | SP | `SP` | 17 | ZIP criado com os arquivos enviados |
| Saquarema | RJ | `Saquarema_RJ` | 2 | ZIP recebido, sem alteracoes |

A pasta `SP` foi identificada como Sao Paulo pelo namespace `http://www.prefeitura.sp.gov.br/nfe` dos XSDs. O nome fisico da pasta nao foi alterado. As pastas que continham arquivos soltos preservam tambem esses originais. Nenhum XSD, nome de arquivo, referencia interna ou subpasta foi modificado; ZIPs novos foram gerados a partir dos arquivos da origem, sem incluir o proprio ZIP.

Em 15/10/2026, o conjunto de Rio de Janeiro/RJ foi substituido pelos 11 XSDs fornecidos como Padrao Nacional. A subpasta antiga `RJ/`, a imagem `Logo_Prefeitura.bmp` e o ZIP anterior foram removidos. Os novos XSDs ficam diretamente na pasta municipal e na raiz do novo `SchemasNFSe.zip` (64.463 bytes; SHA-256 `78BBEE57DE5E5E19AD688DA1C36336A42047566599E5776B1D87CF6A1A94C877`). A identificacao do padrao segue o cadastro solicitado, sem certificar vigencia ou compatibilidade.

Tambem em 15/10/2026, o conjunto de Duque de Caxias/RJ foi substituido pelo ZIP ISSNet-PadraoNacional enviado pela equipe. A antiga subpasta `2.04/` foi removida. Os dois XSDs novos ficam em `ISSNet-PadraoNacional/`, preservando os nomes, bytes e a estrutura do pacote. O `SchemasNFSe.zip` e uma copia exata do ZIP recebido, sem recompressao (32.080 bytes). O cadastro identifica o municipio como Padrao Nacional, conforme solicitado; confirme o leiaute aplicavel antes de usar os arquivos no sistema.

Em 21/10/2026, Santo Andre/SP recebeu o conjunto do arquivo `Schemas.rar` enviado pela equipe. O ZIP anterior foi substituido por um novo `SchemasNFSe.zip`, com os mesmos 24 XSDs do RAR, preservando os nomes, bytes e a subpasta `Schemas_XSD-Servicos_Prestados/` (46.771 bytes; SHA-256 `6E617EF8294AD4592CAD751C60BD626D3A4A3AA180DD63B31B6A966855F5F75B`). Os XSDs extraidos e uma copia intacta do RAR original ficam na pasta municipal. O RAR nao integra o ZIP de download. A identificacao do municipio e dos demais conjuntos nao foi alterada.

O `.gitattributes` da pasta principal `Schemas/` desativa a conversao de quebras de linha dos XSDs, ZIPs e BMPs pelo Git. A regra e restrita aos conjuntos publicados ali e preserva seus bytes tambem no versionamento.

## Cadastro e publicacao

- `schemas-nfse-data.js` guarda os nomes apresentados no site, UF, pasta original, quantidade de arquivos no pacote, tamanho do ZIP e SHA-256.
- O campo opcional `padrao`, como `padrao: "Padrão Nacional"`, aparece entre parenteses ao lado do municipio e participa da busca. Ele nao altera a UF, o nome da pasta ou o endereco de download.
- `schemas-nfse.js` monta a lista, a busca por municipio e o filtro de UF; `utilitarios.css` compartilha o estilo da area de downloads.
- A pasta Schemas NFS-e fica dentro de Schemas, junto de Schemas MDF-e. Todas comecam recolhidas em `details/summary`; clicar no cabecalho expande ou recolhe, sem depender de um script para esse controle. Cada pasta tem seu proprio cabecalho com icone, contador e seta.
- O link e relativo: `downloads/Schemas/SchemasNFSe/<pasta>/SchemasNFSe.zip`. Espacos e acentos das pastas foram preservados e sao resolvidos pelo navegador. O atributo `download` sugere um nome distinto por municipio, como `SchemasNFSe-santo-andre-sp.zip`.
- Para atualizar um conjunto, confira a pasta correta, preserve a estrutura dos schemas, atualize os metadados do cadastro e altere `schemas-nfse-data.js?v=...` no `index.html` para uma nova versao de cache.
- Publique o cadastro, o layout alterado e a pasta completa `downloads/Schemas/`. Nao ha upload nem edicao por visitantes.

Para conferir tamanho e hash de um pacote no PowerShell:

```powershell
(Get-Item -LiteralPath 'downloads/Schemas/SchemasNFSe/SP/SchemasNFSe.zip').Length
Get-FileHash -LiteralPath 'downloads/Schemas/SchemasNFSe/SP/SchemasNFSe.zip' -Algorithm SHA256
```

## Manutencao pelo site do GitHub

E possivel enviar e excluir arquivos pela interface do GitHub, mas a listagem deste site e um cadastro fixo, nao uma leitura automatica das pastas.

1. Para atualizar os arquivos baixados de um municipio, prepare o novo ZIP completo e envie-o para a pasta correta com o mesmo nome `SchemasNFSe.zip`. Alterar somente um XSD solto nao refaz o ZIP e nao muda o conteudo do botao de download.
2. Atualize `quantidadeArquivos`, `tamanhoBytes` e `sha256` desse municipio em `schemas-nfse-data.js`, que tambem pode ser editado pelo GitHub. A logica da pagina nao precisa mudar. Depois renove a versao `schemas-nfse-data.js?v=...` no `index.html`.
3. Para adicionar um municipio ou renomear sua pasta, ajuste o cadastro para apontar para a pasta existente. Para remover um municipio da lista, remova o objeto correspondente do cadastro; excluir apenas o ZIP deixa o botao publicado apontando para um arquivo ausente.
4. Depois das alteracoes pelo GitHub, use Fetch origin/Pull no GitHub Desktop antes de continuar editando a copia local, para nao trabalhar com uma versao desatualizada.

Sem uma etapa automatica de geracao do cadastro, apenas colocar ou apagar arquivos na pasta nao atualiza os municipios exibidos. Nenhuma automacao foi adicionada nesta alteracao.

Documentacao: [enviar arquivos pelo GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) e [excluir arquivos pelo GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/deleting-files-in-a-repository).
