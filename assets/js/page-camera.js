const gallery = document.getElementById('gallery-image');
const sceneButtons = document.querySelectorAll('[data-scene]');

if (gallery && sceneButtons.length) {
  const scenes = [
    {
      src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80',
      alt: "Exemple photo urbaine prise avec Jarvis Vision"
    },
    {
      src: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=1400&q=80',
      alt: 'Portrait avec profondeur de champ naturelle'
    },
    {
      src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=80',
      alt: 'Scène de nuit capturée avec le mode basse lumière Jarvis'
    }
  ];

  sceneButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.scene);
      if (!Number.isInteger(id) || !scenes[id]) return;
      sceneButtons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      gallery.style.opacity = '0.45';
      setTimeout(() => {
        gallery.src = scenes[id].src;
        gallery.alt = scenes[id].alt;
        gallery.style.opacity = '1';
      }, 130);
    });
  });
}
