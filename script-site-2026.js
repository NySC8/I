(function(){
  const track=document.getElementById('newsTrack');
  if(track){
    const cards=[...track.querySelectorAll('.news-card')];
    const next=document.getElementById('nextNews'),prev=document.getElementById('prevNews');
    const dots=[...document.querySelectorAll('#newsDots button')];
    const fill=document.getElementById('newsTimerFill');
    let index=0, timer=null, start=0, duration=5300;
    function go(i){index=(i+cards.length)%cards.length;cards[index].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});dots.forEach((d,n)=>d.classList.toggle('active',n===index));start=performance.now();}
    function restart(){clearInterval(timer);start=performance.now();timer=setInterval(()=>go(index+1),duration)}
    next?.addEventListener('click',()=>{go(index+1);restart()});prev?.addEventListener('click',()=>{go(index-1);restart()});dots.forEach((d,n)=>d.addEventListener('click',()=>{go(n);restart()}));
    track.addEventListener('scroll',()=>{let best=Infinity,b=0;cards.forEach((c,i)=>{const r=c.getBoundingClientRect(),tr=track.getBoundingClientRect();const d=Math.abs((r.left+r.width/2)-(tr.left+tr.width/2));if(d<best){best=d;b=i}});index=b;dots.forEach((d,n)=>d.classList.toggle('active',n===index));},{passive:true});
    track.addEventListener('pointerdown',()=>clearInterval(timer));track.addEventListener('pointerup',restart);track.addEventListener('pointercancel',restart);
    function animate(t){if(fill){const p=Math.min(1,(t-start)/duration);fill.style.width=(p*100)+'%';}requestAnimationFrame(animate)}
    requestAnimationFrame(animate);restart();
  }
  const menuButton=document.getElementById('newsMenuButton');
  const newsMenu=document.getElementById('newsMenu');
  if(menuButton&&newsMenu){
    menuButton.addEventListener('click',()=>{
      const open=menuButton.getAttribute('aria-expanded')==='true';
      menuButton.setAttribute('aria-expanded',String(!open));
      newsMenu.hidden=open;
      newsMenu.classList.toggle('show',!open);
    });
    document.addEventListener('click',e=>{
      if(!newsMenu.hidden&&!newsMenu.contains(e.target)&&!menuButton.contains(e.target)){
        newsMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');newsMenu.classList.remove('show');
      }
    });
  }
  document.querySelectorAll('[data-copy-url]').forEach(btn=>btn.addEventListener('click',async()=>{let u=btn.getAttribute('data-copy-url');u=new URL(u,location.href).href;try{await navigator.clipboard.writeText(u)}catch(e){const t=document.createElement('textarea');t.value=u;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}const toast=document.getElementById('copyToast');if(toast){toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1500)}}));
})();
