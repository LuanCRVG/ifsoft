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

O `.gitattributes` da pasta principal `Schemas/` desativa a conversao de quebras de linha dos XSDs, ZIPs e BMPs pelo Git. A regra e restrita aos conjuntos publicados ali e preserva seus bytes tambem no versionamento.

## Cadastro e publicacao

- `schemas-nfse-data.js` guarda os nomes apresentados no site, UF, pasta original, quantidade de arquivos no pacote, tamanho do ZIP e SHA-256.
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
