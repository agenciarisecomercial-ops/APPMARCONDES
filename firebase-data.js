export const areas=['dates','ideas','reports'];
export function normalizeRecord(area, input){
 if(!areas.includes(area))throw Error('Área inválida.');
 const text=(name,max,required=false)=>{const v=String(input[name]??'').trim();if(v.length>max||(required&&!v))throw Error('Confira o campo '+name+'.');return v};
 const date=name=>{const v=text(name,10,true);if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v+'T12:00:00Z'))||new Date(v+'T12:00:00Z').toISOString().slice(0,10)!==v)throw Error('Data inválida.');return v};
 const d={id:text('id',100,true),title:text('title',120,true),note:text('note',5000)};
 if(!/^[a-zA-Z0-9_-]+$/.test(d.id))throw Error('Identificador inválido.');
 if(area==='dates'){d.date=date('date');d.kind=text('kind',20,true);d.alert=Number(input.alert);d.excluded=!!input.excluded;if(!['Evento','Comemorativa'].includes(d.kind)||![-1,0,1,3,7,14,30].includes(d.alert))throw Error('Evento inválido.');}
 if(area==='ideas'){d.status=text('status',20,true);d.link=text('link',2000);if(!['Ideia','Em produção','Publicado'].includes(d.status))throw Error('Status inválido.');if(d.link&&!['https:','http:'].includes(new URL(d.link).protocol))throw Error('Use um link http ou https.');}
 if(area==='reports'){d.start=date('start');d.end=date('end');if(d.end<d.start)throw Error('Período inválido.');for(const k of ['spend','reach','impressions','views','clicks','acquisitions','followers']){const v=input[k];d[k]=v===null||v===''||v===undefined?null:Number(v);if(k==='spend'&&d[k]===null)throw Error('Informe o investimento.');if(d[k]!==null&&(!Number.isFinite(d[k])||d[k]<0||d[k]>1e12||(k!=='spend'&&!Number.isInteger(d[k]))))throw Error('Métrica inválida: '+k);}}
 return d;
}
