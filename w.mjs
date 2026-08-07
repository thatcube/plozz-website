const list=await (await fetch('http://localhost:9348/json/list')).json();
const page=list.find(t=>t.type==='page'); const ws=new WebSocket(page.webSocketDebuggerUrl);
let id=0; const p=new Map(); const send=(m,q={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:q}));});
await new Promise(r=>ws.onopen=r); ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id);}};
await send('Page.enable');
for (const w of [1200,1100,1000,950,900,860,820,780,740,700,640,600,560]) {
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:900,deviceScaleFactor:1,mobile:w<900});
  await send('Page.navigate',{url:'http://localhost:4322/'});
  await new Promise(r=>setTimeout(r,900));
  const r=await send('Runtime.evaluate',{expression:`(()=>{
    const brand=document.querySelector('.site-brand').getBoundingClientRect();
    const nav=document.querySelector('.site-header nav').getBoundingClientRect();
    const links=[...document.querySelectorAll('.site-header nav > a')].filter(a=>getComputedStyle(a).display!=='none');
    const wrapped=links.some(a=>a.getBoundingClientRect().height>26);
    return JSON.stringify({gap:Math.round(nav.left-brand.right), wrapped, n:links.length});
  })()`,returnByValue:true});
  const v=JSON.parse(r.result.value);
  const bad = v.gap < 24 || v.wrapped;
  console.log(`${String(w).padEnd(5)} gap=${String(v.gap).padStart(4)}px wrapped=${v.wrapped} links=${v.n} ${bad?'<-- BROKEN':''}`);
}
ws.close();
