# Firebase do Marcondes

O app usa a configuração Web fornecida do projeto `rise-painel`, com dados em `workspaces/marcondes`. Não usa Analytics. Acesso sem formulário: Firebase Authentication cria uma sessão anônima automaticamente. Todos os visitantes podem ler, criar, editar e excluir registros compartilhados. O link não é uma senha e pode ser repassado; não cadastrar informações confidenciais.

## Ativação no console

1. Em Authentication → Método de login, habilitar **Anônimo**.
2. Criar o banco **Cloud Firestore** padrão, se ainda não existir.
3. Em Firestore → Regras, adicionar as funções e o bloco `match /workspaces/marcondes/{area}/{id}` de `firestore.rules` às regras existentes. Se o projeto só atende este app, pode publicar o arquivo completo. **Se atende outros apps, preservar as regras deles e verificar regras amplas já existentes:** permissões do Firestore são cumulativas.
4. Reabrir o painel. Ele conecta automaticamente, sem e-mail ou senha. Usar “Trazer dados locais e datas comuns” uma vez para copiar os cadastros deste navegador sem sobrescrever registros existentes na nuvem.

O arquivo de regras restringe os caminhos e formatos de escrita, mas não limita o acesso a uma equipe. A configuração pública não concede acesso administrativo. Alterar configuração ou regras exige acesso ao console do projeto; nunca inserir chave de conta de serviço no site.

Para um projeto exclusivo, com CLI Firebase autenticada e após revisar as regras: `firebase deploy --only firestore:rules --project rise-painel`. Este comando substitui as regras do banco; não usar sem mesclar regras de outros apps.

A publicação do site continua no GitHub/Vercel: `npm run build`, saída `dist`. O build inclui os módulos Firebase e carrega o SDK pelo CDN oficial. O cadastro só confirma sucesso após resposta do servidor; revisões impedem sobrescrever uma edição concorrente. Sem internet, alterações não são confirmadas.

Documentação: https://firebase.google.com/docs/auth/web/anonymous-auth e https://firebase.google.com/docs/firestore/security/get-started
