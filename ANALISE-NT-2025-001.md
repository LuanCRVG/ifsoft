# NT Conjunta 2025.001 v1.00 - CNPJ Alfanumérico

Análise realizada em **02/10/2026**, a partir do PDF enviado, versão de **25/04/2025**, e das fontes oficiais indicadas abaixo. O registro é urgente por solicitação da IFSOFT. Esta análise identifica pontos de implementação; não certifica que o ERP ou seus componentes já estejam adequados.

## Cadastro e cronograma

| Campo | Registro |
| --- | --- |
| Documentos da IFSOFT abrangidos pela NT | NF-e, NFC-e e MDF-e |
| Homologação no PDF enviado, página 3 | 06/04/2026 |
| Produção no PDF enviado, página 3 | 06/07/2026 |
| Data de análise | 02/10/2026 |
| Prioridade | Urgente manual |
| Situação dos prazos do PDF na data da análise | Vencidos |

O registro mantém o cronograma da NT conjunta enviada. Há um complemento específico para schemas da NF-e/NFC-e, **NT 2026.004 v1.01**: a publicação no portal SVRS informa mudança da homologação para **15/06/2026** e inclusão do leiaute do serviço de inutilização. Portanto, não tratar a data original da NT conjunta como o único marco de implantação de todos os schemas. Conferir os pacotes e comunicados aplicáveis por documento e ambiente.

Os marcos da Receita Federal são diferentes: entrada em produção de seus sistemas em **27/07/2026** e emissão do primeiro CNPJ alfanumérico em **31/07/2026**. Essas datas não substituem automaticamente os prazos dos autorizadores de documentos fiscais.

A NT conjunta lista documentos sob coordenação do ENCAT. **NFS-e não consta dessa lista**. A mudança geral do CNPJ também exige revisar os cadastros e integrações que atendem NFS-e, mas seu leiaute, autorizador e cronograma precisam ser conferidos separadamente no padrão nacional ou no provedor municipal.

## Pontos de implementação

1. **Cadastros e persistência.** CNPJ continua com 14 caracteres: 12 alfanuméricos em maiúsculas e dois dígitos verificadores numéricos. Tratar como texto, preservar zeros à esquerda e revisar banco, máscaras, pesquisas, parâmetros, APIs, exportações, importações e integrações. Rotinas que removem tudo que não é número eliminam informação válida.
2. **Coexistência.** Os CNPJs existentes permanecem válidos. A implementação precisa aceitar simultaneamente o formato numérico e o alfanumérico, sem renumerar cadastros antigos.
3. **Schemas.** O padrão de CNPJ apresentado na NT é `[A-Z0-9]{12}[0-9]{2}`. Conferir todos os campos de partes envolvidas, serviços e eventos, não apenas o emitente. Em validações da aplicação, exigir correspondência do valor inteiro. Atualizar os schemas e componentes efetivamente usados em cada fluxo.
4. **DV do CNPJ.** Usar módulo 11 e substituir cada caractere pelo seu código ASCII menos 48. Isso mantém os valores de 0 a 9 e produz A=17, B=18 etc. Os exemplos e o Anexo I demonstram o cálculo; a validação precisa verificar formato, comprimento e DV.
5. **Chave de acesso.** Continua com 44 posições. O padrão indicado é `[0-9]{6}[A-Z0-9]{12}[0-9]{26}`. Revisar armazenamento, geração, consulta, relacionamentos e documentos referenciados que presumem uma chave exclusivamente numérica.
6. **DV da chave.** O Anexo II trabalha com os 43 caracteres anteriores ao DV, convertendo cada caractere por ASCII menos 48 e aplicando pesos de 2 a 9 da direita para a esquerda, reiniciados ciclicamente. Não incluir o próprio DV no cálculo nem transformar cada valor convertido em uma sequência de vários dígitos. A prosa da página 8 menciona 44 caracteres de forma imprecisa; conferir o anexo e a especificação aplicável.
7. **Eventos e serviços.** Revisar autorização, cancelamento, inutilização quando aplicável, consultas, distribuição, recepção e vinculação de documentos. A chave natural também contém o CNPJ; controles de duplicidade precisam preservar o novo formato.
8. **Documentos auxiliares.** O CODE-128C isolado não comporta letras. A NT propõe combinação dos conjuntos C/A. Usar uma biblioteca de código de barras adequada, conferir os códigos de mudança e o checksum módulo 103 e validar o resultado com leitor real, em impressão e PDF.
9. **Legibilidade.** A NT indica largura mínima de 11,5 cm, altura de 0,8 cm e margens de silêncio. A presença de letras pode aumentar a quantidade de símbolos. Não reduzir automaticamente a imagem ou remover caracteres para encaixá-la no relatório.
10. **NFS-e.** Verificar separadamente os contratos de cada provedor utilizado. Não aplicar os prazos ou a estrutura de chave de 44 posições desta NT a uma NFS-e sem confirmação de sua especificação.

