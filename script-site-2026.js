(function(){
  const toast=document.getElementById('copyToast');
  const showToast=()=>{if(!toast)return;toast.classList.add('show');clearTimeout(window.__idfpToast);window.__idfpToast=setTimeout(()=>toast.classList.remove('show'),1700)};
  document.querySelectorAll('[data-copy-url]').forEach(btn=>btn.addEventListener('click',async()=>{
    const path=btn.getAttribute('data-copy-url');
    const url=new URL(path,window.location.href).href;
    try{await navigator.clipboard.writeText(url)}catch(e){const t=document.createElement('textarea');t.value=url;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}
    showToast();
  }));
  const track=document.querySelector('.news-track');
  const cards=track?[...track.querySelectorAll('.news-card')]:[];
  const next=document.querySelector('[data-next]'); const prev=document.querySelector('[data-prev]');
  const progress=document.querySelector('.progress i'); const counter=document.querySelector('.counter');
  let index=0,timer=null,startX=0,dragging=false;
  const go=(i,manual=true)=>{if(!track||cards.length<2)return;index=(i+cards.length)%cards.length;track.style.transform=`translateX(${index*100}%)`;if(progress)progress.style.width=`${((index+1)/cards.length)*100}%`;if(counter)counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;if(manual)restart()};
  const restart=()=>{clearInterval(timer);timer=setInterval(()=>go(index+1,false),5180)};
  next?.addEventListener('click',()=>go(index+1));prev?.addEventListener('click',()=>go(index-1));
  track?.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;dragging=true;clearInterval(timer)},{passive:true});
  track?.addEventListener('touchend',e=>{if(!dragging)return;const dx=e.changedTouches[0].clientX-startX;dragging=false;if(Math.abs(dx)>45)go(index+(dx>0?-1:1));else restart()},{passive:true});
  if(track&&cards.length){track.style.transform='translateX(0%)';if(progress)progress.style.width=`${100/cards.length}%`;if(counter)counter.textContent=`01 / ${String(cards.length).padStart(2,'0')}`;restart();}
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12}):null;
  document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));
})();
