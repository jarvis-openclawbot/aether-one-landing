const pageMap = {
  "index.html": "accueil",
  "": "accueil",
  "produit.html": "produit",
  "camera.html": "camera",
  "offres.html": "offres",
  "a-propos.html": "a-propos",
  "contact.html": "contact",
  "mentions-legales.html": "mentions-legales"
};

const current = document.body.dataset.page || pageMap[location.pathname.split('/').pop()] || "accueil";
document.querySelectorAll('.nav-links a').forEach((a) => {
  const href = a.getAttribute('href');
  if (!href) return;
  const key = pageMap[href] || href.replace('.html', '');
  if (key === current) a.setAttribute('aria-current', 'page');
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if (!reduceMotion && reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

const tilt = document.querySelector('[data-tilt]');
if (tilt && !reduceMotion) {
  let tx = 0, ty = 0, cx = 0, cy = 0, raf;
  const tick = () => {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    tilt.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`;
    raf = requestAnimationFrame(tick);
  };
  tilt.addEventListener('mousemove', (e) => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    tx = (x - 0.5) * 14;
    ty = (0.5 - y) * 12;
  });
  tilt.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
  tick();
  addEventListener('beforeunload', () => cancelAnimationFrame(raf));
}

const parallax = document.querySelector('[data-parallax]');
if (parallax && !reduceMotion) {
  const layers = [...parallax.querySelectorAll('[data-layer]')];
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.08;
    layers.forEach((el) => {
      const speed = Number(el.dataset.layer || 0);
      el.style.transform = `translateY(${(y * speed) / 20}px)`;
    });
  }, { passive: true });
}
