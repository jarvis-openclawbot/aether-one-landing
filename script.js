const reveals = [...document.querySelectorAll('.reveal')];

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
);

reveals.forEach((el) => observer.observe(el));

const tiltEl = document.querySelector('[data-tilt]');
if (tiltEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let raf = 0;
  const damp = 0.08;
  let curX = 0, curY = 0;
  let targetX = 0, targetY = 0;

  const animate = () => {
    curX += (targetX - curX) * damp;
    curY += (targetY - curY) * damp;
    tiltEl.style.transform = `rotateX(${curY}deg) rotateY(${curX}deg) translateZ(0)`;
    raf = requestAnimationFrame(animate);
  };

  tiltEl.addEventListener('mousemove', (e) => {
    const r = tiltEl.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    targetX = (px - 0.5) * 12;
    targetY = (0.5 - py) * 10;
  });

  tiltEl.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  animate();
  window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
}
