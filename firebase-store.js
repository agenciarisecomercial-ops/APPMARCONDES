import {firebaseConfig,workspaceId} from './firebase-config.js';
import {areas,normalizeRecord} from './firebase-data.js';
export async function connectFirebase(onStatus,onData){
 if(!Object.values(firebaseConfig).some(Boolean))return null;
 if(!['apiKey','authDomain','projectId','appId'].every(k=>firebaseConfig[k]))throw Error('A configuração do Firebase está incompleta.');
 if(!/^[a-zA-Z0-9_-]+$/.test(workspaceId))throw Error('Espaço de trabalho inválido.');
 onStatus({phase:'loading'});
 const [appSDK,authSDK,dbSDK]=await Promise.all([
  import('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),
  import('https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js'),
  import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js')
 ]);
 const app=appSDK.initializeApp(firebaseConfig),auth=authSDK.getAuth(app),db=dbSDK.getFirestore(app);
 await authSDK.setPersistence(auth,authSDK.browserSessionPersistence);
 let stops=[],generation=0,ready=false;
 const path=(area,id)=>dbSDK.doc(db,'workspaces',workspaceId,area,id);
 const stop=()=>{stops.forEach(fn=>fn());stops=[];ready=false};
 authSDK.onAuthStateChanged(auth,async user=>{
  const version=++generation;stop();onData({dates:[],ideas:[],reports:[]});
  if(!user){onStatus({phase:'loading'});try{await authSDK.signInAnonymously(auth)}catch(error){if(version===generation)onStatus({phase:'error',message:message(error)})}return}
  onStatus({phase:'loading',email:null});
  try{
   if(version!==generation)return;
   const data={dates:[],ideas:[],reports:[]},loaded=new Set();
   for(const area of areas){stops.push(dbSDK.onSnapshot(dbSDK.collection(db,'workspaces',workspaceId,area),{includeMetadataChanges:true},snap=>{
    if(version!==generation)return;
    // Only show confirmed cloud state, never claim queued local writes succeeded.
    if(snap.metadata.hasPendingWrites||snap.metadata.fromCache)return;
    data[area]=snap.docs.map(d=>({...d.data(),id:d.id}));loaded.add(area);
    if(loaded.size===3){ready=true;onData(structuredClone(data));onStatus({phase:'ready',email:null})}
   },error=>{if(version===generation){stop();onData({dates:[],ideas:[],reports:[]});onStatus({phase:'error',email:null,message:message(error)})}}));}
  }catch(error){if(version===generation)onStatus({phase:'error',email:null,message:message(error)})}
 });
 function assertReady(){if(!ready||!auth.currentUser)throw Error('Aguarde a conexão antes de alterar dados.');if(!navigator.onLine)throw Error('Sem internet. Conecte-se para salvar.');}
 return {
  async put(area,input,expectedRevision=0){assertReady();const data=normalizeRecord(area,input);await dbSDK.runTransaction(db,async tx=>{const ref=path(area,data.id),snap=await tx.get(ref),revision=snap.exists()?snap.data().rev:0;if(revision!==expectedRevision)throw Error('Este registro foi alterado por outra pessoa. Feche e abra novamente para atualizar.');tx.set(ref,{...data,rev:revision+1});});},
  async remove(area,item){assertReady();if(!areas.includes(area))throw Error('Área inválida.');await dbSDK.runTransaction(db,async tx=>{const ref=path(area,item.id),snap=await tx.get(ref);if(!snap.exists())return;if(snap.data().rev!==item.rev)throw Error('O registro mudou. Confira a versão atual antes de excluir.');tx.delete(ref);});},
  async importLocal(local){assertReady();let added=0,skipped=0;for(const area of areas)for(const item of local[area]||[]){const data=normalizeRecord(area,item);const imported=await dbSDK.runTransaction(db,async tx=>{const ref=path(area,data.id),snap=await tx.get(ref);if(snap.exists())return false;tx.set(ref,{...data,rev:1});return true});if(imported)added++;else skipped++;}return {added,skipped};}
 };
}
function message(e){if(e.code==='permission-denied')return 'Publique as regras do Firestore para liberar o espaço Marcondes.';if(['auth/invalid-credential','auth/wrong-password','auth/user-not-found'].includes(e.code))return 'E-mail ou senha incorretos.';if(e.code==='auth/too-many-requests')return 'Muitas tentativas. Aguarde um pouco e tente novamente.';if(['auth/operation-not-allowed','auth/admin-restricted-operation','auth/configuration-not-found'].includes(e.code))return 'Ative o provedor Anônimo em Firebase → Authentication → Método de login.';if(e.code==='auth/network-request-failed')return 'Não foi possível abrir a sessão anônima. Verifique a conexão e tente novamente.';if(e.code==='unavailable')return 'O Firestore está indisponível. Confira se o banco padrão foi criado no projeto rise-painel e tente novamente.';return 'Não foi possível conectar ao Firebase. Confira a configuração do projeto.';}
