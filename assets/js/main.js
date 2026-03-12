document.documentElement.classList.add('js');

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

const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const saveData = Boolean(connection && connection.saveData);
const lowBandwidth = Boolean(connection && /2g/.test(connection.effectiveType || ''));
const lowPowerDevice = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

const MOTION = {
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  touchLike: window.matchMedia('(pointer: coarse)').matches,
  mobileWidth: window.matchMedia('(max-width: 900px)').matches,
  revealThreshold: 0.18,
  revealRootMargin: '0px 0px -7% 0px',
  revealStaggerMs: 90,
  depthMaxPx: 36,
  depthEase: 0.12,
  tiltLerp: 0.1,
  tiltXRange: 15,
  tiltYRange: 11,
  tiltRestX: -8,
  tiltRestY: 4
};

const motionAllowed = !MOTION.reduced;
const performanceLite = saveData || lowBandwidth || lowPowerDevice;
const advancedMotionAllowed = motionAllowed && !MOTION.touchLike && !MOTION.mobileWidth && !performanceLite;
if (performanceLite) document.body.classList.add('performance-lite');

const current = document.body.dataset.page || pageMap[location.pathname.split('/').pop()] || 'accueil';

const header = document.querySelector('.site-header');
const subnav = document.querySelector('.subnav');
const root = document.documentElement;
const setStickyMetrics = () => {
  const headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 64;
  root.style.setProperty('--header-height', `${headerHeight}px`);
  if (subnav) root.style.setProperty('--subnav-height', `${Math.round(subnav.getBoundingClientRect().height)}px`);
};
setStickyMetrics();
window.addEventListener('resize', setStickyMetrics);
window.addEventListener('orientationchange', setStickyMetrics);

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  const syncMenuA11y = (open) => {
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    syncMenuA11y(false);
  };

  menuToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    syncMenuA11y(open);
  });

  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  syncMenuA11y(false);
}

document.querySelectorAll('.nav-links a').forEach((a) => {
  const href = a.getAttribute('href');
  const key = pageMap[href] || href?.replace('.html', '');
  if (key === current) a.setAttribute('aria-current', 'page');
});

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

const subnavLinks = Array.from(document.querySelectorAll('.subnav-links a[href^="#"]'));
if (subnavLinks.length) {
  const sections = subnavLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const updateActiveSubnav = () => {
    let activeId = '';
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= ((header?.getBoundingClientRect().height || 64) + 84)) activeId = section.id;
    });

    subnavLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  subnavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = (header?.getBoundingClientRect().height || 64) + (subnav?.getBoundingClientRect().height || 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: MOTION.reduced ? 'auto' : 'smooth' });
    });
  });

  window.addEventListener('scroll', updateActiveSubnav, { passive: true });
  updateActiveSubnav();
}

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

const heroStage = document.querySelector('[data-phone3d]');
const heroPhone = heroStage?.querySelector('.phone-shell');
if (heroStage && heroPhone && advancedMotionAllowed) {
  let tx = -9;
  let ty = 12;
  let lx = 0;
  let ly = 0;
  let cx = tx;
  let cy = ty;
  let crx = 0;
  let cry = 0;
  let raf;

  const animateHero = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    crx += (lx - crx) * 0.09;
    cry += (ly - cry) * 0.09;
    heroStage.style.setProperty('--hero-tilt-x', `${cx.toFixed(2)}deg`);
    heroStage.style.setProperty('--hero-tilt-y', `${cy.toFixed(2)}deg`);
    heroStage.style.setProperty('--reflect-x', `${crx.toFixed(2)}px`);
    heroStage.style.setProperty('--reflect-y', `${cry.toFixed(2)}px`);
    heroStage.style.setProperty('--bump-sweep', `${Math.max(-120, Math.min(120, crx * 1.5)).toFixed(2)}%`);
    raf = requestAnimationFrame(animateHero);
  };

  heroStage.addEventListener('pointermove', (e) => {
    const r = heroStage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tx = -8 - py * 7;
    ty = 10 + px * 16;
    lx = px * 44;
    ly = py * 30;
  });

  heroStage.addEventListener('pointerleave', () => {
    tx = -9;
    ty = 12;
    lx = 0;
    ly = 0;
  });

  window.addEventListener('scroll', () => {
    const rect = heroStage.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = Math.max(-1, Math.min(1, (rect.top + rect.height * 0.5 - vh * 0.5) / vh));
    heroStage.style.setProperty('--hero-lift', `${(-progress * 10).toFixed(2)}px`);
  }, { passive: true });

  animateHero();
  window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
}

const exploded = document.querySelector('[data-exploded]');
if (exploded && !MOTION.reduced && !performanceLite) {
  const layers = Array.from(exploded.querySelectorAll('.exploded-layer'));
  const renderExploded = () => {
    const rect = exploded.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = Math.max(0, Math.min(1, 1 - (rect.top + rect.height * 0.2) / vh));
    const gap = 8 + progress * 30;
    exploded.style.setProperty('--explode-gap', `${gap.toFixed(2)}px`);
    const centerOffset = (layers.length - 1) / 2;
    layers.forEach((layer, i) => {
      const index = i - centerOffset;
      const drift = index * progress * 1.8;
      layer.style.transform = `translate3d(-50%, -50%, 0) rotateX(58deg) rotateZ(-15deg) translateY(${(gap * index + drift).toFixed(2)}px)`;
    });
  };
  window.addEventListener('scroll', () => requestAnimationFrame(renderExploded), { passive: true });
  renderExploded();
}

const cinematicSteps = Array.from(document.querySelectorAll('[data-cinematic-step]'));
if (cinematicSteps.length && motionAllowed && !performanceLite) {
  const updateCinematic = () => {
    const vh = window.innerHeight || 1;
    cinematicSteps.forEach((step) => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const near = Math.abs(center - vh * 0.52) < vh * 0.3;
      step.classList.toggle('is-stage', near);
    });
  };
  window.addEventListener('scroll', () => requestAnimationFrame(updateCinematic), { passive: true });
  updateCinematic();
} else {
  cinematicSteps.forEach((s) => s.classList.add('is-stage'));
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
