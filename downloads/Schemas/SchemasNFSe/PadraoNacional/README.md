# SchemasNFSe (Padrao Nacional)

Conjunto recebido em `SchemasNFSe.rar` e adicionado em **03/11/2026**, identificado conforme o envio da equipe.

Os 11 XSDs foram extraidos sem alterar nomes ou bytes. A pasta externa `SchemasNFSe/` do RAR foi retirada, mantendo todos os XSDs juntos e preservando as 18 referencias locais entre os arquivos. O ZIP de download contem somente esses 11 XSDs na raiz; nao inclui este README.

- Download: `SchemasNFSe.zip` (63.414 bytes).
- SHA-256: `0FA8FDA29D1AE6FA51F3106DAA9F867B5DAB1C202B58A1C7944F22CC70003E74`.
- Data no site: `2026-11-03`.
- Cadastro: registro `id: "nfse-nacional"`, com `nacional: true`, na lista `LP_SCHEMAS_NFSE` em `schemas-nfse-data.js` na raiz do projeto.

Arquivos incluidos: `CNC_v1.01.xsd`, `DPS_v1.01.xsd`, `evento_v1.01.xsd`, `NFSe_v1.01.xsd`, `pedRegEvento_v1.01.xsd`, `schema_v101-ISSNet.xsd`, `tiposCnc_v1.01.xsd`, `tiposComplexos_v1.01.xsd`, `tiposEventos_v1.01.xsd`, `tiposSimples_v1.01.xsd` e `xmldsig-core-schema.xsd`.

Para atualizar, substitua os XSDs e recrie o ZIP completo. Atualize quantidade, tamanho, SHA-256 e `dataAtualizacao` no cadastro; renove o cache de `schemas-nfse-data.js` em `index.html`. Publicar somente XSDs soltos nao atualiza o ZIP baixado pelo visitante. No site, este conjunto aparece junto dos municipios dentro de Schemas NFS-e, que comeca recolhida e nao permite edicao publica.
