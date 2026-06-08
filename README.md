# 🎲 DiceVTT

**Seu RPG, suas regras.** Um Virtual Tabletop (VTT) leve, modular e altamente customizável construído em Unity. 

Projetado para oferecer flexibilidade total na criação de sistemas de RPG de mesa, o DiceVTT liberta mestres e jogadores das amarras de sistemas engessados. Importe suas próprias regras, classes e itens via XML, e desfrute de uma experiência fluida com atualizações automáticas e telemetria de erros integrada.

Atualmente em fase avançada de desenvolvimento, com o módulo estrutural de fichas para D&D já atingindo a marca de 90% de conclusão.

---

## ✨ Funcionalidades Principais

* **Forja de Sistemas (Motor XML Dinâmico):** Não fique preso a um único sistema. O DiceVTT possui um interpretador nativo que lê arquivos `.xml` locais. Ele converte classes, antecedentes, magias e regras brutas em uma interface rica e enciclopédica direto no jogo.
* **Fichas de Personagem Modulares:** Suporte nativo e gerenciamento inteligente de atributos. Construído com foco inicial em D&D, mas com arquitetura escalável para se adaptar a qualquer outro sistema de mesa.
* **Atualizador Autônomo (Auto-Updater):** Esqueça o download manual de novos instaladores. O cliente verifica o GitHub Pages, baixa os pacotes mais recentes via GitHub Releases e aplica os patches de forma rápida e silenciosa.
* **Telemetria e Logs em Nuvem:** Sistema embutido para captura de exceções do Unity. Os logs são empacotados e enviados de forma segura para um repositório no Google Drive via Webhook, agilizando a correção de bugs sem incomodar o jogador.

---

## 🛠️ Tecnologias e Arquitetura

| Componente | Tecnologia Utilizada | Propósito |
| :--- | :--- | :--- |
| **Motor Gráfico** | Unity (C# / .NET / IL2CPP) | Renderização, UI e lógica do cliente. |
| **Estrutura de Dados** | XML & JSON | XML para Regras/Sistemas; JSON para Configurações/Versionamento. |
| **Distribuição** | GitHub Pages & Releases | Hospedagem de binários e infraestrutura do Auto-Updater. |
| **Backend de Logs** | Google Apps Script & Drive API | Webhooks para recepção e armazenamento de relatórios de crash. |

---

## 🚀 Como Instalar e Jogar

1. Acesse a aba **Releases** deste repositório.
2. Baixe a versão mais recente do arquivo `Setup_DiceVTT.exe`.
3. Execute o instalador e siga o assistente para escolher o diretório de sua preferência.
4. Abra o atalho gerado na sua Área de Trabalho.

> **Nota sobre Atualizações:** O instalador só é necessário na primeira vez. Sempre que houver uma novidade, o próprio jogo avisará, baixará o pacote `.zip` em segundo plano e fará a substituição dos arquivos em poucos segundos!

---

## 📂 Estrutura de Arquivos de Regras (XML)

O motor do DiceVTT permite a criação de suplementos comunitários ou campanhas *homebrew*. Os arquivos de regras devem ser alocados na pasta local gerada pelo sistema (geralmente em `AppData/LocalLow/Lean/DiceVTT/Sistemas`).

Para criar um novo elemento, como um Antecedente, basta seguir esta estrutura de nós:

```xml
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
```

A interface do sistema interpretará as tags dinamicamente (transformando `<skill>` em *bullet points* visuais e `<metadata>` em títulos de categoria formatados).

---

## 🐛 Relatando Bugs e Logs

Para garantir a estabilidade do VTT em diferentes máquinas, construímos um exportador de logs focado em privacidade e eficiência:

* **Falhas Críticas (Crashes):** Se o motor do jogo detectar uma exceção fatal, o relatório será enviado automaticamente para análise.
* **Envio Manual:** Você pode enviar feedback ou relatar bugs visuais utilizando o botão "Reportar Bug" dentro do menu de configurações.

*Todos os logs são anônimos e contêm apenas o rastreamento do erro (Stack Trace), a versão atual do cliente e o sistema operacional.*

---

## 👨‍💻 Sobre o Projeto

Desenvolvido por Lean Lopes para simplificar a organização de campanhas de RPG e testar os limites arquiteturais de distribuição e customização de dados locais no Unity.

Se você quer contribuir com pacotes de XML traduzidos, relatar ideias de novas funcionalidades ou ajudar no código, sinta-se à vontade para abrir uma **Issue** ou enviar um **Pull Request**. Toda ajuda é bem-vinda!
