const list=await (await fetch('http://localhost:9345/json/list')).json();
const page=list.find(t=>t.type==='page'); const ws=new WebSocket(page.webSocketDebuggerUrl);
let id=0; const p=new Map(); const send=(m,q={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:q}));});
await new Promise(r=>ws.onopen=r); ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id);}};
await send('Page.enable'); await send('CSS.enable'); await send('DOM.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://localhost:4322/'});
await new Promise(r=>setTimeout(r,2500));
const doc=await send('DOM.getDocument',{depth:-1});
const lum=(c)=>{const [r,g,b]=c.match(/\d+/g).slice(0,3).map(Number).map(v=>{v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}); return 0.2126*r+0.7152*g+0.0722*b;};
const ratio=(a,b)=>{const l1=lum(a),l2=lum(b); return ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2);};
for (const sel of ['.donate-amounts a:not(.donate-go)','.donate-go']) {
  const n=await send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:sel});
  await send('CSS.forcePseudoState',{nodeId:n.nodeId,forcedPseudoClasses:['hover']});
  await new Promise(r=>setTimeout(r,400));
  const r=await send('Runtime.evaluate',{expression:`(()=>{const e=document.querySelector('${sel}');const s=getComputedStyle(e);return JSON.stringify({color:s.color,bg:s.backgroundColor});})()`,returnByValue:true});
  const v=JSON.parse(r.result.value);
  console.log(sel.padEnd(32), 'hover text', v.color, 'on', v.bg, '=> contrast', ratio(v.color,v.bg));
  await send('CSS.forcePseudoState',{nodeId:n.nodeId,forcedPseudoClasses:[]});
}
ws.close();
