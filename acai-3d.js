import * as THREE from './vendor/three.module.js';

// A deterministic extrusion model: scroll reveals deposited geometry while
// a separate, connected strand feeds its endpoint. No image masks or scaling.
export async function createAcaiScene(host){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
 renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.10;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.domElement.setAttribute('role','img');
 renderer.domElement.setAttribute('aria-label','Animação 3D: açaí sendo servido em espiral no pote com a logo Marcondes');
 renderer.domElement.className='acai-canvas';
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(35,1,.1,50);
 camera.position.set(0,2.5,8.2);camera.lookAt(0,.10,0);
 const group=new THREE.Group();scene.add(group);

 // Broad luminous panels produce curved reflections on the actual mesh.
 const studio=new THREE.Scene();studio.background=new THREE.Color('#342b38');
 function panel(x,y,z,w,h,intensity){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(intensity,intensity,intensity),side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);studio.add(m)}
 panel(-4,5,4,3,5,7);panel(4,2,3,1.2,5,4);panel(0,4,-4,5,3,5);
 const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(studio,.025);scene.environment=env.texture;pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xfff6e9,0x694055,1.25));
 scene.add(new THREE.AmbientLight(0xefdce6,.35));
 const key=new THREE.DirectionalLight(0xfff1df,2.8);key.position.set(-3,5,5);key.castShadow=true;
 key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=5;key.shadow.camera.bottom=-3;key.shadow.normalBias=.02;key.shadow.bias=-.0001;key.shadow.radius=3;scene.add(key);
 const rimLight=new THREE.DirectionalLight(0xebd5ff,1.7);rimLight.position.set(3,3,-4);scene.add(rimLight);
 const fillLight=new THREE.DirectionalLight(0xffffff,.65);fillLight.position.set(2,1,5);scene.add(fillLight);

 const logo=await new THREE.TextureLoader().loadAsync('assets/logo.png');
 const label=document.createElement('canvas');label.width=2048;label.height=1024;
 const ctx=label.getContext('2d');ctx.fillStyle='#510d60';ctx.fillRect(0,0,2048,1024);
 // Printed green wave, with the original supplied logo kept intact.
 ctx.fillStyle='#b4db82';ctx.beginPath();ctx.moveTo(0,1024);
 for(let x=0;x<=2048;x+=4)ctx.lineTo(x,818+36*Math.sin(x*.011)+16*Math.sin(x*.029));
 ctx.lineTo(2048,1024);ctx.closePath();ctx.fill();
 const im=logo.image;
 ctx.drawImage(im,im.width*.12,im.height*.155,im.width*.71,im.height*.525,869,220,310,500);
 const map=new THREE.CanvasTexture(label);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const paper=new THREE.MeshPhysicalMaterial({map,roughness:.43,metalness:0,clearcoat:.24,clearcoatRoughness:.38,envMapIntensity:.42});
 const white=new THREE.MeshStandardMaterial({color:0xf5eee1,roughness:.67,side:THREE.BackSide});
 const outer=new THREE.Mesh(new THREE.CylinderGeometry(1.04,.80,2.12,128,1,true),paper);outer.position.y=-.86;outer.rotation.y=Math.PI;outer.castShadow=true;outer.receiveShadow=true;group.add(outer);
 const inner=new THREE.Mesh(new THREE.CylinderGeometry(1.015,.78,2.09,128,1,true),white);inner.position.y=-.85;inner.receiveShadow=true;group.add(inner);
 const cupFloor=new THREE.Mesh(new THREE.CircleGeometry(.79,96),new THREE.MeshStandardMaterial({color:0xe4d5bd,roughness:.9}));cupFloor.rotation.x=-Math.PI/2;cupFloor.position.y=-1.9;cupFloor.receiveShadow=true;group.add(cupFloor);
 for(const [r,y,tube] of [[1.035,.20,.035],[.80,-1.91,.024]]){const lip=new THREE.Mesh(new THREE.TorusGeometry(r,tube,16,128),new THREE.MeshStandardMaterial({color:0xfff9ee,roughness:.4}));lip.rotation.x=Math.PI/2;lip.position.y=y;lip.castShadow=true;lip.receiveShadow=true;group.add(lip);}

 const cream=new THREE.MeshPhysicalMaterial({color:0x350b23,specularIntensity:.64,roughness:.31,metalness:0,clearcoat:.27,clearcoatRoughness:.24,ior:1.40,envMapIntensity:.48});
 // A repeatable micro-surface texture adds grain without expensive per-pixel
 // procedural noise, so the animation remains responsive on mobile GPUs.
 const grains=new Uint8Array(128*128*4);let seed=72813;
 for(let i=0;i<grains.length;i+=4){seed=(1664525*seed+1013904223)>>>0;const n=100+(seed>>>25);grains[i]=grains[i+1]=grains[i+2]=n;grains[i+3]=255;}
 const micro=new THREE.DataTexture(grains,128,128,THREE.RGBAFormat);micro.wrapS=micro.wrapT=THREE.RepeatWrapping;micro.repeat.set(18,3);micro.magFilter=THREE.LinearFilter;micro.minFilter=THREE.LinearMipmapLinearFilter;micro.generateMipmaps=true;micro.needsUpdate=true;cream.bumpMap=micro;cream.bumpScale=.022;const paperGrain=micro.clone();paperGrain.repeat.set(8,5);paper.bumpMap=paperGrain;paper.bumpScale=.004;
 const bulk=new THREE.Mesh(new THREE.CylinderGeometry(.97,.78,1.95,96),cream);bulk.castShadow=true;bulk.receiveShadow=true;group.add(bulk);

 const turns=3.65,segments=1000,sides=24;
 function coilPoint(t){const a=t*turns*Math.PI*2+.65;const enter=Math.min(1,t/.045);const r=.76*Math.pow(1-t,.78)*(1+.022*Math.sin(t*63))*enter*enter*(3-2*enter);return new THREE.Vector3(r*Math.cos(a),.18+1.13*t+.012*Math.sin(t*49),r*Math.sin(a));}
 function strandRadius(t){return .245*(1-.40*t)*(1+.024*Math.sin(t*83))*Math.pow(Math.max(.001,Math.min(1,(1-t)/.07)),.65)}
 // Parametric helical extrusion with a ridged soft-serve cross-section.
 const pos=[],uv=[],idx=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,c=coilPoint(t),next=coilPoint(Math.min(1,t+.0002)),prev=coilPoint(Math.max(0,t-.0002));
  const tangent=next.sub(prev).normalize(),normal=new THREE.Vector3(c.x,0,c.z).normalize();if(normal.lengthSq()<.01)normal.set(1,0,0);
  const binormal=new THREE.Vector3().crossVectors(tangent,normal).normalize();normal.crossVectors(binormal,tangent).normalize();
  for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2;const r=strandRadius(t)*(1+.115*Math.cos(a*8+.3+t*9));const v=c.clone().addScaledVector(normal,Math.cos(a)*r).addScaledVector(binormal,Math.sin(a)*r*.94);pos.push(v.x,v.y,v.z);uv.push(t,j/sides);if(i<segments&&j<sides){const n=i*(sides+1)+j;idx.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1);}}
 }
 const coilGeo=new THREE.BufferGeometry();coilGeo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));coilGeo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));coilGeo.setIndex(idx);coilGeo.computeVertexNormals();
 const coil=new THREE.Mesh(coilGeo,cream);coil.castShadow=true;coil.receiveShadow=true;group.add(coil);
 const join=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),cream);join.castShadow=true;group.add(join);
 let strand=new THREE.Mesh(new THREE.BufferGeometry(),cream);strand.castShadow=true;strand.receiveShadow=true;group.add(strand);
 // A soft studio contact shadow grounds the cup without a decorative orbit.
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;
 const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,64,9,64,64,63);
 gradient.addColorStop(0,'rgba(9,0,16,.52)');gradient.addColorStop(.45,'rgba(9,0,16,.26)');gradient.addColorStop(1,'rgba(9,0,16,0)');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);
 const contactTexture=new THREE.CanvasTexture(shadowCanvas);
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(3.3,3.3),new THREE.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.y=-1.94;scene.add(contact);
 // A contact shadow anchors the cup while keeping the existing page backdrop.
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.045}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.95;floor.receiveShadow=true;scene.add(floor);
 let target=0,current=0,raf=0,lastTime=0,disposed=false;
 const sat=x=>Math.max(0,Math.min(1,x));
 function update(p){
  const pour=sat((p-.055)/.82),fill=sat(pour/.27),deposit=sat((pour-.27)/.73);
  const level=-1.82+fill*1.98;
  bulk.visible=fill>.001;
  // The surface must follow the tapered INSIDE of the cup: scaling only its
  // height made its wide top intersect the narrow walls, exposing a rising ring.
  const innerRadius=.77+.20*fill;
  bulk.scale.set(innerRadius/.97,Math.max(.001,fill),innerRadius/.97);
  bulk.position.y=-1.82+fill*.975;
  coil.visible=deposit>0;coilGeo.setDrawRange(0,Math.floor(deposit*segments)*sides*6);
  const end=deposit>0?coilPoint(deposit):new THREE.Vector3(0,level,0);
  const flowStart=sat((p-.015)/.04),endPhase=sat((p-.875)/.075);
  const active=p>.015&&p<.95;
  strand.visible=active;join.visible=active&&flowStart>=1&&deposit<.995;
  const rr=deposit>0?strandRadius(deposit):.17;
  join.position.copy(end);join.scale.setScalar(rr*.99);
  if(active){
   const source=new THREE.Vector3(end.x*.70,3.7,end.z*.70);
   const landing=source.clone().lerp(end,flowStart);
   const start=source.clone().lerp(landing,endPhase);
   const middle=start.clone().lerp(landing,.56);middle.x-=.06*Math.sin(deposit*18)*Math.sin(Math.PI*endPhase);
   const tangent=coilPoint(Math.min(1,deposit+.001)).sub(coilPoint(Math.max(0,deposit-.001))).normalize();
   const bend=deposit>0?landing.clone().addScaledVector(tangent,-.20).add(new THREE.Vector3(0,.12,0)):landing.clone().lerp(start,.12);
   const path=new THREE.CatmullRomCurve3([start,middle,bend,landing]);
   const geo=new THREE.TubeGeometry(path,64,Math.max(.025,Math.min(.17,rr)),16,false);
   const a=geo.attributes.position;
   // Eight shallow nozzle grooves, and thinning near the cutoff.
   for(let i=0;i<=64;i++){const center=path.getPointAt(i/64);for(let j=0;j<=16;j++){const k=i*17+j;const v=new THREE.Vector3().fromBufferAttribute(a,k).sub(center);const flute=1+.065*Math.cos(j/16*Math.PI*16);v.multiplyScalar(flute*(1-.4*endPhase)).add(center);a.setXYZ(k,v.x,v.y,v.z);}}
   geo.computeVertexNormals();strand.geometry.dispose();strand.geometry=geo;
  }
  renderer.render(scene,camera);
 }
 function tick(now){raf=0;if(disposed)return;const dt=lastTime?Math.min(100,Math.max(8,now-lastTime)):16;lastTime=now;const difference=target-current;current=Math.abs(difference)<.0005?target:current+difference*(1-Math.exp(-dt/65));update(current);if(current!==target)raf=requestAnimationFrame(tick);else lastTime=0;}
 function setProgress(p,immediate=false){target=sat(p);if(immediate)current=target;if(!raf)raf=requestAnimationFrame(tick);}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(w<1||h<1)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=w/h<.8?9.4:8.2;camera.updateProjectionMatrix();update(current);}
 const observer=new ResizeObserver(resize);observer.observe(host);
 host.append(renderer.domElement);host.classList.add('webgl-ready');resize();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();host.classList.remove('webgl-ready')});
 return {setProgress,dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});env.dispose();contactTexture.dispose();paperGrain.dispose();micro.dispose();map.dispose();logo.dispose();renderer.dispose();renderer.domElement.remove();}};
}
