/* narayandrolia.com — interactions */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- sticky nav ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- scroll reveal ---------- */
const revealItems = document.querySelectorAll('.reveal');

if (reduced || !('IntersectionObserver' in window)) {
  revealItems.forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // slight stagger for items revealed together
      entry.target.style.transitionDelay = (i * 70) + 'ms';
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach(el => io.observe(el));
}

/* ---------- count-up stats ---------- */
const counters = document.querySelectorAll('.count');

const format = (n, pad) =>
  n >= 1000 ? n.toLocaleString('en-IN') : String(n).padStart(pad, '0');

const runCount = (el) => {
  const to = +el.dataset.to;
  const pad = el.textContent.length;      // preserve "00" style placeholders
  const dur = 1500;

  // rAF is paused in background tabs, which would freeze the number
  // partway through. Just show the final value instead.
  if (document.hidden) { el.textContent = format(to, pad); return; }

  const t0 = performance.now();

  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
    el.textContent = format(Math.round(to * eased), pad);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (reduced || !('IntersectionObserver' in window)) {
  counters.forEach(el => { el.textContent = format(+el.dataset.to, el.textContent.length); });
} else {
  const co = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      runCount(entry.target);
      co.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => co.observe(el));
}

/* ---------- 3D tilt on hero sheet (pointer-capable devices only) ---------- */
const sheet = document.getElementById('tiltSheet');
const hero = document.querySelector('.hero');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

if (sheet && hero && finePointer && !reduced) {
  let raf = null;

  hero.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = sheet.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
      sheet.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      raf = null;
    });
  });

  hero.addEventListener('mouseleave', () => {
    sheet.style.transform = '';
  });
}

/* ---------- magnetic buttons ---------- */
if (finePointer && !reduced) {
  document.querySelectorAll('.magnet').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}
