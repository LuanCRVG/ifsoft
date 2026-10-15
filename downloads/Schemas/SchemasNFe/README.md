# SchemasNFe

Conjuntos recebidos em 15/10/2026, mantidos separados, sem misturar arquivos de mesmo nome. As identificacoes abaixo seguem o envio da equipe; a publicacao nao certifica vigencia, compatibilidade ou atendimento a uma nota tecnica especifica.

| Conjunto no site | Subpasta | XSDs no ZIP | Tamanho do ZIP |
| --- | --- | --- | --- |
| Normal (sem Reforma Tributaria) | `Normal/` | 158 | 208.897 bytes |
| Padrao Nacional | `PadraoNacional/` | 200 | 256.069 bytes |

Cada subpasta contem os XSDs originais e seu proprio `SchemasNFe.zip`. Cada ZIP contem somente os XSDs daquele conjunto, diretamente na raiz, com nomes e bytes preservados. O atributo de download sugere nomes diferentes: `SchemasNFe-normal.zip` e `SchemasNFe-padrao-nacional.zip`.

O segundo envio continha duas copias dos mesmos 200 XSDs. Elas foram comparadas arquivo por arquivo e eram identicas; apenas uma copia foi publicada. O arquivo RAR recebido foi preservado, sem recompressao ou execucao, em `Originais/SchemasNFe-PadraoNacional.rar`, separado dos ZIPs de download. As pastas de origem nao foram modificadas.

## SHA-256 dos ZIPs

- Normal: `68F79C22C274B855A7AEFC32ACAD8D4B72A4575D9249EA829D80446D25C94C99`.
- Padrao Nacional: `478FC112B56D3F402A50C1F10641DA2D00D5240AE5B3B360BF07BCA85AF2872F`.

## Como atualizar

1. Escolha o conjunto correto: `Normal/` ou `PadraoNacional/`. Nao substitua um pelo outro nem misture XSDs de pacotes distintos.
2. Atualize os XSDs e o `SchemasNFe.zip` da mesma subpasta. O ZIP deve conter somente os arquivos do conjunto, sem incluir o proprio ZIP, os originais RAR ou este README. Alterar um XSD solto nao refaz o ZIP automaticamente.
3. Na raiz do repositorio, atualize o objeto correspondente em `schemas-nfe-data.js`: nome, pasta, quantidade de arquivos no ZIP, tamanho em bytes e SHA-256.
4. Renove `schemas-nfe-data.js?v=...` em `index.html` para evitar o cadastro antigo em cache. Publique os novos arquivos, o cadastro e o HTML atualizados. Depois de editar pelo GitHub, sincronize sua copia local no GitHub Desktop.

Para conferir um pacote no PowerShell, a partir da raiz do repositorio:

```powershell
(Get-Item -LiteralPath 'downloads/Schemas/SchemasNFe/Normal/SchemasNFe.zip').Length
Get-FileHash -LiteralPath 'downloads/Schemas/SchemasNFe/Normal/SchemasNFe.zip' -Algorithm SHA256
```

Para o outro conjunto, troque `Normal` por `PadraoNacional`. A listagem do site e um cadastro fixo, nao uma leitura automatica das pastas. Nao ha envio ou edicao por visitantes.
