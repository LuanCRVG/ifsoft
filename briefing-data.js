// Notícias selecionadas manualmente. Mantenha as edições anteriores nesta lista.
window.IFSOFT_BRIEFING = [
  {
    "data": "2026-10-28",
    "destaque": "imposto-seletivo-regras-xml-danfe",
    "noticias": [
      {
        "id": "imposto-seletivo-regras-xml-danfe",
        "titulo": "'Imposto do pecado': governo deve enviar regras ao Congresso nesta semana, diz Durigan",
        "categorias": ["Reforma Tributária", "Imposto Seletivo", "NF-e"],
        "dataOriginal": "2026-10-27",
        "dataPublicacao": "2026-10-28",
        "publicadoPor": "Luan Paranhos",
        "resumo": "Durigan anunciou a previsão de envio das regras do Imposto Seletivo ao Congresso. O leiaute da NF-e/NFC-e já prevê os campos do tributo, e o novo DANFE terá sua representação. Entenda o que vai no XML e o que aparece na impressão.",
        "creditoEditorial": "Resumo informativo da notícia do G1, com confirmação da declaração pela Agência Brasil e complemento técnico baseado nas NTs 2025.002 v1.52 e 2026.010 v1.00. Consulta em 28/10/2026. Publicação no briefing por Luan Paranhos; a autoria das fontes permanece com seus autores.",
        "capa": null,
        "secoes": [
          {
            "titulo": "O que foi anunciado",
            "paragrafos": [
              "Em 27/10, o ministro da Fazenda, Dario Durigan, informou que o governo pretende encaminhar ao Congresso, provavelmente nesta semana, as regras do Imposto Seletivo, conhecido como 'imposto do pecado'. A Agência Brasil registra a previsão de uma medida provisória com as alíquotas.",
              "O tributo alcança bens e atividades prejudiciais à saúde ou ao meio ambiente, nas hipóteses legais, como cigarros e bebidas alcoólicas. A notícia trata da expectativa de regulamentação para a cobrança em 2027; o anúncio não equivale a uma alíquota já aprovada nem confirma, por si só, a data efetiva de exigência."
            ],
            "imagens": []
          },
          {
            "titulo": "Como o Imposto Seletivo será informado no XML",
            "paragrafos": [
              "A NT 2025.002 v1.52 prevê, para NF-e e NFC-e (modelos 55 e 65), o grupo det/imposto/IS em cada item. CSTIS e cClassTribIS identificam a situação e a classificação tributária do IS. Havendo apuração, são previstos vBCIS (base de cálculo), pIS (alíquota percentual) e vIS (valor do imposto).",
              "Quando aplicável, o leiaute também prevê adRemIS (alíquota específica), uTrib (unidade) e qTrib (quantidade tributável). O total fica em total/ISTot/vIS, correspondente à soma do IS dos itens.",
              "O emissor alimenta esses dados conforme o enquadramento fiscal do produto e da operação, as tabelas e as alíquotas legalmente aplicáveis. A existência do grupo no XML não significa incidência em toda venda."
            ],
            "imagens": []
          },
          {
            "titulo": "Como aparecerá no DANFE",
            "paragrafos": [
              "A NT 2026.010 v1.00, referente ao DANFE da NF-e modelo 55, prevê a base vBCIS, a alíquota pIS e o valor vIS no quadro dos produtos/serviços. Na área de totais, o bloco 'Total do IBS/CBS/IS' apresenta o total do Imposto Seletivo, proveniente de total/ISTot/vIS.",
              "A impressão e o PDF representam os dados do XML autorizado. O DANFE não cria o imposto nem deve inventar valores quando a informação não existir ou não se aplicar à operação."
            ],
            "imagens": []
          },
          {
            "titulo": "Leiaute disponível não significa cobrança imediata",
            "paragrafos": [
              "O cronograma da NT 2026.010 informa 01/12/2026 para o novo leiaute do DANFE em produção. Essa é uma data de apresentação do documento, não uma antecipação da cobrança do Imposto Seletivo.",
              "Na NT 2025.002 v1.52 consultada, as regras UB01-10 a UB11-10 do IS estão identificadas como 'Implementação Futura', e os anexos I e II registram tabelas de NCM e cClassTribIS a publicar. Isso não elimina a necessidade de respeitar o schema e as regras de consistência aplicáveis quando o grupo é enviado.",
              "Os percentuais, as hipóteses e a vigência efetiva devem seguir a norma publicada e as atualizações oficiais. Não é possível deduzir uma alíquota ou fixar 01/01/2027 como início da exigência apenas a partir deste anúncio."
            ],
            "imagens": []
          }
        ],
        "fontes": [
          { "titulo": "G1: notícia original de 27/10/2026", "url": "https://g1.globo.com/economia/noticia/2026/10/27/ministro-da-fazenda-diz-que-deve-enviar-nesta-semana-projeto-do-imposto-do-pecado.ghtml" },
          { "titulo": "Agência Brasil: declaração de Durigan sobre a MP do Imposto Seletivo", "url": "https://agenciabrasil.ebc.com.br/economia/noticia/2026-10/governo-enviara-mp-do-imposto-seletivo-e-renova-subvencao-ao-diesel" },
          { "titulo": "SVRS: NT 2025.002 v1.52 — XML, grupo UB (IS), totalização e anexos", "url": "https://dfe-portal.svrs.rs.gov.br/NFE/DownloadArquivoEstatico/?sistema=NFE&tipoArquivo=3&nomeArquivo=NT_2025.002_v1.52_RTC_NF-e_IBS_CBS_IS.pdf" },
          { "titulo": "SVRS: NT 2026.010 v1.00 — DANFE, itens 4.1, 4.3 e 4.4", "url": "https://dfe-portal.svrs.rs.gov.br/NFE/DownloadArquivoEstatico/?sistema=NFE&tipoArquivo=3&nomeArquivo=NFe_NT_2026.010_v1_00_DANFE_RTC.pdf" }
        ]
      }
    ]
  },
  {
    "data": "2026-10-23",
    "destaque": "acbr-danfe-reforma-tributaria",
    "noticias": [
      {
        "id": "acbr-danfe-reforma-tributaria",
        "titulo": "ACBr implementa o novo DANFE com informações da Reforma Tributária",
        "categorias": ["ACBr", "NF-e", "Reforma Tributária"],
        "dataOriginal": "2026-10-22",
        "dataPublicacao": "2026-10-23",
        "publicadoPor": "Luan Paranhos",
        "resumo": "O ACBr anunciou a adaptação do DANFE à NT 2026.010. Fast Reports está concluído; Fortes Report e FPDF seguem em ajustes finais e testes, com liberação gradual para as demais soluções.",
        "creditoEditorial": "Resumo informativo baseado no anúncio do Projeto ACBr de 22/10/2026. A situação apresentada pode mudar após esta edição.",
        "capa": {
          "arquivo": "imagens/briefing/danfe-reforma-tributaria.png",
          "alt": "Modelo do novo DANFE com campos de IBS, CBS e Imposto Seletivo, totais tributários e QR Code.",
          "legenda": "Imagem fornecida para esta notícia: modelo ilustrativo do novo DANFE, com dados de exemplo. Não representa uma nota fiscal emitida.",
          "largura": 927,
          "altura": 1183
        },
        "secoes": [
          {
            "titulo": "Situação dos motores de impressão",
            "paragrafos": [
              "Fast Reports: modelos DANFePaisagem_RTC.fr3 e DANFeRetrato_RTC.fr3 concluídos na revisão Rev-48780.",
              "Fortes Report e FPDF: novos componentes específicos para o DANFE RTC em ajustes finais e testes."
            ],
            "imagens": []
          },
          {
            "titulo": "Disponibilidade nas soluções ACBr",
            "paragrafos": [
              "A implementação chega primeiro aos componentes nativos para Delphi e Lazarus. O ACBr divulgará no tópico as versões do ACBrMonitorPLUS, da ACBrLibNFe e da ACBr API que incluírem os novos impressos."
            ],
            "imagens": []
          },
          {
            "titulo": "Prazo informado no anúncio",
            "paragrafos": [
              "A publicação reafirma 01/12/2026 para implantação do novo leiaute em produção. Essa data não indica que todos os motores e produtos já estejam disponíveis."
            ],
            "imagens": []
          }
        ],
        "fontes": [
          { "titulo": "Projeto ACBr: implementação do DANFE com a Reforma Tributária", "url": "https://www.projetoacbr.com.br/forum/topic/95527-danfe-com-as-informa%C3%A7%C3%B5es-da-reforma-tribut%C3%A1ria-sendo-implementado-nas-solu%C3%A7%C3%B5es-acbr/" }
        ]
      }
    ]
  },
  {
    "data": "2026-10-08",
    "destaque": "firebird-6-roadmap",
    "noticias": [
      {
        "id": "firebird-6-roadmap",
        "titulo": "Firebird 6: roadmap reúne JSON, schemas e melhorias no banco de dados",
        "categorias": ["Firebird", "Banco de dados", "Tecnologia"],
        "dataOriginal": "2024-03-20",
        "dataPublicacao": "2026-10-08",
        "publicadoPor": "Luan Paranhos",
        "resumo": "O planejamento do Firebird 6 reúne funções JSON, schemas, tablespaces e melhorias de cache e otimização. Confira as novidades previstas e o cronograma estimado de desenvolvimento.",
        "creditoEditorial": "Resumo informativo baseado no anúncio original e no roadmap oficial. Cronograma conferido para esta edição; sujeito a revisão pelo projeto Firebird.",
        "capa": {
          "arquivo": "imagens/briefing/firebird-6-roadmap.png",
          "alt": "Ilustração de um banco de dados com tabelas conectadas e o texto Firebird 6 Roadmap.",
          "legenda": "Ilustração editorial original gerada com IA para esta notícia. Não é o logotipo oficial do Firebird nem uma captura do software.",
          "largura": 1536,
          "altura": 1024
        },
        "secoes": [
          {
            "titulo": "Sobre o anúncio",
            "paragrafos": [
              "O projeto Firebird anunciou o roadmap da versão 6 em 20/03/2024, após a reunião do seu grupo técnico. Esta edição retoma o anúncio e complementa a notícia com o planejamento oficial atualizado em junho de 2026."
            ],
            "imagens": []
          },
          {
            "titulo": "Novidades previstas",
            "paragrafos": [
              "JSON: funções compatíveis com o padrão SQL para trabalhar com dados JSON.",
              "Schemas: suporte a esquemas SQL para organizar os objetos do banco de dados.",
              "Tablespaces: suporte para ampliar as opções de organização do armazenamento.",
              "Cache e otimização: cache compartilhado de metadados e melhorias no otimizador de consultas.",
              "SQL: o planejamento também inclui EXPLAIN e funções como GREATEST e LEAST."
            ],
            "imagens": []
          },
          {
            "titulo": "Cronograma estimado",
            "paragrafos": [
              "Alpha: quarto trimestre de 2026 (outubro a dezembro), indicada como em andamento no roadmap.",
              "Beta: segundo trimestre de 2027 (abril a junho).",
              "Versão final: quarto trimestre de 2027 (outubro a dezembro).",
              "As datas são estimativas, não compromissos de lançamento. O roadmap reúne recursos em diferentes estágios; a inclusão na versão 6 depende da conclusão antes da fase Beta. Não representa uma versão estável já disponível."
            ],
            "imagens": []
          }
        ],
        "fontes": [
          { "titulo": "Anúncio original do Firebird: roadmap da versão 6", "url": "https://firebirdsql.org/en/news/firebird-6-roadmap-is-published" },
          { "titulo": "Roadmap oficial: recursos e cronograma atualizado", "url": "https://www.firebirdsql.org/en/roadmap/" }
        ]
      }
    ]
  },
  {
    "data": "2026-10-07",
    "destaque": "kai-1-1-1-ia-local-rad-studio",
    "noticias": [
      {
        "id": "kai-1-1-1-ia-local-rad-studio",
        "titulo": "KAI 1.1.1: modelos de IA locais dentro do RAD Studio",
        "categorias": ["Delphi", "Inteligência artificial", "RAD Studio"],
        "dataOriginal": "2026-09-29",
        "dataPublicacao": "2026-10-07",
        "publicadoPor": "Luan Paranhos",
        "resumo": "A Embarcadero publicou um guia sobre o uso de modelos de IA locais com o KAI 1.1.1 no RAD Studio. A proposta permite assistência de programação com processamento local, sem enviar o código a um provedor de IA na nuvem e sem cobrança de tokens de API quando o modelo é executado na própria máquina.",
        "creditoEditorial": "Resumo informativo baseado nas fontes indicadas abaixo.",
        "capa": {
          "arquivo": "imagens/briefing/rad-studio-ia-configuracao.png",
          "alt": "Configurações de Smart CodeInsight no RAD Studio com uma ilustração AI.",
          "legenda": "Imagem ilustrativa fornecida pela equipe: configurações de Smart CodeInsight, com ilustração AI. Não comprova recursos específicos do KAI 1.1.1.",
          "largura": 1289,
          "altura": 958
        },
        "secoes": [
          {
            "titulo": "O que foi apresentado",
            "paragrafos": [
              "O guia demonstra a integração do KAI com uma IA executada localmente. A atualização 1.1.1 aprimora o suporte ao Ollama e ao LM Studio e traz melhorias nos fluxos de assistência que utilizam ferramentas para trabalhar com arquivos do projeto.",
              "O uso local depende da configuração escolhida e dos recursos da máquina. O desempenho e as capacidades variam conforme o modelo."
            ],
            "imagens": [
              {
                "arquivo": "imagens/briefing/delphi-editor-codigo.png",
                "alt": "Editor Delphi com código e uma lista de sugestões de preenchimento.",
                "legenda": "Imagem ilustrativa fornecida pela equipe: editor Delphi com sugestões de código. Não comprova recursos específicos do KAI 1.1.1.",
                "largura": 1748,
                "altura": 1043
              }
            ]
          }
        ],
        "fontes": [
          { "titulo": "Guia da Embarcadero", "url": "https://blogs.embarcadero.com/kai-1-1-1-supercharge-local-ai-in-rad-studio/" },
          { "titulo": "Anúncio da atualização", "url": "https://blogs.embarcadero.com/kai-1-1-1-is-now-available/" }
        ]
      }
    ]
  }
];
