(function(){
  const toast=document.getElementById('copyToast');
  function show(){if(!toast)return;toast.classList.add('show');clearTimeout(window.__idfpToast);window.__idfpToast=setTimeout(()=>toast.classList.remove('show'),1700)}
  document.querySelectorAll('[data-copy-url]').forEach(btn=>btn.addEventListener('click',async()=>{
    const path=btn.getAttribute('data-copy-url');
    const url=new URL(path,window.location.origin).href;
    try{await navigator.clipboard.writeText(url)}catch(e){const t=document.createElement('textarea');t.value=url;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}
    show();
  }));
})();
