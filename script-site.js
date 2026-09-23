
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
