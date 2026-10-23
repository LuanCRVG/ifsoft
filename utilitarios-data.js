// Altere os dados aqui; publique tambem o pacote e atualize a versao deste script no index.html.
window.LP_UTILITARIOS = [
  {
    id: "firebird-care",
    nome: "Firebird Care",
    versao: "1.0.4",
    descricao: "Utilitário para auxiliar na análise e recuperação de bancos de dados Firebird.",
    autor: "Luan Paranhos",
    plataforma: "Windows 10/11 x64",
    arquivo: "downloads/FirebirdCare-1.0.4-win-x64.zip",
    icone: "imagens/utilitarios/firebird-care.png",
    tamanhoBytes: 99743762,
    sha256: "744B04469FBFEAAE86F071F1F9D7DCA341644340C1DD273624BCC65D6119DCE7",
    instrucoes: [
      "Extraia todo o ZIP em uma pasta e abra FirebirdCare.exe.",
      "Mantenha os arquivos e a subpasta runtime na estrutura entregue.",
      "O pacote inclui .NET Desktop Runtime x64 e Firebird 4.0.7 embedded."
    ]
  },
  {
    id: "if-fix",
    nome: "IF Fix",
    versao: "0.8",
    descricao: "Ferramentas para correções de instalação, DLLs/MSXML e configurações de rede no Windows.",
    autor: "Luan Paranhos",
    plataforma: "Windows 10/11 (x86/x64)",
    arquivo: "downloads/IF-Fix-0.8-win.rar",
    icone: "imagens/utilitarios/if-fix.png",
    tamanhoBytes: 96231208,
    sha256: "83DF2D1EBA29F986A807090EFF62A132E6C7E89A21D813C8761B4B512A54FFA8",
    instrucoes: [
      "Extraia o RAR com WinRAR ou 7-Zip e abra IF-Fix.exe.",
      "DLLs e instaladores Visual C++ estão incorporados. O .NET Framework 4.8 pode exigir instalação com internet.",
      "Salve o trabalho antes das correções: elas podem encerrar aplicativos, trocar DLLs e alterar a rede, com permissão de administrador.",
      "Na correção de rede, escolha Sim para criar um ponto de restauração (recomendado) ou Não para continuar sem ele. O backup das configurações é feito nos dois casos.",
      "Identifica os adaptadores físicos conectados e desmarca a economia de energia quando o driver permitir.",
      "No perfil servidor, confirme a compatibilidade da fbclient.dll de 64 bits com o aplicativo de destino.",
      "Leia LEIA-ME.txt e VALIDACAO.txt e homologue as ações em um computador de teste antes do uso em produção.",
      "O executável não possui assinatura Authenticode empresarial. Confira a origem e o hash do pacote antes do uso."
    ]
  }
];
