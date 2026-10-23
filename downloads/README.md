# Downloads de utilitarios

Esta pasta contem os pacotes publicados no site. Os visitantes podem somente baixa-los; nao existe envio ou edicao pela pagina.

Na interface, os programas ficam na pasta expansivel Utilitarios, antes de Schemas. Dentro de Schemas ficam Schemas NFS-e, Schemas MDF-e e Schemas NF-e. Todas comecam recolhidas e recebem icones, contadores e setas. Os arquivos ficam em `downloads/Schemas/SchemasNFSe/` (por municipio), `downloads/Schemas/SchemasMDFe/` e `downloads/Schemas/SchemasNFe/` (Normal e Padrao Nacional separados). Consulte [Schemas/README.md](Schemas/README.md) para manter os pacotes. O endereco do Firebird Care nao mudou.

## Firebird Care 1.0.4

- Arquivo: `FirebirdCare-1.0.4-win-x64.zip`.
- Tamanho: 99.743.762 bytes (95,1 MiB).
- SHA-256: `744B04469FBFEAAE86F071F1F9D7DCA341644340C1DD273624BCC65D6119DCE7`.
- O ZIP foi copiado sem modificacoes do pacote fornecido por Luan Paranhos. Nao foi executado durante a inclusao no site.
- A plataforma e as orientacoes de extracao foram obtidas do `LEIA-ME.txt` contido no pacote. A inclusao nao certifica o funcionamento ou a seguranca do programa.
- `imagens/utilitarios/firebird-care.png` e o icone incorporado ao executavel, extraido sem executar o aplicativo.

## IF Fix 0.8

- Arquivo: `IF-Fix-0.8-win.rar`, exibido depois do Firebird Care no site.
- Tamanho: 96.231.208 bytes (91,8 MiB).
- SHA-256 do RAR: `83DF2D1EBA29F986A807090EFF62A132E6C7E89A21D813C8761B4B512A54FFA8`.
- Conteudo: `IF-Fix.exe`, `LEIA-ME.txt`, `SHA256SUMS.txt` e `VALIDACAO.txt`, fornecidos na entrega 0.8.
- O executavel original tem 121.635.328 bytes e SHA-256 `77F78812558E3CF1F01DC80B2E314E1B7FD64836702D3994902C92586AE7F9D4`. O EXE e o ZIP da entrega original ultrapassam 100 MiB; por isso, foi criado um RAR menor, sem alterar os arquivos internos. Nao envie o EXE ou o ZIP original para este repositorio. O RAR precisa ser incluido no commit pelo GitHub Desktop/Git, nao pelo envio de arquivos no navegador.
- Windows 10/11 x86/x64 e .NET Framework 4.8 ou superior, conforme as orientacoes do pacote. O programa pode oferecer a instalacao do .NET quando ausente, com autorizacao e internet. Os instaladores Visual C++ e as DLLs fornecidas ja estao incorporados.
- As correcoes exigem privilegios administrativos e podem encerrar aplicativos, substituir DLLs e alterar configuracoes de rede. Leia os avisos do pacote, preserve backups e homologue as operacoes em computador de teste. A fbclient precisa corresponder a arquitetura do aplicativo, nao apenas a do Windows.
- O executavel nao possui assinatura Authenticode empresarial. A inclusao no site nao certifica seguranca ou funcionamento. O programa nao foi executado durante a inclusao; os arquivos do RAR foram comparados com a entrega original.
- Na correcao de rede, Sim cria e confirma um ponto de restauracao do Windows (recomendado); Nao pula a criacao e continua. O backup das configuracoes permanece obrigatorio nos dois caminhos. O ajuste de economia de energia trata os adaptadores fisicos conectados quando o driver permitir.
- O pacote anterior 0.6 permanece disponivel pelo endereco antigo, mas o cartao e o link sem JavaScript agora apontam para 0.8.
- `imagens/utilitarios/if-fix.png` foi convertido do icone original `IF-Fix.ico` do projeto, sem executar o aplicativo.

## Como atualizar um utilitario

1. Acrescente o novo pacote ZIP ou RAR com um nome que inclua a versao, sem sobrescrever o pacote anterior. Confirme que o arquivo cabe no limite do repositorio; nao divida um executavel para torna-lo publicavel sem ajustar o fluxo de download.
2. Atualize o registro correspondente em `utilitarios-data.js`: versao, arquivo, tamanho em bytes, hash SHA-256 e orientacoes.
3. Altere `utilitarios-data.js?v=...` no `index.html` para uma nova versao de cache. Ao trocar o nome do pacote, atualize tambem o link alternativo correspondente dentro de `<noscript>` no mesmo HTML, que atende navegadores sem JavaScript.
4. Publique os arquivos pelo GitHub Desktop ou Git, incluindo o pacote. O download usa um caminho relativo, compativel com HTML local e GitHub Pages. A ordem dos objetos em `utilitarios-data.js` determina a ordem dos cartoes.

Para calcular o tamanho e o hash no PowerShell:

```powershell
(Get-Item -LiteralPath 'downloads/FirebirdCare-1.0.4-win-x64.zip').Length
Get-FileHash -LiteralPath 'downloads/FirebirdCare-1.0.4-win-x64.zip' -Algorithm SHA256
```

O GitHub avisa para arquivos acima de 50 MiB e bloqueia arquivos acima de 100 MiB. O envio pelo navegador e limitado a 25 MiB. Este ZIP cabe no limite do Git, mas novas versoes podem ultrapassa-lo. Para distribuir varias versoes grandes, prefira GitHub Releases e adapte o cadastro para o link do asset, em vez de aumentar continuamente o historico do repositorio. Nao use Git LFS como um link direto de download do GitHub Pages.

Fonte: [Limites de arquivos do GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).
