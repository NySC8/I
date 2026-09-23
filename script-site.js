
(() => {
  'use strict';

  const toast = document.getElementById('copyToast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1700);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    field.remove();
    return ok;
  }

  function resolveUrl(path) {
    // Relative paths are intentional: they work both on a GitHub Pages
    // project site (/repository/) and on the custom domain.
    return new URL(path, document.baseURI).href;
  }

  document.querySelectorAll('[data-copy-url]').forEach(button => {
    button.addEventListener('click', async () => {
      const path = button.getAttribute('data-copy-url') || './';
      try {
        const ok = await copyText(resolveUrl(path));
        showToast(ok ? 'لینک کپی شد' : 'کپی انجام نشد');
      } catch (_) {
        showToast('کپی انجام نشد');
      }
    });
  });

  const shareButton = document.getElementById('sharePost');
  shareButton?.addEventListener('click', async () => {
    const data = { title: document.title, text: document.title, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch (_) {}
    } else {
      try {
        const ok = await copyText(window.location.href);
        showToast(ok ? 'لینک کپی شد' : 'کپی انجام نشد');
      } catch (_) {
        showToast('کپی انجام نشد');
      }
    }
  });



  // RTL news slider: supports arrows, dots, touch/trackpad scrolling and autoplay.
  const slider = document.querySelector('[data-news-slider]');
  const slides = slider ? Array.from(slider.querySelectorAll('.news-slide')) : [];
  const dots = Array.from(document.querySelectorAll('[data-slide-to]'));
  const prevButton = document.querySelector('[data-slider-prev]');
  const nextButton = document.querySelector('[data-slider-next]');
  const progress = document.querySelector('[data-slider-progress]');
  let activeIndex = 0;
  let autoplay;

  function setActive(index, smooth = true) {
    if (!slider || !slides.length) return;
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    const target = slides[activeIndex];
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest', inline: 'start' });
    dots.forEach((dot, i) => {
      const active = i === activeIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    if (progress) progress.style.transform = `translateX(${activeIndex ? '100%' : '0'})`;
  }

  function next() { setActive((activeIndex + 1) % slides.length); }
  function prev() { setActive((activeIndex - 1 + slides.length) % slides.length); }

  nextButton?.addEventListener('click', next);
  prevButton?.addEventListener('click', prev);
  dots.forEach(dot => dot.addEventListener('click', () => setActive(Number(dot.dataset.slideTo))));

  if (slider && slides.length > 1) {
    let scrollTimer;
    slider.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const edge = slider.getBoundingClientRect().right;
        const distances = slides.map((slide, i) => ({ i, d: Math.abs(slide.getBoundingClientRect().right - edge) }));
        const nearest = distances.sort((a,b) => a.d - b.d)[0]?.i ?? 0;
        if (nearest !== activeIndex) setActive(nearest, false);
      }, 80);
    }, { passive: true });

    const startAutoplay = () => {
      clearInterval(autoplay);
      autoplay = setInterval(next, 6500);
    };
    const stopAutoplay = () => clearInterval(autoplay);
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);
    slider.addEventListener('touchstart', stopAutoplay, { passive: true });
    slider.addEventListener('touchend', startAutoplay, { passive: true });
    startAutoplay();
    setActive(0, false);
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
})();
