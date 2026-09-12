/* =========================================================================
   DICEVTT — CONFIGURAÇÃO CENTRAL DO SITE
   -------------------------------------------------------------------------
   TUDO que muda com frequência mora aqui: links, imagens, vídeos, e quais
   páginas estão ligadas ou em manutenção. Nenhum outro arquivo precisa ser
   editado para trocar um link ou desligar uma aba.

   COMO USAR NO HTML:
     <a data-href="links.discord">           -> vira href do link
     <img data-src="imagens.ficha">          -> vira src da imagem
     <span data-texto="links.emailContato">  -> vira o texto do elemento
     <div data-video="videos.demo"></div>    -> vira um player do YouTube
   ========================================================================= */

window.DICEVTT = {

  /* ---------------------------------------------------------------------
     1. LINKS
     Troque qualquer URL aqui e ela muda no site inteiro.
     Link vazio ("") = o botão que usa esse link entra em modo "em breve".
     --------------------------------------------------------------------- */
  links: {
    // Comunidade
    discord:        "https://discord.gg/Egb8PQzPN8",
    instagram:      "https://www.instagram.com/dicevtt/",
    twitter:        "",                       // ainda não temos
    youtube:        "",                       // canal oficial, quando existir
    emailContato:   "dicevtt@gmail.com",

    // GitHub
    github:         "https://github.com/LeanLopes01/dicevtt.github.io",
    githubReleases: "https://github.com/LeanLopes01/dicevtt.github.io/releases/latest",
    githubSrds:     "https://github.com/LeanLopes01/Vers-o-SRDs-em-portugues",
    githubSrdsZip:  "https://github.com/LeanLopes01/Vers-o-SRDs-em-portugues/archive/refs/heads/main.zip",
    badgeDownloads: "https://img.shields.io/github/downloads/LeanLopes01/dicevtt.github.io/total?style=for-the-badge&logo=github&label=DOWNLOADS&color=6300B0&labelColor=0d0d12",

    // Formulários
    formPesquisa:   "https://forms.gle/qNxmzAc98fkydkba8",
    formSugestoes:  "",                       // <- COLE AQUI o forms de sugestões

    // Apoio
    apoiase:        "",                       // <- COLE AQUI o link do apoia.se

    // Downloads (o de Windows é reescrito pelo version.json, veja "versao")
    downloadWindows: "https://github.com/LeanLopes01/dicevtt.github.io/releases/download/0.4.5.14/dicevtt-0.4.5.14.exe",
    downloadLinux:   "https://github.com/LeanLopes01/dicevtt.github.io/releases/download/setup-diceVTT-linux/installer.sh"
  },

  /* ---------------------------------------------------------------------
     2. IMAGENS
     Caminhos relativos (pasta do site) ou URLs completas — os dois funcionam.
     --------------------------------------------------------------------- */
  imagens: {
    inicio:           "imagens/inicio.png",
    ficha:            "imagens/ficha.png",
    fichaEmJogo:      "imagens/ficha-visualizacao.png",
    mapas:            "imagens/salas-mapas.png",
    sistema:          "imagens/sistema.png"
  },

  /* ---------------------------------------------------------------------
     3. VÍDEOS
     Use só o ID do YouTube (o que vem depois de "watch?v=").
     --------------------------------------------------------------------- */
  videos: {
    demo: "JpGhbKW5Sn8"
  },

  /* ---------------------------------------------------------------------
     4. TUTORIAIS  (alimenta a página tutoriais.html)
     Para adicionar um tutorial novo, copie um bloco e troque os campos.
     "id" é o ID do vídeo no YouTube. Deixe "" para marcar como "em breve".
     --------------------------------------------------------------------- */
  tutoriais: [
    {
      id: "JpGhbKW5Sn8",
      titulo: "Visão geral do DiceVTT",
      duracao: "",
      categoria: "Primeiros passos",
      texto: "Tour pela tela inicial, pelas mesas e pelo básico da interface. Se você nunca abriu o programa, comece por aqui."
    },
    {
      id: "",
      titulo: "Instalando e abrindo pela primeira vez",
      duracao: "",
      categoria: "Primeiros passos",
      texto: "Instalação no Windows e no Linux, a Steam aberta em segundo plano e o que fazer se o programa não conectar."
    },
    {
      id: "",
      titulo: "Criando sua primeira mesa",
      duracao: "",
      categoria: "Mesas e salas",
      texto: "Como criar a sala, escolher o sistema e convidar a party pela conexão P2P da Steam."
    },
    {
      id: "",
      titulo: "Montando um mapa de batalha",
      duracao: "",
      categoria: "Mapas",
      texto: "Arrastar a imagem, alinhar o grid, posicionar tokens e usar régua, pings e névoa de guerra."
    },
    {
      id: "",
      titulo: "Ficha de personagem na prática",
      duracao: "",
      categoria: "Fichas",
      texto: "Preencher a ficha, entender de onde vem cada modificador e rolar perícias e ataques com um clique."
    },
    {
      id: "",
      titulo: "Criando um sistema próprio em JSON",
      duracao: "",
      categoria: "Sistemas",
      texto: "O gerador de fichas, a definição de atributos e fórmulas, e como exportar o sistema para outras mesas."
    }
  ],

  /* ---------------------------------------------------------------------
     5. PÁGINAS / ABAS
     ativo: false  -> o botão continua aparecendo, mas abre um aviso de
                      manutenção em vez de navegar.
     menu:  false  -> não aparece no menu do topo (só em links diretos).
     --------------------------------------------------------------------- */
  paginas: {
    inicio:     { ativo: true,  menu: true,  url: "index.html",     nome: "Início",
                  aviso: "" },

    futuro:     { ativo: true,  menu: true,  url: "futuro.html",    nome: "Futuro",
                  aviso: "" },

    tutoriais:  { ativo: true,  menu: true,  url: "tutoriais.html", nome: "Tutoriais",
                  aviso: "" },

    notas:      { ativo: true,  menu: true,  url: "notas.html",     nome: "Notas",
                  aviso: "" },

    srds:       { ativo: true,  menu: true,  url: "srds.html",      nome: "SRDs",
                  aviso: "" },

    apoie:      { ativo: true,  menu: true,  url: "apoie.html",     nome: "Apoie",
                  aviso: "" },

    parceiros:  { ativo: true,  menu: true,  url: "parceiros.html", nome: "Parceiros",
                  aviso: "" },

    tutorial:   { ativo: true,  menu: false, url: "tutorial.html",  nome: "Guia de instalação",
                  aviso: "" }
  },

  /* ---------------------------------------------------------------------
     6. NOTAS DE ATUALIZAÇÃO
     Coloque um arquivo por versão dentro da pasta "notas/", com o nome
     sendo a versão. Ex.: notas/0.4.5.14.md

     O site tenta ler notas/index.json primeiro (lista completa). Se esse
     arquivo não existir, ele usa a lista "versoes" abaixo.
     --------------------------------------------------------------------- */
  notas: {
    pasta:     "notas/",
    extensao:  ".md",
    manifesto: "notas/index.json",
    versoes: [
      "0.4.5.14"
    ]
  },

  /* ---------------------------------------------------------------------
     7. VERSÃO DO APP
     "version"      = versão do auto-update (muda com frequência)
     "versionSetup" = versão do instalador publicado no GitHub
     --------------------------------------------------------------------- */
  versao: {
    json: "version.json",
    fallback: "1.0.0",
    padraoInstalador: "https://github.com/LeanLopes01/dicevtt.github.io/releases/download/{v}/dicevtt-{v}.exe"
  },

  /* ---------------------------------------------------------------------
     8. PARCEIROS
     Lista vazia = a página mostra o convite para virar parceiro.
     Formato: { nome, tipo, descricao, link, logo }
     tipo: "Servidor" | "Editora" | "Criador" | "Ferramenta"
     --------------------------------------------------------------------- */
  parceiros: [
  { nome: "Nome do servidor", tipo: "Servidor",
    descricao: "Uma frase sobre eles.", link: "https://...", logo: "imagens/parceiro.png" }
  ]
};
