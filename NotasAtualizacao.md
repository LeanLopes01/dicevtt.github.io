## Sala — Novo painel "Conteúdo" (hub central de importação)

* Barra de ferramentas reformulada: um único botão **Conteúdo** abre um painel com 4 sub-abas — **Mapa**, **Token**, **Cena de Campanha** e **Ficha** — cada uma com uma lista dos itens já existentes e opções para importar ou criar novos.
* Removidos os botões de "+" antigos que ficavam soltos nas galerias de Cena e Token.
* **Cena de Campanha** é nova: agrega cenas de **todas** as campanhas salvas na máquina (antes só era possível ver uma campanha por vez, e apenas de dentro da tela de Campanhas). Clicar no item já importa a cena para a sala atual na hora.
* A aba **Ficha** substitui o antigo menu de importação. Ela lista as fichas locais do jogador filtradas pelo sistema de RPG configurado na sala. Isso corrige uma limitação antiga onde o menu só conseguia mostrar fichas de D&D, ignorando outros sistemas.

## Sistema de Propriedade e Visibilidade de Fichas

* Clicar com o botão direito em uma ficha (seja na aba principal ou na nova galeria "Fichas Importadas") abre um menu com os jogadores da sala, permitindo atribuir a posse daquela ficha a alguém.
* Depois de atribuída, **só o Mestre e o jogador designado** conseguem ver a ficha na lista, e apenas esse jogador consegue mover o token correspondente no mapa.
* As atribuições são sincronizadas em tempo real para todos da sala e salvas automaticamente — elas são mantidas mesmo que os jogadores se desconectem e voltem depois.
* Nova galeria dedicada **Fichas Importadas** na barra de ferramentas, com cartões visuais (imagem, nome, nível/raça/classe) que também permitem usar o menu de atribuição de dono.

## Sistema de Efeitos Climáticos (Chuva e Neve)

* Novo sistema completo de controle de clima para os mapas.
* Painel com controles deslizantes para ajustar o tamanho da chuva ou neve, ângulo do vento, quantidade de partículas e velocidade de queda, mostrando sempre o valor exato de cada ajuste.
* O clima é decidido apenas pelo Mestre e sincronizado em tempo real — todo mundo na sala vê exatamente o mesmo efeito, e o clima escolhido é salvo e mantido ao fechar e abrir a sala.
* Corrigido um erro visual que podia ocorrer ao alterar o clima durante a sessão.

## Inicialização do jogo e Conexão Steam

* O jogo agora espera a checagem de atualização terminar antes de tentar se conectar ao Steam (antes, as duas coisas tentavam rodar ao mesmo tempo, podendo causar conflitos).
* Se o Steam não for encontrado rodando no computador, o jogo não fecha mais sozinho. Ele exibe um aviso na tela e permite que você continue usando o VTT offline.

## Nova Barra de Ferramentas — em andamento

* Nova interface para a barra de ferramentas principal, agora com botões de acesso rápido para Chat, Ferramenta, Dado, Régua, Pincel, Texto, Fog e Efeitos.
* O Chat e os Efeitos já estão funcionando e abrem suas respectivas janelas. Os demais botões (Ferramenta, Dado, Régua, Pincel, Texto e Fog) já aparecem na tela, mas ainda não realizam ações nesta versão.

## Fichas e Salas — ajustes gerais

* Tela "Criar/Carregar Ficha": Adicionado um filtro visual por sistema e um campo de busca para facilitar a localização de personagens.
* Tela de Salas: A interface foi limpa, removendo a listagem antiga redundante e reorganizando os cabeçalhos.
* Sistemas Personalizados: Redesenho completo da área de criação. A estrutura agora é dividida em três etapas organizadas (Tópicos, Entradas e Estrutura) e o programa consegue detectar os campos da ficha automaticamente ao importar arquivos.
* Corrigido um problema ao enviar cenas de uma Campanha para a Sala: os tokens de NPC agora aparecem corretamente no mapa. Antes, eles podiam desaparecer caso a sala de destino já possuísse outros tokens carregados.

## Campanhas

* Adicionada a importação de NPCs a partir de arquivos externos. É possível importar um arquivo por NPC ou um arquivo único contendo uma lista com vários NPCs de uma vez.
* Novo formulário completo para a criação de campanhas, permitindo definir nome, sistema de regras, imagem de capa e descrição.

## Performance e Melhorias Gerais

* Corrigido o visual das mensagens de teste de resistência no chat, que estavam aparecendo com a formatação incorreta.
* Melhoria de performance ao processar o histórico do chat e maior velocidade ao calcular rolagens de dados contra múltiplos alvos simultaneamente.
* Adicionado um sistema de diagnóstico interno e anônimo para ajudar na melhoria do programa. Ele nos ajuda a entender a média de hardware dos computadores que rodam o VTT e captura automaticamente a causa de travamentos para correções mais rápidas.
* Corrigido um travamento crítico que podia fechar o programa inesperadamente durante o uso geral.