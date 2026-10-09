# Marcondes Açaí — primeira versão

HTML, CSS e JavaScript, com renderização 3D real via Three.js/WebGL. O pote é modelado com paredes interna/externa, borda e fundo. A logo original enviada pelo usuário é aplicada à textura da embalagem roxa e verde.

O açaí é uma malha tridimensional com seção estriada, pequenas irregularidades, iluminação de estúdio, reflexos e sombras. Um fluxo contínuo chega ao pote e alimenta a extremidade da espiral, cujo volume é revelado ao longo do percurso. A rolagem controla o avanço com suavização e permite voltar o preparo.

Esta versão usa uma animação geométrica de extrusão em tempo real; não é vídeo pré-renderizado nem simulação física completa de fluido. Essa escolha mantém a interação reversível, a resolução adaptável e dispensa baixar uma sequência grande de quadros. O resultado tem aparência de renderização 3D e não é apresentado como filmagem.

## Usar e publicar

- Prévia: `npm run dev`, abrir http://127.0.0.1:4186.
- Build: `npm run build`. Os arquivos publicáveis ficam em `dist/`.
- GitHub: coloque o conteúdo desta pasta em um repositório próprio.
- Vercel: importe esse repositório. O arquivo `vercel.json` define o build e a pasta de saída.
- Nenhuma instalação npm é necessária. Three.js 0.180.0 está incluído em `vendor/`, com sua licença MIT. As fontes usam Google Fonts, com fontes locais alternativas caso não haja conexão.

## Recursos

- Lista de datas comemorativas do ano, filtros, cadastro e edição de eventos e lembretes. Halloween riscado e marcado como não realizar.
- Ideias com texto, link de referência e status.
- Relatórios por período com investimento, alcance, impressões, visualizações, cliques, aquisições e seguidores. CPC e CPA calculados; denominador zero ou ausente aparece como travessão.
- Preferência de movimento reduzido respeitada. Nessa situação, aparece a montagem pronta e o botão “Ativar animação” permite experimentar o efeito.

## Armazenamento e limites desta versão

A integração Firebase está configurada para o projeto `rise-painel`. A sessão é anônima e automática: quem tiver acesso ao app pode ler e editar os dados compartilhados. Não há formulário de e-mail/senha. Datas, ideias e relatórios são sincronizados pelo Firestore, com proteção contra sobrescrita de edições concorrentes.

A ativação do provedor Anônimo e a publicação das regras dependem do console Firebase. Consulte `FIREBASE-SETUP.md`. O projeto pode atender outros apps: preservar as regras existentes ao liberar apenas `workspaces/marcondes`.

Dados locais anteriores só são importados por ação explícita. Lembretes aparecem dentro do painel; não enviam push, e-mail ou WhatsApp. Relatórios continuam manuais, sem integração com a Meta. GitHub/Vercel ainda não publicados nesta entrega.

## Datas e imagens

As datas móveis são calculadas a cada novo conjunto anual (Páscoa, Carnaval, Dia das Mães, Dia dos Pais e Black Friday). Conferência de 2026: Carnaval 17/02 e Páscoa 05/04, segundo https://www.gov.br/iec/pt-br/assuntos/pesquisa/comite-de-etica-de-pesquisa-em-humanos-1/calendario-cep-2026.pdf . Trata-se de planejamento comercial, não de classificação legal de feriados.

Logo: arquivo original enviado pelo usuário, aplicado ao pote sem redesenhar a marca. O modelo e a animação são implementados em `acai-3d.js`. A antiga imagem do pote é mantida somente como alternativa estática em dispositivos sem WebGL ou enquanto a cena carrega. As antigas imagens de porção/fluxo não são usadas na animação 3D.

A cena limita a resolução de renderização e só desenha novos quadros quando a rolagem ou o tamanho mudam (incluindo a breve suavização). A preferência de movimento reduzido mostra o produto final e oferece ativação explícita da animação.

## Verificação

Conferido no navegador: abertura vazia, estágio intermediário e montagem final; layout estreito e desktop; cadastro de evento com alerta de hoje; ideia com texto/link; relatório com R$100 de investimento, 50 cliques e 5 aquisições (CPC R$2 e CPA R$20); navegação WebMCP válida e recusa de área inválida. Os dados usados na verificação não fazem parte da entrega.

Atualização 3D: verificadas a cena vazia, a deposição durante a rolagem, a porção final, o retorno ao pote vazio e a identidade visual em visualizações de celular e desktop.

Refinamento 09/10/2026: preenchimento dimensionado ao cone interno para eliminar o anel que atravessava a parede; entrada da espiral contínua a partir do centro; órbita decorativa removida; reflexos úmidos e microtextura do açaí, verniz acetinado do pote, iluminação de estúdio e sombra de contato. Verificação geométrica de 200 etapas de preenchimento com folga positiva, inspeção no navegador e sem erros de console.

## Entrega para publicação

Consulte PUBLICAR.md. A identidade inclui Marcondes × Rise no topo e indicadores ilustrativos que sobem atrás do pote. Integração Firebase verificada na prévia: sessão anônima, importação de 18 datas e leitura após recarregar. As regras efetivas do projeto não foram auditadas.
