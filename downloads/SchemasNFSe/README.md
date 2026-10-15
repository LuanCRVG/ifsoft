# SchemasNFSe por municipio

Conjuntos fornecidos em 15/10/2026. Os arquivos sao distribuidos para consulta e download, sem certificacao de vigencia ou compatibilidade com provedores municipais.

| Municipio | UF | Pasta preservada | Arquivos no ZIP | Pacote |
| --- | --- | --- | --- | --- |
| Araruama | RJ | `Araruama_RJ` | 2 | ZIP recebido, sem alteracoes |
| Duque de Caxias | RJ | `Duque de Caxias_RJ` | 2 | ZIP criado com a subpasta `2.04/` |
| Niteroi | RJ | `Niteroi_RJ` | 2 | ZIP criado com os arquivos enviados |
| Rio de Janeiro | RJ | `Rio de Janeiro_RJ` | 3 | ZIP criado com `RJ/` e `Logo_Prefeitura.bmp` |
| Santo Andre | SP | `Santo André_SP` | 24 | ZIP recebido, sem alteracoes |
| Sao Caetano do Sul | SP | `Sao Caetano do Sul_SP` | 23 | ZIP recebido, sem alteracoes |
| Sao Paulo | SP | `SP` | 17 | ZIP criado com os arquivos enviados |
| Saquarema | RJ | `Saquarema_RJ` | 2 | ZIP recebido, sem alteracoes |

A pasta `SP` foi identificada como Sao Paulo pelo namespace `http://www.prefeitura.sp.gov.br/nfe` dos XSDs. O nome fisico da pasta nao foi alterado. As pastas que continham arquivos soltos preservam tambem esses originais. Nenhum XSD, nome de arquivo, referencia interna ou subpasta foi modificado; ZIPs novos foram gerados a partir dos arquivos da origem, sem incluir o proprio ZIP.

O `.gitattributes` desta pasta desativa a conversao de quebras de linha dos XSDs, ZIPs e BMPs pelo Git. A regra e restrita aos conjuntos publicados aqui e preserva seus bytes tambem no versionamento.

## Cadastro e publicacao

- `schemas-nfse-data.js` guarda os nomes apresentados no site, UF, pasta original, quantidade de arquivos no pacote, tamanho do ZIP e SHA-256.
- `schemas-nfse.js` monta a lista, a busca por municipio e o filtro de UF; `utilitarios.css` compartilha o estilo da area de downloads.
- O link e relativo: `downloads/SchemasNFSe/<pasta>/SchemasNFSe.zip`. Espacos e acentos das pastas foram preservados e sao resolvidos pelo navegador. O atributo `download` sugere um nome distinto por municipio, como `SchemasNFSe-santo-andre-sp.zip`.
- Para atualizar um conjunto, confira a pasta correta, preserve a estrutura dos schemas, atualize os metadados do cadastro e altere `schemas-nfse-data.js?v=...` no `index.html` para uma nova versao de cache.
- Publique o cadastro, o layout alterado e a pasta completa `downloads/SchemasNFSe/`. Nao ha upload nem edicao por visitantes.

Para conferir tamanho e hash de um pacote no PowerShell:

```powershell
(Get-Item -LiteralPath 'downloads/SchemasNFSe/SP/SchemasNFSe.zip').Length
Get-FileHash -LiteralPath 'downloads/SchemasNFSe/SP/SchemasNFSe.zip' -Algorithm SHA256
```
