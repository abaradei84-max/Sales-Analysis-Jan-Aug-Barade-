(async()=>{
  const gunzip=async b64=>{
    const bin=atob((b64||'').replace(/\s/g,''));
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).text();
  };
  const load=src=>new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=fail;document.head.appendChild(s)});
  const fresh=Date.now();
  try{
    if(window.BARADE_B64){
      const text=await gunzip(window.BARADE_B64);
      window.BARADE_DATA=JSON.parse(text);
      await load('app.js?v=3&t='+fresh);
      return;
    }
  }catch(e){console.warn('Detailed data unavailable; using summary fallback.',e)}
  try{
    if(!window.BARADE_SUMMARY_B64)throw new Error('Summary data is missing');
    const text=await gunzip(window.BARADE_SUMMARY_B64);
    window.BARADE_SUMMARY=JSON.parse(text);
    await load('summary_app.js?v=3&t='+fresh);
  }catch(e){
    console.error('Dashboard data load failed',e);
    const box=document.createElement('div');
    box.style.cssText='margin:18px auto;max-width:900px;padding:14px 18px;border:1px solid #ff6b81;border-radius:12px;background:#2a1020;color:#ffd7df;font:14px Arial;position:relative;z-index:10000';
    box.textContent='تعذر تحميل بيانات الداشبورد. يرجى إعادة تحميل الصفحة بعد دقيقة.';
    document.querySelector('.app')?.prepend(box);
  }
})();