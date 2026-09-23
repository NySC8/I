(function(){
'use strict';
const track=document.getElementById('newsTrack');
const viewport=document.getElementById('newsViewport');
const cards=track?Array.from(track.children):[];
const next=document.getElementById('nextNews'), prev=document.getElementById('prevNews');
const current=document.getElementById('newsCurrent'), bar=document.getElementById('progressBar');
let index=0, timer=null, startX=0, dragging=false;
function render(){if(!track||!cards.length)return;track.style.transform='translateX('+(index*100)+'%)';if(current)current.textContent=String(index+1).padStart(2,'0');if(bar)bar.style.width=((index+1)/cards.length*100)+'%'}
function go(i){index=(i+cards.length)%cards.length;render()}
function restart(){clearInterval(timer);timer=setInterval(()=>go(index+1),5180)}
if(next)next.addEventListener('click',()=>{go(index+1);restart()});
if(prev)prev.addEventListener('click',()=>{go(index-1);restart()});
if(viewport){viewport.addEventListener('pointerdown',e=>{startX=e.clientX;dragging=true;viewport.setPointerCapture?.(e.pointerId)});viewport.addEventListener('pointerup',e=>{if(!dragging)return;const dx=e.clientX-startX;dragging=false;if(Math.abs(dx)>45){go(index+(dx<0?1:-1));restart()}});viewport.addEventListener('pointercancel',()=>dragging=false);viewport.addEventListener('mouseenter',()=>clearInterval(timer));viewport.addEventListener('mouseleave',restart)}
render();restart();
const toast=document.getElementById('copyToast');
function showToast(){if(!toast)return;toast.classList.add('show');clearTimeout(window.__idfpToast);window.__idfpToast=setTimeout(()=>toast.classList.remove('show'),1700)}
document.querySelectorAll('[data-copy-url]').forEach(btn=>btn.addEventListener('click',async()=>{const path=btn.getAttribute('data-copy-url');const url=new URL(path,location.href).href;try{await navigator.clipboard.writeText(url)}catch(e){const t=document.createElement('textarea');t.value=url;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}showToast()}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
})();
