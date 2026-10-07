# IFSOFT Sistemas - Central Técnica

Site estático em HTML, CSS e JavaScript, com as abas **Notas técnicas**, **Problemas no sistema** e **Briefing diário**. Compatível com abertura local e GitHub Pages, sem servidor ou etapa de build.

O visual compartilhado usa cabeçalho azul-marinho, superfícies brancas e destaque azul, mantendo os filtros e cadastros fiscais existentes. O briefing é editorial e independente: não utiliza os registros ou prazos das outras abas. A primeira edição, de **07/10/2026**, contém somente a notícia real sobre KAI 1.1.1. As duas capturas serão acrescentadas quando a equipe as entregar.

Para publicar o briefing, envie também `briefing.html`, `briefing.js`, `briefing.css`, `briefing-data.js`, `BRIEFING.md` e a pasta `imagens/briefing/`, além dos arquivos existentes. A notícia usa `briefing.html?edicao=...&noticia=...`; o retorno preserva a edição selecionada. Leia [BRIEFING.md](BRIEFING.md) para acrescentar edições, múltiplas notícias e imagens sem editar o layout.

Na listagem de notas, cada registro mostra apenas uma **observação resumida**. Clicar em qualquer área da linha da tabela ou do card no celular abre `nota.html?id=...`, com todas as observações organizadas por assunto, sumário, prazos e links do PDF e do ACBr. O título continua sendo um link com a indicação **Leia aqui**, acessível pelo teclado. Os links **Abrir NT** e **ACBr** mantêm seus destinos próprios; selecionar texto não abre a nota. Não há mais botão de expandir/recolher observações na tabela ou nos cards de celular. O link **Voltar às notas técnicas** retorna à lista.

A lista atual contém quatro notas reais, analisadas em **01, 02 e 05/10/2026**:

| Nota técnica | Documentos | Homologação | Produção | Prioridade |
| --- | --- | --- | --- | --- |
| NT 2026.010 v1.00 - DANFE Reforma Tributária | NF-e, modelo 55 | Não informada | 01/12/2026 | Urgente por marcação da equipe |
| NT 2026.008 v1.00 - Valor Líquido do Produto | NF-e/NFC-e, modelos 55/65 | 05/10/2026 | 03/11/2026 | Automática, pelos próximos 30 dias de produção |
| NT Conjunta 2025.001 v1.00 - CNPJ Alfanumérico | NF-e, NFC-e e MDF-e | 06/04/2026 | 06/07/2026 | Urgente manual, prazo já vencido |
| NT SE/CGNFS-e 009 v1.01 - NFS-e Padrão Nacional / RTC | NFS-e | Aguardando cronograma | Aguardando cronograma | Não urgente, sem prazo de produção |

A NT SE/CGNFS-e 009 v1.01 não informa datas de homologação ou produção. Os dois campos ficam vazios, e o site exibe **Sem data**; o cronograma será publicado no portal da NFS-e. A data específica de **01/01/2027** para o fim do domínio Desconhecido em campos de comércio exterior compartilhados pelos municípios ao ADN não foi usada como prazo geral da NT. A nota está com `urgente: false` e não gera urgência automática enquanto não houver prazo de produção.

Na NT 2026.008, **NB01-30** tem prazo específico: homologação em **01/02/2027** e produção em **01/03/2027**. Esse prazo está nas observações; o prazo principal do registro mantém a entrega geral de novembro. Pela regra automática, a nota entra em Urgentes em **04/10/2026**, sem marcação manual.

O cadastro do CNPJ alfanumérico preserva as datas do cronograma do PDF enviado. O complemento específico de schemas da NF-e/NFC-e, **NT 2026.004 v1.01**, informa homologação em **15/06/2026**; conferir os pacotes e comunicados aplicáveis antes de testar. A implantação dos sistemas da Receita Federal em **27/07/2026** e o primeiro CNPJ alfanumérico em **31/07/2026** são marcos distintos. A NFS-e não está no escopo da NT conjunta e exige conferência do padrão/provedor utilizado.

Os PDFs enviados estão em `documentos/`. Todas as quatro notas oferecem também o tópico do ACBr, incluindo a nota de CNPJ alfanumérico; os links aparecem na listagem e na página de detalhes. Os pontos de implementação, mapeamentos e dependências estão em [ANALISE-NT-2026-010.md](ANALISE-NT-2026-010.md), [ANALISE-NT-2026-008.md](ANALISE-NT-2026-008.md), [ANALISE-NT-2025-001.md](ANALISE-NT-2025-001.md) e [ANALISE-NT-009-NFSE.md](ANALISE-NT-009-NFSE.md).

