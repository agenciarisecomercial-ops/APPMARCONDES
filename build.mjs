import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/assets',{recursive:true});
for(const f of ['index.html','styles.css','app.js','acai-3d.js','firebase-config.js','firebase-store.js','firebase-data.js'])await copyFile(f,`dist/${f}`);
for(const f of ['logo.png','cup.png','rise.jpeg'])await copyFile(`assets/${f}`,`dist/assets/${f}`);
await cp('vendor','dist/vendor',{recursive:true});
console.log('Build 3D concluído: dist/');
