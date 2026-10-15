# SchemasMDFe

Conjunto fornecido em 15/10/2026: 88 arquivos XSD, copiados sem alteracao dos nomes ou bytes. O pacote contem arquivos de diferentes versoes; nao representa certificacao de vigencia ou compatibilidade com um leiaute especifico.

- Download: `downloads/Schemas/SchemasMDFe/SchemasMDFe.zip`.
- Conteudo do ZIP: os mesmos 88 XSDs, diretamente na raiz, sem este README ou o proprio ZIP.
- Tamanho do ZIP: 97.496 bytes.
- SHA-256: `4166888A64E71A11266EA62D30F9550022FE7F8A71884D8B736E380D12058D9D`.

## Como atualizar

1. Prepare os XSDs do conjunto desejado, preservando suas referencias internas. Confirme o leiaute aplicavel antes de substituir arquivos no sistema.
2. Atualize os XSDs desta pasta e o pacote `SchemasMDFe.zip`. Alterar apenas um arquivo solto nao refaz o ZIP baixado pelos visitantes.
3. Atualize `quantidadeArquivos`, `tamanhoBytes` e `sha256` em `schemas-mdfe-data.js`, na raiz do repositorio.
4. Renove a versao `schemas-mdfe-data.js?v=...` em `index.html` para evitar o cadastro antigo em cache. Publique o cadastro, o HTML e os arquivos atualizados.

Para conferir o tamanho e o hash, execute na raiz do repositorio:

```powershell
(Get-Item -LiteralPath 'downloads/Schemas/SchemasMDFe/SchemasMDFe.zip').Length
Get-FileHash -LiteralPath 'downloads/Schemas/SchemasMDFe/SchemasMDFe.zip' -Algorithm SHA256
```

Nao ha coleta automatica, upload ou edicao por visitantes. Se atualizar pelo GitHub, sincronize a copia local pelo GitHub Desktop antes de continuar editando.
