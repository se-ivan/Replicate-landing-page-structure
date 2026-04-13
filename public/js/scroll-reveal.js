document.addEventListener('DOMContentLoaded', function () {
  const els = document.querySelectorAll('.sr');
  if (!els || els.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('sr-visible'));
    const items = document.querySelectorAll('.sr-item');
    items.forEach(it => it.classList.add('sr-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-sr-delay') || '0', 10) || 0;
        if (delay) {
          setTimeout(() => el.classList.add('sr-visible'), delay);
        } else {
          el.classList.add('sr-visible');
        }

        const items = el.querySelectorAll('.sr-item');
        if (items.length) {
          items.forEach((it, idx) => {
            setTimeout(() => it.classList.add('sr-visible'), idx * 80 + delay);
          });
        }

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  els.forEach(el => io.observe(el));
});
