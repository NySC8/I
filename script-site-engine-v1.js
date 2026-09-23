(() => {
  'use strict';
  const toast = document.getElementById('copyToast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function absoluteUrl(path) {
    try { return new URL(path, window.location.href).href; } catch (_) { return path; }
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
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    field.remove();
    return ok;
  }

  document.querySelectorAll('[data-copy-url]').forEach(button => {
    button.addEventListener('click', async () => {
      const url = absoluteUrl(button.dataset.copyUrl || window.location.href);
      try {
        const ok = await copyText(url);
        showToast(ok ? 'لینک کپی شد' : 'کپی لینک انجام نشد؛ لینک را از نوار آدرس بردارید');
      } catch (_) {
        showToast('کپی لینک انجام نشد؛ لینک را از نوار آدرس بردارید');
      }
    });
  });

  const shareButton = document.getElementById('sharePost');
  shareButton?.addEventListener('click', async () => {
    const data = { title: document.title, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch (_) {}
    } else {
      try { await copyText(window.location.href); showToast('لینک کپی شد'); } catch (_) { showToast('لینک را از نوار آدرس کپی کنید'); }
    }
  });
})();
