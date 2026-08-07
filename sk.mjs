import fs from 'fs';
const list=await (await fetch('http://localhost:9351/json/list')).json();
const page=list.find(t=>t.type==='page'); const ws=new WebSocket(page.webSocketDebuggerUrl);
let id=0; const p=new Map(); const send=(m,q={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:q}));});
await new Promise(r=>ws.onopen=r); ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id);}};
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:2,mobile:false});
await send('Page.navigate',{url:'http://localhost:4322/'}); await new Promise(r=>setTimeout(r,2500));
await send('Runtime.evaluate',{expression:`document.querySelector('.sky-slab').scrollIntoView({block:'center'})`});
await new Promise(r=>setTimeout(r,1200));
const b=JSON.parse((await send('Runtime.evaluate',{expression:`(()=>{const r=document.querySelector('.sky-slab').getBoundingClientRect();return JSON.stringify({y:Math.round(r.top-16),h:Math.round(r.height+32)});})()`,returnByValue:true})).result.value);
for (const [i,wait] of [[0,0],[1,3000],[2,4000],[3,4000]]) {
  if (wait) await new Promise(r=>setTimeout(r,wait));
  const r=await send('Page.captureScreenshot',{format:'png',clip:{x:60,y:b.y,width:1320,height:b.h,scale:1}});
  fs.writeFileSync('/tmp/sky'+i+'.png',Buffer.from(r.data,'base64'));
}
const st=await send('Runtime.evaluate',{expression:`(()=>{const t=document.querySelector('[data-sky-time]'),l=document.querySelector('[data-sky-level]');return JSON.stringify({time:t.textContent,level:l.textContent});})()`,returnByValue:true});
console.log('readout:',st.result.value); console.log('saved 4 frames'); ws.close();
