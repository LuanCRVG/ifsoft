# Briefing diário

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
4. Acrescente textos, categorias e fontes. Para acrescentar outra notícia à mesma edição, adicione outro objeto dentro de `noticias`; não crie uma segunda edição com a mesma data.
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
      "resumo": "Resumo para o cartão.",
      "creditoEditorial": "Resumo editorial da equipe IFSOFT, baseado nas fontes indicadas abaixo.",
      "capa": null,
      "secoes": [
        { "titulo": "O que foi apresentado", "paragrafos": ["Texto da seção."], "imagens": [] },
        { "titulo": "Por que importa para nós", "paragrafos": ["Avaliação da equipe."], "imagens": [] }
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

As duas capturas serão fornecidas posteriormente. A notícia está sem imagens, sem caminhos quebrados e sem imagens substitutas. Não use a referência do layout como foto da notícia.

Quando recebidas, preserve os arquivos originais e use:

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

Cada imagem exige `arquivo`, `alt` e `legenda`. Não atribua autoria sem confirmação. A capa usa `object-fit: contain`; no corpo, a altura acompanha a proporção original. Na leitura completa, clicar abre o visualizador com legenda, navegação, fechamento por Escape e link para o arquivo original. Os caminhos são relativos e funcionam em `/ifsoft/` no GitHub Pages.

Os arquivos do GitHub Pages são públicos. Oculte senhas, tokens, dados pessoais e informações confidenciais antes de entregar capturas.

## Entregar a próxima edição ao Codex

Envie a data da edição, a notícia de destaque e, para cada notícia: título, categorias, data original, resumo, texto por seções e links das fontes. Anexe as imagens e indique a capa; envie legendas ou informações para escrevê-las sem inventar autoria ou contexto. Texto normal é suficiente: o Codex organiza o arquivo de dados.

Peça para acrescentar sem remover as edições anteriores, na pasta versionada `C:/Users/conta/Desktop/Scripts Python/ifsoft`. Não são necessárias chaves de API ou credenciais.
