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
    { src: 'assets/img/camera-urban-night.svg', alt: 'Scène urbaine nocturne au rendu naturel Jarvis Vision' },
    { src: 'assets/img/camera-portrait-skin.svg', alt: 'Portrait avec tons de peau naturels et texture fidèle' },
    { src: 'assets/img/camera-lowlight-motion.svg', alt: 'Scène en faible lumière avec mouvement stabilisé' }
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
          { opacity: 0.45, transform: 'scale(1.012)' },
          { opacity: 1, transform: 'scale(1)' }
        ], { duration: 420, easing: 'cubic-bezier(.22,.61,.36,1)' });
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

if (lens && lensMotionAllowed) {
  let rafScheduled = false;
  let latestProgress = 0;

  const renderLens = () => {
    const progress = latestProgress;
    lens.style.filter = `saturate(${1 + progress * 0.24}) brightness(${1 + progress * 0.04})`;
    lens.style.setProperty('--lens-scale', (0.96 + progress * 0.08).toFixed(3));
    lens.style.setProperty('--depth-y', `${(progress * -6).toFixed(2)}px`);
    rafScheduled = false;
  };

  window.addEventListener('scroll', () => {
    const rect = lens.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    latestProgress = Math.max(0, Math.min(1, 1 - rect.top / vh));
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(renderLens);
    }
  }, { passive: true });

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