## Como editar os registros

Abra o arquivo `script.js` e altere a lista `notasTecnicas`.

Cada registro segue este formato:

```js
{
  id: "nt-2026-011-v1-00",
  descricao: "Descrição da NT",
  resumo: "Uma observação curta para a listagem principal.",
  tipo: "Nota técnica",
  documento: ["NF-e", "NFC-e"],
  uf: "Todos",
  observacoes: [
    "Primeira observação",
    "Segunda observação"
  ],
  link: "https://link-da-nota-ou-informe",
  linkAcbr: "https://link-do-topico-acbr",
  vigente: true,
  urgente: false,
  dataAnalise: "2026-05-21",
  prazoHomologacao: "2026-07-01",
  prazoProducao: "2026-09-01"
}
```

Use datas no formato `AAAA-MM-DD`. O site exibe automaticamente no formato brasileiro.

`id` é um identificador único e estável para o link da nota; não mude o ID ao corrigir apenas o título ou o texto. `resumo` é a única observação exibida na listagem. A lista `observacoes` contém os textos completos, exibidos somente na página da nota. Tanto a lista quanto a página de detalhes usam o mesmo cadastro em `script.js`: não duplique os dados em `nota.js` ou no HTML. Para cadastros antigos sem `id` ou `resumo`, o site usa a descrição como identificador e a primeira observação como resumo.

A busca principal continua consultando todas as observações, mesmo as que estão somente na página de detalhes. O sumário dessa página usa o assunto que precede `:` no começo de uma observação, quando houver; observações sem esse prefixo recebem um título genérico. O texto original permanece completo.

Se os prazos não tiverem sido publicados, use `prazoHomologacao: ""` e/ou `prazoProducao: ""` para deixar os campos sem data. Não use datas de publicação ou regras específicas como substitutas do cronograma geral. `linkAcbr` é opcional. O campo `vigente` identifica a versão de referência da NT; o prazo de produção é informado separadamente.

Os documentos fiscais são **NF-e**, **NFC-e**, **NFS-e** e **MDF-e**. Para uma nota de um único documento, use, por exemplo, `documento: "NFS-e"`. Para uma nota que se aplica a mais de um, use `documento: ["NF-e", "NFC-e"]`. A nota será encontrada nos filtros de ambos os documentos, sem duplicar o total de registros.

## Notas urgentes

O campo `urgente: true` marca a nota como urgente manualmente. Use `urgente: false` para deixar a prioridade sob a regra automática.

Uma nota vigente é considerada urgente automaticamente quando o prazo de **produção** é hoje ou está nos próximos 30 dias. Prazos vencidos não geram urgência automática; uma marcação manual permanece ativa até você alterar o campo. O período pode ser alterado em `PRAZO_URGENTE_DIAS`, no início do `script.js`.

Ao clicar em **Urgentes**, o site limpa os filtros anteriores, mostra todas as notas urgentes e ordena pelo prazo de produção, da data mais próxima para a mais distante. Registros sem prazo ficam no final. A busca e o filtro de documento podem refinar essa lista. **Total** mostra tudo novamente e **Vigentes** mostra apenas as normas vigentes.

Os indicadores contam todos os registros cadastrados; o número de resultados informa quantos estão sendo exibidos. Os registros de demonstração foram removidos.

## Problemas no sistema

A aba **Problemas no sistema** tem um sino e recebe destaque âmbar quando existe pelo menos uma ocorrência não resolvida. Enquanto a aba estiver fora de foco, o sino faz um breve movimento a cada 4,8 segundos; ao selecionar a aba, a animação deixa de ser aplicada. Se todos os problemas estiverem resolvidos, não há alerta. A preferência de movimento reduzido do navegador desativa a animação, mantendo o destaque estático. O contador continua mostrando o total de ocorrências e fica visível também no celular; o tooltip informa quantas estão em aberto. Esse aviso não altera a prioridade dos problemas nem marca ocorrências normais como urgentes.

A aba pública é **somente para consulta**. Visitantes podem visualizar os detalhes, buscar, filtrar e ordenar as ocorrências. Não há formulário de cadastro, edição, exclusão, importação, resolução ou reabertura no site. A área continua sem ocorrências fictícias.