## Ressalvas no PDF

- **Letras potencialmente vedadas, página 7:** a v1.00 cita I, O, U, Q e F como solicitação ainda a confirmar. Não adotar essa lista como uma restrição definitiva apenas com base neste PDF. Consultar a definição e o schema oficial aplicáveis; uma eventual restrição também precisaria ser refletida na chave.
- **Troca de conjunto, páginas 9 e 11:** a prosa menciona código 100 para alternar A/C, mas a tabela do exemplo traz **CODE A=101** e **CODE C=99**. Não copiar a frase contraditória para uma implementação.
- **Start C, página 11:** a tabela e a soma usam **105**, enquanto outra frase menciona 103. O número 103 é também o módulo do checksum, não o valor de Start C usado no exemplo. A soma apresentada, 1987, produz resto 30.
- **DV da chave, páginas 8 e 15:** a descrição menciona a chave inteira, mas o exemplo do Anexo II calcula sobre 43 caracteres, excluindo o DV. A função demonstrativa não substitui a validação completa de comprimento, formato, modelo e demais campos.

Essas divergências são alertas de leitura da versão enviada, não autorização para inventar uma regra fiscal. Conferir as especificações vigentes e o comportamento dos componentes utilizados antes de liberar em produção.

## Testes recomendados

- CNPJ numérico existente e CNPJ alfanumérico válido; o exemplo didático do PDF é `12.ABC.345/01DE-35`.
- DVs incorretos, comprimentos inválidos, CNPJ zerado, zeros à esquerda, entrada com máscara e normalização para maiúsculas.
- Emitente e demais participantes com CNPJs de formatos diferentes, nas três famílias de documentos abrangidas.
- Geração e validação de chave, referências, consultas, eventos e recepção de XML sem remover letras.
- Impressão e PDF com chave alfanumérica, validando a leitura exata dos 44 caracteres por scanner e as margens de silêncio.
- Integrações legadas, banco, arquivos e APIs que ainda usam tipos numéricos ou filtros que descartam letras.

São testes de compatibilidade a executar no ERP e nos componentes da IFSOFT; o cadastro no site não realiza esses testes fiscais.

## Fontes

- [PDF enviado - NT Conjunta 2025.001 v1.00](documentos/nt-2025-001-v1.00-cnpj-alfanumerico.pdf), especialmente páginas 3, 4, 7 a 12 e anexos I/II.
- [SVRS - Documentos da NFC-e](https://dfe-portal.svrs.rs.gov.br/Nfce/Documentos), publicações da NT conjunta e da NT 2026.004 v1.01.
- [SVRS - Documentos do MDF-e](https://dfe-portal.svrs.rs.gov.br/mdfe/Documentos), publicação da NT conjunta CNPJ alfanumérico v1.00.
- [Receita Federal - Antecipação de atividades para implantação do CNPJ alfanumérico](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/julho/antecipacao-de-atividades-para-implantacao-do-cnpj-alfanumerico), comunicado de 10/07/2026.
- [Receita Federal - Primeiro CNPJ em formato alfanumérico](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/julho/receita-federal-gera-o-primeiro-cnpj-em-formato-alfanumerico), comunicado de 31/07/2026.

Não foi enviado tópico do ACBr para esta NT. Não se presume que uma versão específica do componente já implemente todos os pontos acima.
