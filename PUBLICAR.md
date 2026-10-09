# Publicar Marcondes × Rise

## GitHub
1. Crie um repositório para este aplicativo.
2. Extraia o ZIP e envie todo o conteúdo para a raiz do repositório, mantendo as pastas assets e vendor.
3. Confirme que package.json, index.html e vercel.json aparecem diretamente na raiz. Não envie apenas o ZIP.

## Vercel
1. Importe o repositório do GitHub como um novo projeto.
2. Framework Preset: Other. Root Directory: raiz do repositório.
3. Build Command: npm run build. Output Directory: dist.
4. Publique. Essas opções também estão definidas em vercel.json.

Não é necessário cadastrar variáveis de ambiente nesta versão: a configuração pública Web do Firebase já está em firebase-config.js. Não inserir credenciais administrativas.

## Depois de publicar
Abra o endereço da Vercel e confira a mensagem “Sincronizado na nuvem · acesso por link”. Confira as datas em outro dispositivo. O projeto rise-painel e os dados workspaces/marcondes serão os mesmos da prévia local. Não precisa importar as datas outra vez.

A publicação do site não publica as regras do Firestore. O arquivo firestore.rules é uma proposta de regras; a versão efetiva no console não foi auditada. Não substitua regras de outros apps do projeto. Veja FIREBASE-SETUP.md.

Todos que acessarem o aplicativo podem alterar os cadastros. Os números animados atrás do pote são ilustrativos; os relatórios do painel são preenchidos manualmente.
