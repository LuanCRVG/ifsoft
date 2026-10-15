# Downloads de utilitarios

Esta pasta contem os pacotes publicados no site. Os visitantes podem somente baixa-los; nao existe envio ou edicao pela pagina.

Na interface, os programas ficam na pasta expansivel Utilitarios, antes de Schemas NFS-e. As duas pastas comecam recolhidas e recebem destaque visual e contadores. Esta organizacao e apenas visual: os caminhos fisicos dos ZIPs foram preservados.

## Firebird Care 1.0.4

- Arquivo: `FirebirdCare-1.0.4-win-x64.zip`.
- Tamanho: 99.743.762 bytes (95,1 MiB).
- SHA-256: `744B04469FBFEAAE86F071F1F9D7DCA341644340C1DD273624BCC65D6119DCE7`.
- O ZIP foi copiado sem modificacoes do pacote fornecido por Luan Paranhos. Nao foi executado durante a inclusao no site.
- A plataforma e as orientacoes de extracao foram obtidas do `LEIA-ME.txt` contido no pacote. A inclusao nao certifica o funcionamento ou a seguranca do programa.
- `imagens/utilitarios/firebird-care.png` e o icone incorporado ao executavel, extraido sem executar o aplicativo.

## Nova versao

1. Acrescente o novo ZIP com um nome que inclua a versao, sem sobrescrever o pacote anterior.
2. Atualize o registro correspondente em `utilitarios-data.js`: versao, arquivo, tamanho em bytes, hash SHA-256 e orientacoes.
3. Altere `utilitarios-data.js?v=...` no `index.html` para uma nova versao de cache. Ao trocar o nome do ZIP, atualize tambem o link alternativo dentro de `<noscript>` no mesmo HTML, que atende navegadores sem JavaScript.
4. Publique os arquivos pelo GitHub Desktop ou Git, incluindo o ZIP. O download usa um caminho relativo, compativel com HTML local e GitHub Pages.

Para calcular o tamanho e o hash no PowerShell:

```powershell
(Get-Item -LiteralPath 'downloads/FirebirdCare-1.0.4-win-x64.zip').Length
Get-FileHash -LiteralPath 'downloads/FirebirdCare-1.0.4-win-x64.zip' -Algorithm SHA256
```

O GitHub avisa para arquivos acima de 50 MiB e bloqueia arquivos acima de 100 MiB. O envio pelo navegador e limitado a 25 MiB. Este ZIP cabe no limite do Git, mas novas versoes podem ultrapassa-lo. Para distribuir varias versoes grandes, prefira GitHub Releases e adapte o cadastro para o link do asset, em vez de aumentar continuamente o historico do repositorio. Nao use Git LFS como um link direto de download do GitHub Pages.

Fonte: [Limites de arquivos do GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).
