# Schemas

Esta pasta reune os conjuntos publicados na area de downloads:

```text
Schemas/
  SchemasNFSe/
    <municipio>/SchemasNFSe.zip
  SchemasMDFe/
    <arquivos .xsd>
    SchemasMDFe.zip
  SchemasNFe/
    Normal/SchemasNFe.zip
    PadraoNacional/SchemasNFe.zip
    Originais/SchemasNFe-PadraoNacional.rar
```

No site, Schemas fica depois de Utilitarios. A pasta principal e as tres subpastas comecam recolhidas e abrem de forma independente, com controles nativos `details/summary`. Schemas NF-e oferece dois downloads separados: Normal (sem Reforma Tributaria) e Padrao Nacional, identificados conforme o envio da equipe.

Os nomes das pastas municipais e os bytes dos conjuntos NFS-e foram preservados durante a reorganizacao. O Firebird Care continua no mesmo endereco, fora desta pasta.

Consulte [SchemasNFSe/README.md](SchemasNFSe/README.md), [SchemasMDFe/README.md](SchemasMDFe/README.md) e [SchemasNFe/README.md](SchemasNFe/README.md) antes de atualizar os pacotes. A listagem e um cadastro fixo: adicionar arquivos nao atualiza automaticamente os botoes do site. Todos os arquivos publicados sao publicos e nao podem ser editados pelos visitantes.

O `.gitattributes` desta pasta impede conversao de quebras de linha nos XSDs, ZIPs, RARs e BMPs das tres categorias.

## Data da ultima atualizacao

Cada um dos 11 pacotes de schemas mostra a data cadastrada e o intervalo em dias abaixo de seu download. A data de Santo Andre e `2026-10-21`; os demais conjuntos NFS-e, MDF-e e os dois conjuntos NF-e usam `2026-10-15`, conforme definido pela equipe. Estas datas indicam a atualizacao do pacote no site, nao a vigencia de uma norma ou a versao oficial de um leiaute. Os arquivos de download nao foram modificados nesta inclusao.

Ao substituir um pacote, atualize tambem o campo `dataAtualizacao`, sempre no formato `AAAA-MM-DD`, no cadastro correspondente:

- NFS-e: objeto do municipio em `schemas-nfse-data.js`.
- MDF-e: objeto em `schemas-mdfe-data.js`.
- NF-e: objeto Normal ou Padrao Nacional em `schemas-nfe-data.js`.

Exemplo: `dataAtualizacao: "2026-10-21"`. Depois renove a versao de cache do cadastro em `index.html` e publique os arquivos alterados. A data nao e descoberta automaticamente quando um arquivo e enviado ao GitHub.

`schema-dates.js` compartilha a apresentacao e a contagem entre os tres tipos de schemas. O intervalo considera dias de calendario em `America/Sao_Paulo`, evitando diferencas por fuso do visitante ou horario de verao. O texto mostra hoje, ha 1 dia ou ha varios dias; datas futuras usam em 1 dia/em varios dias, sem contagens negativas. Datas ausentes ou invalidas aparecem como nao informadas, sem bloquear o download. A contagem e atualizada ao abrir a pagina, a cada minuto e ao retornar a aba, sem modificar a data cadastrada ou depender de API.

Para publicar esta funcionalidade, inclua `schema-dates.js`, os tres cadastros, os tres scripts de listagem, `utilitarios.css` e `index.html`. As pastas continuam recolhidas inicialmente e a consulta permanece publica e somente leitura.
