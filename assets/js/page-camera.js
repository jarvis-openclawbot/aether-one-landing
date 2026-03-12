const gallery = document.getElementById('gallery-image');
const sceneButtons = document.querySelectorAll('[data-scene]');
const lens = document.querySelector('.camera-lens');

if (gallery && sceneButtons.length) {
  const scenes = [
    {
      src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1800&q=80',
      alt: 'Scène urbaine détaillée de nuit'
    },
    {
      src: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=1800&q=80',
      alt: 'Portrait naturel avec séparation du sujet'
    },
    {
      src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1800&q=80',
      alt: 'Architecture grand-angle à fort contraste'
    }
  ];

  sceneButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.scene);
      if (!Number.isInteger(id) || !scenes[id]) return;
      sceneButtons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      gallery.animate([{ opacity: 1 }, { opacity: .3 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' });
      setTimeout(() => {
        gallery.src = scenes[id].src;
        gallery.alt = scenes[id].alt;
      }, 130);
    });
  });
}

if (lens && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const rect = lens.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));
    const scale = 0.92 + progress * 0.12;
    lens.style.transform = `scale(${scale})`;
    lens.style.filter = `saturate(${1 + progress * .35})`;
  }, { passive: true });
}
