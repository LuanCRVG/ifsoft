# NT SE/CGNFS-e 009 v1.01 - NFS-e Padrão Nacional / RTC

Análise realizada em **05/10/2026** para acompanhamento técnico, com base no [PDF enviado](documentos/nt-009-v1.01-nfse-nacional-rtc.pdf), no [tópico do ACBr](https://www.projetoacbr.com.br/forum/topic/95165-publicada-nota-t%C3%A9cnica-atualizando-o-leiaute-da-nfs-e-no-padr%C3%A3o-nacional/) e na [documentação oficial RTC da NFS-e](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc). As páginas abaixo se referem ao PDF enviado, preservado sem alterações.

## Escopo, datas e prioridade

O conteúdo e a capa identificam a **NT SE/CGNFS-e nº 009, versão 1.01**, de adequações da **NFS-e de padrão nacional** e da DPS. Apesar de o nome do arquivo recebido mencionar Via, não se trata da NT 010 referente à NFS-e Via; o portal distingue essas publicações.

| Campo no site | Cadastro |
| --- | --- |
| Documento fiscal | NFS-e |
| Homologação | Sem data, aguardando cronograma |
| Produção | Sem data, aguardando cronograma |
| Urgente | Não, conforme definição manual |
| Análise | 05/10/2026 |
| Vigente | Sim, como versão de referência; não significa implantação em produção |

A **página 3** informa que o cronograma das funcionalidades será publicado no portal da NFS-e. Não atribuir à NT os prazos de outras notas ou de outros documentos fiscais. A capa traz **11/09/2026**, enquanto o portal identifica a publicação em **01/10/2026**; essas datas não são prazos de implantação.

O marco de **01/01/2027**, na **página 16**, refere-se especificamente à vedação do domínio Desconhecido em campos de `comExt` de notas compartilhadas pelos municípios ao ADN. Ele não substitui o cronograma geral e não foi colocado no campo de produção.

## Principal cuidado: preenchimento IBS/CBS

Nas **páginas 21-22**, `CST` e `cClassTrib` passam a ser informados em `DPS/infDPS/IBSCBS/valores/trib`, antes de `gIBSCBS`. A ocorrência **0-1** desse grupo não autoriza uma escolha livre: seu preenchimento depende do indicador **`ind_gIBSCBS`**, relacionado ao CST na tabela CST/Classificação Tributária.

A NT destaca CST **400** (isenção), **410** (imunidade e não incidência) e **820** (tributação em documento específico). Quando o indicador não exigir detalhamento, os campos correspondentes não devem ser preenchidos. Isso repercute em `cIndOp` na DPS e em localidade, valores, `vBC`, `gIBS` e `gCBS` na NFS-e.

**Recomendação de implementação:** não decidir o preenchimento apenas pela ausência de alíquota ou por uma configuração global de Reforma Tributária. Usar a tabela oficial aplicável e as regras de negócio do leiaute, distinguindo os campos enviados na DPS dos campos gerados na NFS-e. Esta recomendação não altera automaticamente nenhum problema cadastrado no site.

## Demais impactos no sistema

| Tema | Impacto a conferir | Páginas |
| --- | --- | --- |
| CNPJ | Todos os campos passam de numérico para caractere; preservar letras e zeros em cadastros, XML e integrações | 3 |
| Notas de ajuste | `finNFSe` na raiz `infDPS`, tipos de crédito/débito e `gIBSCBSAjuste`; consultar a planilha `NFS-e_AJUSTE_LEIAUTE`. Regras tachadas ainda estão em evolução | 3-4 |
| Ajustes de base | `vDedRed` e `gReeRepRes` se tornam `vAjusteBC`; revisar documentos, tipos descontinuados e a planilha `AJUSTE_BC_REPERCUSSÃO`, separando ISSQN, IBS/CBS e receita do Simples | 4-8 |
| Simples Nacional | `opSimpNac=4`, `regApIBSCBSSN`, `cAtvSN`, `vReceitaBrutaSN`, `gTribSN`; condições recíprocas de `cAtvSN` e segregação interna/externa por `tpRBSN` | 8-10 |
| Uso pessoal | Reinserção de `indFinal` em `infDPS/IBSCBS` | 10 |
| Imóveis e móveis | `gLocacao`, até 99 `gUnidImob`, ajustes e copropriedade; `gLocBensMoveis` renomeado para `bensMoveis`, até 1.000 registros | 10-12 |
| Pagamentos | `gPgtoVinc` para até 99 transações conhecidas na emissão; a NT prevê evento para informação posterior, sem confirmar sua disponibilidade | 13 |
| Calculadora | `verCalcIBSCBS` é gerado pela Sefin Nacional (`ambGer=2`), sem exigência para notas autorizadas no ambiente municipal próprio e compartilhadas ao ADN | 13 |
| Endereços | Conferir municípios IBGE contra cadastro CPF/CNPJ, com a exceção específica do subitem 17.05 quando tomador e destinatário têm a mesma raiz CNPJ ou o mesmo CPF | 13-14 |
| Destinatário | `indDest` e `dest` passam para `infDPS`, após `toma`; conferir ordem e hierarquia do XML, não apenas renomear propriedades | 14-15 |
| Comércio exterior | `nFatura`, `vFatura`, `nContCambio`, `nDUIMP`/`nDUE`, moedas do Banco Central e `mdPrestacao=5` para consumo no Brasil e exterior | 15-17 |
| Ajuste de comércio exterior | `vAjusteBCIBSCBSComExt` admite sinal positivo ou negativo, altera a base IBS/CBS sem mudar `vServ`; fórmula de `vBC` considera dedução de PIS/COFINS até 2026 | 17-18 |
| Eventos | `atvEvento/cMun` nos subitens 12.13 e 17.10; `atvEvento` exigido para 17.10 | 18-19 |
| Condomínios | Código 99.05.01, cobranças/descontos, composição de valores e `imovel` obrigatório; operação prevista nos emissores públicos nacionais | 19-21 |

## Anexos e ACBr

Na consulta ao portal oficial em **05/10/2026**, a NT está acompanhada de **Anexo VI v1.04.01** e **Anexo VII v1.03.00**. O PDF (página 3) e o tópico do ACBr mencionam Anexo VII **v1.02.01**. Conferir a versão efetivamente publicada no portal antes de implementar; esta análise não examinou as planilhas na íntegra nem certifica compatibilidade de schemas.

O portal também informa que o **Anexo VIII** de correlação de serviços/NBS/cClassTrib/cIndOp ainda está em desenvolvimento e não fundamenta regras de negócio no piloto RTC nem em produção. Não transformar suas correlações preliminares em bloqueios definitivos.

O ACBr informa a criação da tarefa **ACBr-9969** para adequar o **ACBrNFSeX**. A postagem não confirma entrega concluída. Acompanhar o tópico, os schemas oficiais e a versão do componente utilizada pelo sistema.

## Verificações recomendadas

Estes são encaminhamentos de teste derivados da leitura, a executar conforme a disponibilização dos ambientes e o cronograma oficial:

- Validar hierarquia e ordem da DPS, com destinatário próprio e destinatário diferente, incluindo o reposicionamento de `CST`/`cClassTrib`.
- Testar classificações com e sem exigência de `gIBSCBS`, sem gerar grupos indevidos ou omitir grupos exigidos pelo indicador.
- Testar CNPJ numérico e alfanumérico, preservando letras e zeros, inclusive nos pagamentos vinculados.
- Testar notas regular, crédito e débito, separando regras confirmadas das regras ainda tachadas/em evolução.
- Conferir ajustes de base sem duplicação e a repercussão correta para cada tributo e para o Simples Nacional.
- Testar optante e optante pendente, regimes de IBS/CBS e segregação de receita pelo `tpRBSN`.
- Testar município divergente, destinatário com mesma e diferente raiz CNPJ, e a exceção de endereço do subitem 17.05.
- Testar comércio exterior com ajuste positivo, negativo e ausente, preservando `vServ`; distinguir o marco específico de 2027 do prazo geral ainda pendente.
- Conferir eventos, copropriedade, condomínios e limites das listas apenas nos cenários aplicáveis à operação.
- Atualizar os prazos e reavaliar a urgência quando o cronograma da NT 009 for publicado, sem inventar datas intermediárias.
