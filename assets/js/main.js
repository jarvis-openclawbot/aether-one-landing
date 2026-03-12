const pageMap = {
  'index.html': 'accueil',
  '': 'accueil',
  'produit.html': 'produit',
  'camera.html': 'camera',
  'offres.html': 'offres',
  'a-propos.html': 'a-propos',
  'contact.html': 'contact',
  'mentions-legales.html': 'mentions-legales'
};

const MOTION = {
  // Global switches
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  touchLike: window.matchMedia('(pointer: coarse)').matches,
  mobileWidth: window.matchMedia('(max-width: 760px)').matches,

  // Timeline-like reveal system
  revealThreshold: 0.18,
  revealRootMargin: '0px 0px -7% 0px',
  revealStaggerMs: 90,

  // Scroll depth/parallax (kept conservative for performance)
  depthMaxPx: 36,
  depthEase: 0.12,

  // Device tilt / hero micro interaction
  tiltLerp: 0.1,
  tiltXRange: 15,
  tiltYRange: 11,
  tiltRestX: -8,
  tiltRestY: 4
};

const motionAllowed = !MOTION.reduced;
const advancedMotionAllowed = motionAllowed && !MOTION.touchLike && !MOTION.mobileWidth;
const current = document.body.dataset.page || pageMap[location.pathname.split('/').pop()] || 'accueil';

document.querySelectorAll('.nav-links a').forEach((a) => {
  const href = a.getAttribute('href');
  const key = pageMap[href] || href?.replace('.html', '');
  if (key === current) a.setAttribute('aria-current', 'page');
});

const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress-bar');
const depthTargets = advancedMotionAllowed
  ? Array.from(document.querySelectorAll('.device-stage, .showcase img, .card, .camera-lens'))
  : [];

let latestY = window.scrollY;
let ticking = false;

const applyScrollState = () => {
  const y = latestY;

  if (header) header.classList.toggle('is-compact', y > 18);

  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? y / max : 0;
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, p))})`;
  }

  // Depth/parallax: JS writes a single custom prop, CSS composes transform.
  // This avoids multiple inline transform overwrites and is easy to tune.
  if (depthTargets.length) {
    const vh = window.innerHeight || 1;
    depthTargets.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const normalized = Math.max(-1, Math.min(1, (center - vh * 0.5) / (vh * 0.5)));
      const strength = 0.55 + (index % 4) * 0.14;
      const offset = -normalized * MOTION.depthMaxPx * strength;
      const currentOffset = Number(el.style.getPropertyValue('--depth-y').replace('px', '')) || 0;
      const eased = currentOffset + (offset - currentOffset) * MOTION.depthEase;
      el.style.setProperty('--depth-y', `${eased.toFixed(2)}px`);
      el.classList.add('motion-depth');
    });
  }

  ticking = false;
};

const onScroll = () => {
  latestY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(applyScrollState);
    ticking = true;
  }
};

window.addEventListener('scroll', onScroll, { passive: true });
applyScrollState();

// Staged reveals: assigns an incremental delay per local group for a premium timeline feel.
const reveals = document.querySelectorAll('.reveal');
if (motionAllowed && reveals.length) {
  const groupCount = new WeakMap();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const parent = entry.target.parentElement || document.body;
      const localIndex = groupCount.get(parent) || 0;
      groupCount.set(parent, localIndex + 1);
      entry.target.style.setProperty('--reveal-delay', `${localIndex * MOTION.revealStaggerMs}ms`);
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: MOTION.revealThreshold, rootMargin: MOTION.revealRootMargin });

  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

const device = document.querySelector('[data-tilt] .device') || document.querySelector('[data-tilt]');
if (device && advancedMotionAllowed) {
  let tx = MOTION.tiltRestX;
  let ty = MOTION.tiltRestY;
  let cx = tx;
  let cy = ty;
  let raf;

  const animate = () => {
    cx += (tx - cx) * MOTION.tiltLerp;
    cy += (ty - cy) * MOTION.tiltLerp;
    device.style.setProperty('--tilt-x', `${cx.toFixed(2)}deg`);
    device.style.setProperty('--tilt-y', `${cy.toFixed(2)}deg`);
    raf = requestAnimationFrame(animate);
  };

  device.addEventListener('pointermove', (e) => {
    const r = device.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tx = px * MOTION.tiltXRange;
    ty = -py * MOTION.tiltYRange;
  });

  device.addEventListener('pointerleave', () => {
    tx = MOTION.tiltRestX;
    ty = MOTION.tiltRestY;
  });

  animate();
  window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
}
