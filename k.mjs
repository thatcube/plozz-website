const list=await (await fetch('http://localhost:9349/json/list')).json();
const page=list.find(t=>t.type==='page'); const ws=new WebSocket(page.webSocketDebuggerUrl);
let id=0; const p=new Map(); const send=(m,q={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:q}));});
await new Promise(r=>ws.onopen=r); ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id);}};
await send('Page.enable');
for (const w of [1440,390]) {
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:900,deviceScaleFactor:1,mobile:w<900});
  await send('Page.navigate',{url:'http://localhost:4322/'}); await new Promise(r=>setTimeout(r,1800));
  const r=await send('Runtime.evaluate',{expression:`(()=>{
    const out={};
    const add=(k,sel)=>{const e=document.querySelector(sel); if(e) out[k]=Math.round(e.getBoundingClientRect().left);};
    add('hero h1','.hero h1');
    add('sources h2','.sources-intro h2');
    add('formats h2','.plays-head h2');
    add('PANEL merge h2','.merge-copy h2');
    add('PANEL nopay h2','.nopay-copy h2');
    add('PANEL donate h2','.donate-copy h2');
    add('PANEL icloud h2','.icloud-body h2');
    add('closer h2','.closer h2');
    return JSON.stringify(out,null,1);
  })()`,returnByValue:true});
  console.log('── '+w+'px'); console.log(r.result.value);
}
ws.close();
