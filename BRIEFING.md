# Briefing tecnológico

Notícias selecionadas quando houver conteúdo relevante, sem compromisso de publicação diária. As edições continuam organizadas por data, preservando o histórico. Os arquivos e o endereço interno `#briefing-diario` mantêm os nomes anteriores para não quebrar links existentes; o nome apresentado ao visitante é **Briefing tecnológico**.

## Estrutura

- `briefing-data.js`: somente conteúdo, em objetos compatíveis com JSON dentro de `window.IFSOFT_BRIEFING = [...]`.
- `briefing.js`: validação, edição selecionada, pesquisa, categorias, leitura completa e ampliação de imagens.
- `briefing.css`: apresentação editorial, independente dos dados.
- `briefing.html`: página de leitura completa.
- `imagens/briefing/`: imagens locais fornecidas pela equipe.

O conteúdo é carregado como JavaScript para funcionar também ao abrir `index.html` diretamente. Não há `fetch`, servidor, coleta de notícias, API de IA, login ou edição pública. Os textos são tratados como texto simples, não como HTML.

## Acrescentar uma edição

1. Abra `briefing-data.js` e acrescente um objeto na lista externa, separado dos demais por vírgula. Não apague as edições anteriores.
2. Informe `data` em `AAAA-MM-DD`, `destaque` com o identificador da notícia principal e `noticias` com uma ou mais notícias.
3. Cada notícia precisa de um `id` único na edição, usando letras minúsculas, números e hífens. `dataPublicacao` deve ser igual à data da edição. `dataOriginal` é a data do artigo da fonte, não a data do briefing.
4. Acrescente apenas o texto da notícia enviado, categorias, fontes e `publicadoPor`. Não acrescente avaliações da equipe, recomendações ou sugestões de adoção. Para outra notícia na mesma edição, adicione outro objeto dentro de `noticias`.
5. Coloque as imagens em `imagens/briefing/` e preencha `capa` ou `imagens` da seção correspondente. Sem imagem, mantenha `capa: null` e as listas `imagens: []`.
6. Altere a versão de `briefing-data.js?v=...` em **index.html e briefing.html**, por exemplo para `20261008-1`. Publique os dados, os dois HTMLs e as novas imagens no seu commit e push.

As edições aparecem da mais recente para a mais antiga. A pesquisa e as categorias se aplicam apenas à edição selecionada. A ordem das notícias é preservada, com o destaque primeiro.

Modelo de objeto para preencher, sem substituir os conteúdos publicados:

```js
{
  "data": "AAAA-MM-DD",
  "destaque": "identificador-da-noticia",
  "noticias": [
    {
      "id": "identificador-da-noticia",
      "titulo": "Título da notícia",
      "categorias": ["Delphi"],
      "dataOriginal": "AAAA-MM-DD",
      "dataPublicacao": "AAAA-MM-DD",
      "publicadoPor": "Luan Paranhos",
      "resumo": "Resumo para o cartão.",
      "creditoEditorial": "Resumo informativo baseado nas fontes indicadas abaixo.",
      "capa": null,
      "secoes": [
        { "titulo": "O que foi apresentado", "paragrafos": ["Texto da notícia enviado para publicação."], "imagens": [] }
      ],
      "fontes": [
        { "titulo": "Nome da fonte", "url": "https://endereco-da-fonte.example/artigo" }
      ]
    }
  ]
}
```

O modelo acima é apenas documentação. Não publique sem preencher os campos. Limites: 500 edições, 100 notícias por edição, 30 seções por notícia e 10 imagens por seção. Fontes devem usar HTTPS, sem usuário ou senha na URL.

## Imagens da edição de 07/10/2026

As duas capturas fornecidas foram copiadas integralmente, sem recorte ou recompressão. A configuração de Smart CodeInsight é a capa; o editor Delphi aparece no corpo. Elas são ilustrativas, sem atribuição de autoria e sem comprovar recursos específicos do KAI 1.1.1. Não use a referência do layout como foto da notícia.

Arquivos publicados:

