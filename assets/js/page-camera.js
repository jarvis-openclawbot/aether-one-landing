const gallery = document.getElementById('gallery-image');
const sceneButtons = document.querySelectorAll('[data-scene]');
const lens = document.querySelector('[data-lens-3d], .camera-lens, .lens-stack');

const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const saveData = Boolean(connection && connection.saveData);
const lowBandwidth = Boolean(connection && /2g/.test(connection.effectiveType || ''));
const lowPowerDevice = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

const CAMERA_MOTION = {
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  touchLike: window.matchMedia('(pointer: coarse)').matches,
  mobileWidth: window.matchMedia('(max-width: 900px)').matches,
  lensShiftMax: 9,
  lensLerp: 0.1,
  lite: saveData || lowBandwidth || lowPowerDevice
};

const lensMotionAllowed = !CAMERA_MOTION.reduced && !CAMERA_MOTION.touchLike && !CAMERA_MOTION.mobileWidth && !CAMERA_MOTION.lite;

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
          { opacity: 0.5, transform: 'scale(1.015)' },
          { opacity: 1, transform: 'scale(1)' }
        ], { duration: 440, easing: 'cubic-bezier(.22,.61,.36,1)' });
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
    lens.style.filter = `saturate(${1 + progress * 0.25}) brightness(${1 + progress * 0.06}) contrast(${1 + progress * 0.05})`;
    lens.style.setProperty('--lens-scale', (0.97 + progress * 0.09).toFixed(3));
    lens.style.setProperty('--depth-y', `${(progress * -8).toFixed(2)}px`);
    const sweepX = -100 + progress * 220;
    lens.style.setProperty('--bump-sweep', `${sweepX.toFixed(2)}%`);
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