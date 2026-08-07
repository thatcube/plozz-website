const list=await (await fetch('http://localhost:9346/json/list')).json();
const page=list.find(t=>t.type==='page'); const ws=new WebSocket(page.webSocketDebuggerUrl);
let id=0; const p=new Map(); const send=(m,q={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:q}));});
await new Promise(r=>ws.onopen=r); ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id);}};
await send('Page.enable');
let bad=0;
for (const path of ['/','/features','/jellyfin','/plex','/emby','/network-shares','/privacy'])
 for (const w of [1440,900,390]) {
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:900,deviceScaleFactor:1,mobile:w<900});
  await send('Page.navigate',{url:'http://localhost:4322'+path});
  await new Promise(r=>setTimeout(r,1200));
  const r=await send('Runtime.evaluate',{expression:`(()=>{
    const e=new Set();
    document.querySelectorAll('.panel,.fact-body.is-panel,.showcase-body.is-panel,.hero-summary,.tv-frame,.site-header .site-brand,.page-hero h1,.closer h2,.sources-intro h2,.plays-head h2,.format-marquee,.nopay-body,.donate-body,.site-footer .footer-brand,.hero h1,.fact-body:not(.is-panel) .fact-intro h2,.showcase-body:not(.is-panel):not(.is-flipped) .showcase-copy h2').forEach(x=>e.add(Math.round(x.getBoundingClientRect().left)));
    const c=document.querySelectorAll('.closer').length;
    const btns=document.querySelectorAll('.closer-cta a').length;
    return JSON.stringify({d:document.documentElement.scrollWidth,e:[...e],closers:c,btns});
  })()`,returnByValue:true});
  const v=JSON.parse(r.result.value);
  const expect = path==='/privacy' ? 0 : 1;
  if (v.d>w || v.e.length>1 || v.closers!==expect || (expect && v.btns!==2)) { console.log('ISSUE',path,w,v); bad++; }
 }
console.log(bad===0?'ALL OK: one closer per page, two buttons, aligned, no overflow':bad+' issues');
ws.close();