- `imagens/briefing/rad-studio-ia-configuracao.png`: capa e primeira imagem na leitura completa.
- `imagens/briefing/delphi-editor-codigo.png`: corpo da seção “O que foi apresentado”.

Substitua `capa: null` por:

```js
"capa": {
  "arquivo": "imagens/briefing/rad-studio-ia-configuracao.png",
  "alt": "Configurações de Smart CodeInsight no RAD Studio com uma ilustração AI.",
  "legenda": "Imagem ilustrativa fornecida pela equipe: configurações de Smart CodeInsight. Não comprova recursos específicos do KAI 1.1.1."
}
```

Na primeira seção, preencha:

```js
"imagens": [
  {
    "arquivo": "imagens/briefing/delphi-editor-codigo.png",
    "alt": "Editor Delphi com código e sugestões exibidas no ambiente de desenvolvimento.",
    "legenda": "Imagem ilustrativa fornecida pela equipe: editor Delphi com sugestões de código. Não comprova recursos específicos do KAI 1.1.1."
  }
]
```

Cada imagem exige `arquivo`, `alt` e `legenda`. Os campos opcionais `largura` e `altura` devem ser informados juntos, com as dimensões reais em pixels, para reservar espaço durante o carregamento. Não atribua autoria sem confirmação. A capa usa `object-fit: contain`; no corpo, a altura acompanha a proporção original. Na leitura completa, clicar abre o visualizador com legenda, navegação, fechamento por Escape e link para o arquivo original. Os caminhos são relativos e funcionam em `/ifsoft/` no GitHub Pages.

Os arquivos do GitHub Pages são públicos. Oculte senhas, tokens, dados pessoais e informações confidenciais antes de entregar capturas.

## Edição de 08/10/2026

A notícia `firebird-6-roadmap` é o destaque desta edição, publicada por Luan Paranhos. A data original é **20/03/2024**, do anúncio; a edição do site é **08/10/2026**. O texto complementa o anúncio com o roadmap oficial atualizado em junho de 2026, identificando o cronograma como estimado. Ambos os links estão nas fontes.

A captura enviada serve como referência de conteúdo, não como capa. A notícia usa `imagens/briefing/firebird-6-roadmap.png`, uma ilustração editorial original gerada com IA, com 1536 x 1024 pixels. Não reproduz o logotipo oficial nem apresenta uma captura do software. A legenda identifica essa natureza; a capa preserva a proporção e pode ser ampliada na leitura completa. O prompt está em `imagens/briefing/README.md`. As listas de imagens das seções continuam vazias, sem duplicar a capa.

A edição de 07/10/2026 e suas imagens permanecem intactas no arquivo. Para estudar o cadastro de uma nova edição, compare os dois objetos em `briefing-data.js`: cada um tem sua data, destaque e lista de notícias. O campo `capa` contém o caminho relativo, texto alternativo, legenda e dimensões; trocar esses dados não exige alterar o layout.

## Entregar a próxima edição ao Codex

Envie a data da edição, a notícia de destaque e, para cada notícia: título, categorias, data original, resumo, texto da notícia, nome do publicador e fontes. O conteúdo não deve receber sugestões ou pareceres extras. `publicadoPor` identifica quem publicou no site, não a autoria do artigo original nem das imagens. Anexe imagens, indique a capa e envie legendas ou contexto confirmado. Texto normal é suficiente: o Codex organiza os dados.

Peça para acrescentar sem remover as edições anteriores, na pasta versionada `C:/Users/conta/Desktop/Scripts Python/ifsoft`. Não são necessárias chaves de API ou credenciais.

## Convite na entrada

Quando há notícias disponíveis e o visitante está em outra aba, aparece um aviso fechável para conferir o briefing. Clicar em **Ver briefing** seleciona a aba real e move o foco para ela. Fechar ou visitar o briefing oculta o aviso até a próxima abertura/recarregamento da página; não há armazenamento de dados do visitante.

Acima da aba, a indicação **Confira** tem uma seta e pulsação suave em CSS, sem GIF externo. A animação para ao selecionar o briefing e fica estática com a preferência de movimento reduzido. Sem edições com notícias, não aparece convite nem indicação animada.
