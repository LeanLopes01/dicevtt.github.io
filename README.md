🎲 DiceVTT

Um Virtual Tabletop (VTT) leve, modular e altamente customizável construído em Unity (C#). Projetado para oferecer flexibilidade na criação de sistemas de RPG de mesa, o DiceVTT permite que mestres e jogadores importem suas próprias regras via XML e desfrutem de atualizações automáticas e relatórios de bugs integrados.

Atualmente em fase avançada de desenvolvimento, com suporte robusto para fichas de D&D quase concluído.
✨ Funcionalidades Principais

    Forja de Sistemas (Motor XML Dinâmico): Não fique preso a um único sistema de RPG. O DiceVTT possui um interpretador nativo que lê arquivos .xml locais contendo classes, antecedentes, feitiços e regras, formatando-os automaticamente em uma interface enciclopédica e rica dentro do jogo.

    Fichas de Personagem Integradas: Suporte nativo e gerenciamento de atributos, com módulos dedicados para D&D e capacidade de expansão para outros sistemas.

    Atualizador Automático (Auto-Updater): Esqueça a necessidade de baixar novos instaladores. O cliente se comunica com o GitHub Pages e baixa pacotes de atualização via GitHub Releases, extraindo e aplicando patches de forma silenciosa e autônoma.

    Integração de Relatório de Logs em Nuvem: Sistema embutido para captura de falhas e exceções do Unity. Os logs do usuário são empacotados e enviados de forma segura para um repositório no Google Drive via Webhook (Google Apps Script), agilizando a correção de bugs.

🛠️ Tecnologias e Arquitetura

    Motor Gráfico: Unity

    Linguagem: C# (.NET / IL2CPP)

    Estrutura de Dados: XML (Regras e Sistemas) e JSON (Configurações e Versionamento)

    Distribuição e Hospedagem: GitHub Pages (Check de Versão) e GitHub Releases (Hospedagem de Binários)

    Backend de Logs: Google Apps Script / Google Drive API

🚀 Como Instalar e Jogar

    Acesse a aba Releases deste repositório.

    Baixe a versão mais recente do arquivo Setup_DiceVTT.exe.

    Execute o instalador e siga o assistente (Wizard) para escolher a pasta de instalação.

    Abra o atalho na sua Área de Trabalho.

Nota sobre Atualizações: Após a primeira instalação, você não precisará baixar o instalador novamente. O próprio jogo avisará quando houver uma atualização, baixará o .zip automaticamente e fará a substituição dos arquivos em poucos segundos!
📂 Estrutura de Arquivos de Regras (XML)

O motor do DiceVTT permite que você crie seus próprios suplementos. Os arquivos de regras devem ser alocados na pasta local do usuário gerada pelo sistema (geralmente em AppData/LocalLow/SeuNome/DiceVTT/Sistemas).

Para criar um novo elemento (como um Antecedente ou Classe), siga a estrutura de nós básica:
XML

<?xml version="1.0" encoding="utf-8"?>
<background id="id-do-background">
  <name>Nome Exibido</name>
  <summary>Breve descrição em itálico que aparecerá abaixo do título.</summary>
  
  <metadata>
    <skill-proficiencies>
      <skill>Perception</skill>
    </skill-proficiencies>
  </metadata>
  
  <feature id="nome-da-habilidade">
    <name>Nome da Habilidade</name>
    <description>Texto descritivo da habilidade especial.</description>
  </feature>
</background>

O sistema de UI interpretará as tags dinamicamente (transformando <skill> em bullet points e <metadata> em títulos de categoria).
🐛 Relatando Bugs e Logs

Para facilitar o desenvolvimento e encontrar problemas específicos na máquina de cada jogador, o DiceVTT conta com um exportador de logs:

    Falhas Críticas: Se o motor do jogo detectar um Exception fatal, o relatório será enviado automaticamente para análise.

    Envio Manual: Você pode enviar um feedback ou relatar um bug visual utilizando o botão de "Reportar Bug" dentro do menu de configurações do VTT.

Todos os logs são anônimos e contêm apenas o rastreamento do erro (Stack Trace), sua versão atual e sistema operacional.
👨‍💻 Desenvolvedor

Desenvolvido para simplificar a organização de campanhas de RPG e testar limites arquiteturais de distribuição e customização de dados locais.

Se quiser contribuir com pacotes de XML traduzidos ou relatar ideias de funcionalidades, sinta-se à vontade para abrir uma Issue neste repositório.
