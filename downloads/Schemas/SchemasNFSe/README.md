# SchemasNFSe: municipios e Padrao Nacional

Conjuntos municipais inicialmente fornecidos em 15/10/2026. Em 03/11/2026, foi mantido somente Duque de Caxias; os demais municipios, incluindo Rio de Janeiro, foram removidos do cadastro e dos arquivos publicados, conforme solicitado. O conjunto nacional fica junto de Duque de Caxias na mesma lista, com os arquivos em `downloads/Schemas/SchemasNFSe/PadraoNacional/`.

| Municipio | UF | Pasta preservada | Arquivos no ZIP | Pacote |
| --- | --- | --- | --- | --- |
| Duque de Caxias (Regime Normal) - Emissor ISSNet | RJ | `Duque de Caxias_RJ` | 2 | ZIP recebido, com a subpasta `ISSNet-PadraoNacional/` |
| SchemasNFSe (Padrao Nacional) | Nacional | `PadraoNacional` | 11 | ZIP criado com os XSDs recebidos em 03/11/2026 |

Os nomes fisicos das duas pastas mantidas, os ZIPs, os XSDs e as referencias internas nao foram modificados nesta reorganizacao. A alteracao de Duque de Caxias afeta o nome exibido e os campos de regime/emissor no cadastro; a subpasta original do pacote permanece com o nome recebido.

Tambem em 15/10/2026, o conjunto de Duque de Caxias/RJ foi substituido pelo ZIP ISSNet-PadraoNacional enviado pela equipe. Os dois XSDs ficam em `ISSNet-PadraoNacional/`, preservando nomes, bytes e estrutura. O `SchemasNFSe.zip` e uma copia exata do ZIP recebido, sem recompressao (32.080 bytes). Desde 03/11/2026, o cadastro identifica **Duque de Caxias (Regime Normal) - Emissor ISSNet**, conforme a nova orientacao; o pacote e sua data de atualizacao continuam iguais.

O `.gitattributes` da pasta principal `Schemas/` desativa a conversao de quebras de linha dos XSDs, ZIPs e BMPs pelo Git. A regra e restrita aos conjuntos publicados ali e preserva seus bytes tambem no versionamento.

## Cadastro e publicacao

- `schemas-nfse-data.js` guarda os nomes apresentados no site, UF, pasta original, quantidade de arquivos no pacote, tamanho do ZIP e SHA-256.
- Os campos opcionais `padrao` e `regime` aparecem entre parenteses ao lado do municipio; `emissor`, como `emissor: "ISSNet"`, aparece em seguida. Todos participam da busca. Eles nao alteram a UF, a pasta ou o endereco de download.
- O campo opcional `observacao` aparece por inteiro em destaque abaixo do conjunto, sem precisar expandir texto. Em Duque de Caxias, informa que O.S a partir de **4.2.17.2** ou SAC a partir de **5.3.18.6** devem usar o conjunto **SchemasNFSe (Padrao Nacional)** listado abaixo. A observacao nao altera o pacote nem sua data de atualizacao.
- `schemas-nfse.js` monta a lista, a busca por municipio e o filtro de UF; `utilitarios.css` compartilha o estilo da area de downloads.
- A pasta Schemas NFS-e fica dentro de Schemas, junto de Schemas MDF-e e Schemas NF-e. Ela reune os dois conjuntos na mesma lista, sem pasta expansivel extra para o nacional. Todas comecam recolhidas em `details/summary`; clicar no cabecalho expande ou recolhe. O contador usa conjuntos, pois nem todo pacote representa um municipio.
- O registro nacional usa `nacional: true`, `nome` e `pasta: "PadraoNacional"`, sem municipio nem UF. Ele participa da busca e permanece disponivel nos filtros de UF por ter abrangencia nacional.
- O link e relativo: `downloads/Schemas/SchemasNFSe/<pasta>/SchemasNFSe.zip`. Espacos das pastas foram preservados e sao resolvidos pelo navegador. O atributo `download` sugere um nome distinto por municipio, como `SchemasNFSe-duque-de-caxias-rj.zip`.
- Para atualizar um conjunto, confira a pasta correta, preserve a estrutura dos schemas, atualize os metadados do cadastro e altere `schemas-nfse-data.js?v=...` no `index.html` para uma nova versao de cache.
- Publique o cadastro, o layout alterado e a pasta completa `downloads/Schemas/`. Nao ha upload nem edicao por visitantes.

Para conferir tamanho e hash de um pacote no PowerShell:

```powershell
(Get-Item -LiteralPath 'downloads/Schemas/SchemasNFSe/Duque de Caxias_RJ/SchemasNFSe.zip').Length
Get-FileHash -LiteralPath 'downloads/Schemas/SchemasNFSe/Duque de Caxias_RJ/SchemasNFSe.zip' -Algorithm SHA256
```

## Manutencao pelo site do GitHub

E possivel enviar e excluir arquivos pela interface do GitHub, mas a listagem deste site e um cadastro fixo, nao uma leitura automatica das pastas.

1. Para atualizar os arquivos baixados de um municipio, prepare o novo ZIP completo e envie-o para a pasta correta com o mesmo nome `SchemasNFSe.zip`. Alterar somente um XSD solto nao refaz o ZIP e nao muda o conteudo do botao de download.
2. Atualize `quantidadeArquivos`, `tamanhoBytes` e `sha256` desse municipio em `schemas-nfse-data.js`, que tambem pode ser editado pelo GitHub. A logica da pagina nao precisa mudar. Depois renove a versao `schemas-nfse-data.js?v=...` no `index.html`.
3. Para adicionar um municipio ou renomear sua pasta, ajuste o cadastro para apontar para a pasta existente. Para remover um municipio da lista, remova o objeto correspondente do cadastro; excluir apenas o ZIP deixa o botao publicado apontando para um arquivo ausente.
4. Depois das alteracoes pelo GitHub, use Fetch origin/Pull no GitHub Desktop antes de continuar editando a copia local, para nao trabalhar com uma versao desatualizada.

Sem uma etapa automatica de geracao do cadastro, apenas colocar ou apagar arquivos na pasta nao atualiza os municipios exibidos. Nenhuma automacao foi adicionada nesta alteracao.

Documentacao: [enviar arquivos pelo GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) e [excluir arquivos pelo GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/deleting-files-in-a-repository).