Os textos de **Problema relatado**, **Parecer técnico**, **Possível solução** e **Passos para reproduzir** aparecem completos. Os indicadores de urgência contam somente os problemas ainda não resolvidos. Os filtros desta aba são independentes dos filtros das notas técnicas.

### Como você cadastra e atualiza os problemas

A manutenção é feita no arquivo `problemas-data.js`, com acesso de edição ao repositório do GitHub. Não existe uma senha administrativa ou um modo de edição escondido na página pública.

1. Abra `problemas-data.js` no editor ou no seu repositório do GitHub.
2. Adicione ou altere os objetos dentro da lista `window.IFSOFT_PROBLEMAS`.
3. Salve e publique a alteração na branch configurada no GitHub Pages.
4. Aguarde a atualização e recarregue o site. Todos os visitantes verão a nova versão publicada.

Exemplo de estrutura (não incluído na lista pública):

```js
window.IFSOFT_PROBLEMAS = [
  {
    id: "PRB-20261002-001",
    titulo: "Título do problema",
    modulo: "NF-e",
    versao: "",
    status: "analise",
    prioridade: "urgente",
    ambiente: "producao",
    responsavel: "IFSOFT",
    dataRelato: "2026-10-02",
    prazo: "",
    problemaRelatado: "Descreva o problema relatado.",
    parecerTecnico: "Registre a análise técnica.",
    solucao: "Registre uma possível solução.",
    passosReproducao: "",
    imagensProblema: [],
    imagensParecer: [],
    imagensSolucao: [],
    criadoEm: "2026-10-02T12:00:00.000Z",
    atualizadoEm: "2026-10-02T12:00:00.000Z"
  }
];
```

Use um `id` único por ocorrência, somente com letras, números, hífen ou sublinhado. Para adicionar mais registros, separe os objetos por vírgulas. Datas usam `AAAA-MM-DD`; `prazo` pode ficar vazio. Atualize `atualizadoEm` ao revisar um registro e preserve `criadoEm`. O título, a data do relato e o problema relatado são obrigatórios. O limite é de 500 ocorrências.

- `status`: `relatado`, `analise`, `correcao` ou `resolvido`. A resolução ou reabertura é feita alterando este campo no arquivo.
- `prioridade`: `normal`, `alta` ou `urgente`.
- `ambiente`: `producao`, `homologacao`, `ambos` ou `nao-aplica`.
- `modulo`: `NF-e`, `NFC-e`, `NFS-e`, `MDF-e`, `Cadastros`, `Financeiro`, `Integrações` ou `Outros`.

Problemas com `status: "resolvido"` aparecem em verde, com um símbolo de confirmação e o carimbo **RESOLVIDO** no card e no cabeçalho dos detalhes. Os demais mostram um relógio e **Aguardando solução**, sem mudar seu status ou prioridade. Na ordenação padrão por prioridade, os problemas em aberto continuam antes dos resolvidos.

O site lê **somente a lista publicada**. Alterações locais salvas pela versão anterior não são carregadas nem apagadas por esta versão. Preserve eventuais backups antigos antes de limpar os dados do navegador.

Para que somente você altere a publicação, mantenha sua conta do GitHub e o acesso de escrita ao repositório sob seu controle. O site, o arquivo de dados e os PDFs continuam públicos. Não publique senhas, tokens, dados pessoais de clientes ou informações comerciais confidenciais.

### Imagens dos problemas

Cada registro aceita três campos opcionais: `imagensProblema` (relato), `imagensParecer` (parecer técnico) e `imagensSolucao` (possível solução). Os dois registros atuais têm esses campos vazios, sem imagens de demonstração. As áreas **Imagens do relato**, **Imagens do parecer** e **Imagens da solução** ficam visíveis mesmo com `[]`, mostrando a contagem zero e **Nenhuma imagem cadastrada.** Não há botão público de envio; o cadastro continua sendo feito no arquivo.

Quando tiver uma captura de tela, coloque o arquivo na pasta `imagens/problemas/` e preencha a lista correspondente em `problemas-data.js`. Exemplo para o relato:

```js
imagensProblema: [
  {
    arquivo: "imagens/problemas/erro-devolucao.png",
    legenda: "Mensagem exibida ao emitir a devolução"
  }
],
imagensParecer: [],
imagensSolucao: [],
```

