const gallery = document.getElementById('gallery-image');
const sceneButtons = document.querySelectorAll('[data-scene]');
const lens = document.querySelector('.camera-lens, .lens-stack');

const CAMERA_MOTION = {
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  touchLike: window.matchMedia('(pointer: coarse)').matches,
  mobileWidth: window.matchMedia('(max-width: 760px)').matches,
  lensShiftMax: 9,
  lensLerp: 0.1
};

const lensMotionAllowed = !CAMERA_MOTION.reduced && !CAMERA_MOTION.touchLike && !CAMERA_MOTION.mobileWidth;

if (gallery && sceneButtons.length) {
  const scenes = [
    {
      src: 'assets/img/camera-scene-urban.svg',
      alt: 'Scène urbaine premium en basse lumière'
    },
    {
      src: 'assets/img/camera-scene-portrait.svg',
      alt: 'Portrait premium au rendu naturel et précis'
    },
    {
      src: 'assets/img/camera-scene-night.svg',
      alt: 'Scène nocturne riche en contraste avec Jarvis Vision'
    }
  ];

  sceneButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.scene);
      if (!Number.isInteger(id) || !scenes[id]) return;
      sceneButtons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      if (!CAMERA_MOTION.reduced && gallery.animate) {
        gallery.animate([
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0.35, transform: 'scale(1.015)' },
          { opacity: 1, transform: 'scale(1)' }
        ], { duration: 460, easing: 'cubic-bezier(.22,.61,.36,1)' });
      }

      const next = new Image();
      next.onload = () => {
        gallery.src = scenes[id].src;
        gallery.alt = scenes[id].alt;
      };
      next.src = scenes[id].src;
    });
  });
}

if (lens && !CAMERA_MOTION.reduced) {
  // Scroll-driven lens energy and depth pulse.
  window.addEventListener('scroll', () => {
    const rect = lens.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));
    const scale = 0.94 + progress * 0.1;
    lens.style.filter = `saturate(${1 + progress * 0.32}) brightness(${1 + progress * 0.05})`;

    lens.style.setProperty('--lens-scale', scale.toFixed(3));
    if (lensMotionAllowed) {
      lens.style.setProperty('--depth-y', `${(progress * -8).toFixed(2)}px`);
    }
  }, { passive: true });
}

if (lens && lensMotionAllowed) {
  // Small camera-lens "alive" micro motion following pointer, heavily eased.
  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  let raf;

  const tick = () => {
    cx += (tx - cx) * CAMERA_MOTION.lensLerp;
    cy += (ty - cy) * CAMERA_MOTION.lensLerp;
    lens.style.setProperty('--lens-shift-x', `${cx.toFixed(2)}px`);
    lens.style.setProperty('--lens-shift-y', `${cy.toFixed(2)}px`);
    raf = requestAnimationFrame(tick);
  };

  lens.addEventListener('pointermove', (e) => {
    const rect = lens.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tx = px * CAMERA_MOTION.lensShiftMax;
    ty = py * CAMERA_MOTION.lensShiftMax;
  });

  lens.addEventListener('pointerleave', () => {
    tx = 0;
    ty = 0;
  });

  tick();
  window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
}