`arquivo` é o caminho da imagem e `legenda` é opcional. Use caminhos relativos com `/`, sem a barra inicial, sem caminhos do Windows e sem sair da pasta do site. Arquivos locais podem ser PNG, JPG/JPEG, WebP, GIF ou AVIF. Também são aceitos endereços completos HTTPS, sem usuário ou senha no endereço. Prefira arquivos locais para não depender de serviços externos.

Cada campo aceita até dez imagens. Para adicionar mais, separe os objetos por vírgulas. Não mude os nomes `arquivo` e `legenda`. Ao publicar, envie ao GitHub tanto o `problemas-data.js` atualizado quanto os arquivos de imagem; informar apenas o nome do arquivo não envia a imagem.

As miniaturas aparecem abaixo do texto correspondente, na área de imagens de cada campo. Ao clicar, a imagem abre ampliada, sem recorte, em uma janela com legenda. Há navegação pelas imagens do mesmo campo, fechamento pelo botão, por Escape ou pelo fundo da janela, e um link para abrir o arquivo original. As setas esquerda/direita também navegam entre as imagens. Falhas de carregamento são sinalizadas; o aviso de campo vazio é substituído pela galeria quando houver imagens cadastradas.

Ao atualizar esta versão no GitHub, publique também `index.html`, `styles.css` e `problemas.js`; alterar apenas `problemas-data.js` não atualiza a interface. O HTML usa uma versão na URL dos estilos e do script de problemas para evitar que o navegador reutilize os arquivos antigos após a publicação.

Esta funcionalidade não permite upload ou edição por visitantes. Antes de publicar capturas de tela, oculte dados pessoais, senhas, tokens e informações confidenciais; as imagens publicadas no GitHub Pages são públicas.

### Arquivos e navegação

`problemas-data.js` contém os registros publicados; `problemas.js` controla exclusivamente a consulta, a lista e os filtros; `navigation.js` controla as abas. Os cadastros de notas continuam em `script.js`, sem alteração.

É possível abrir diretamente `index.html#notas-tecnicas` ou `index.html#problemas-no-sistema`. As abas também respondem às setas do teclado, Home e End, e à navegação voltar/avançar do navegador. Nenhum problema foi criado a partir das notas técnicas: são cadastros diferentes.

## Ícone do navegador

O favicon usa um monograma **IF** branco sobre azul, com um detalhe em azul-claro. Ele aparece na aba do navegador tanto na página principal quanto nos detalhes das notas, sem alterar o símbolo existente no cabeçalho do site.

`favicon.svg` é a versão vetorial; `favicon-32.png` e `favicon.ico` são alternativas para outros navegadores. O ICO inclui tamanhos de 16, 32 e 48 pixels. `apple-touch-icon.png` tem 180 pixels e identifica o site quando adicionado à tela inicial de dispositivos Apple.

Publique os quatro arquivos de ícone junto com `index.html` e `nota.html`. Os caminhos são relativos para funcionar também no endereço de projeto do GitHub Pages. Ao trocar o desenho no futuro, atualize os arquivos derivados e a versão `?v=...` dos links nas duas páginas, pois navegadores podem manter favicons antigos em cache.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie os arquivos `index.html`, `nota.html`, `nota.js`, `styles.css`, `script.js`, `navigation.js`, `problemas.js`, `problemas-data.js`, `README.md`, `favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`, os arquivos `ANALISE-NT-*.md` e as pastas `vendor/`, `documentos/` e `imagens/` para a raiz do repositório. `nota.html` e `nota.js` são necessários para os links de observações completas; os arquivos de favicon identificam o site na aba do navegador; `vendor/` contém os ícones locais do Lucide e sua licença; `documentos/` contém as NTs em PDF; `imagens/problemas/` recebe as capturas de tela das ocorrências. Envie os arquivos extraídos do ZIP, não somente o ZIP.
3. No GitHub, acesse `Settings` > `Pages`.
4. Em `Build and deployment`, escolha `Deploy from a branch`.
5. Selecione a branch `main` e a pasta `/root`.
6. Salve e aguarde o GitHub gerar o link do site.

Se preferir publicar dentro de uma pasta `docs`, coloque estes arquivos em `docs/` e selecione essa pasta nas configurações do GitHub Pages.

Não é necessário instalar pacotes ou executar um build. Todos os recursos usam caminhos relativos e funcionam tanto abrindo `index.html` diretamente quanto no GitHub Pages.
