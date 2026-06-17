// Fallback: if Motion didn't load, make everything visible immediately
if (typeof Motion === 'undefined') {
  document.querySelectorAll('.badge,.hero h1,.hero-sub,.btn-hero,.scroll-indicator,.card,.section-header')
    .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}

const { animate, inView, stagger } = (typeof Motion !== 'undefined' ? Motion : {
  animate: () => ({ finished: Promise.resolve() }),
  inView: (sel, cb) => { document.querySelectorAll(sel).forEach(t => cb({ target: t })); },
  stagger: () => 0,
});

// ── HERO entrance (staggered waterfall) ──────────────────────────────────────
const ease = [0.22, 1, 0.36, 1]; // spring-like ease

animate('.badge',          { opacity: [0, 1], y: [16, 0] }, { duration: 0.55, delay: 0.1,  easing: ease });
animate('.hero h1',        { opacity: [0, 1], y: [32, 0] }, { duration: 0.65, delay: 0.25, easing: ease });
animate('.hero-sub',       { opacity: [0, 1], y: [20, 0] }, { duration: 0.55, delay: 0.45, easing: ease });
animate('.btn-hero',       { opacity: [0, 1], y: [16, 0] }, { duration: 0.5,  delay: 0.6,  easing: ease });
animate('.scroll-indicator', { opacity: [0, 1] },           { duration: 0.4,  delay: 0.85 });

// ── Section header animate on scroll ─────────────────────────────────────────
inView('.section-header', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, easing: ease });
}, { margin: '-80px' });

// ── Cards stagger on scroll ───────────────────────────────────────────────────
inView('.cards-grid', ({ target }) => {
  animate(
    target.querySelectorAll('.card'),
    { opacity: [0, 1], y: [40, 0] },
    { delay: stagger(0.09, { start: 0.05 }), duration: 0.55, easing: ease }
  );
}, { margin: '-60px' });

// ── Modals ────────────────────────────────────────────────────────────────────
document.querySelectorAll('.card[data-modal]').forEach(card => {
  card.addEventListener('click', () => {
    const overlay = document.getElementById(`modal-${card.dataset.modal}`);
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Animate modal content in
    const modal = overlay.querySelector('.modal');
    animate(modal, { opacity: [0, 1], y: [24, 0], scale: [0.96, 1] },
      { duration: 0.38, easing: ease });
  });
});

function closeModal(overlay) {
  const modal = overlay.querySelector('.modal');
  animate(modal, { opacity: [1, 0], y: [0, 16], scale: [1, 0.96] },
    { duration: 0.25, easing: 'ease-in' }
  ).finished.then(() => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay); });
  overlay.querySelector('.modal-close')?.addEventListener('click', () => closeModal(overlay));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
  }
});

// ── Forms ─────────────────────────────────────────────────────────────────────
['compta', 'voyages'].forEach(id => {
  const form = document.getElementById(`form-${id}`);
  const success = document.getElementById(`success-${id}`);
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';

    setTimeout(() => {
      form.querySelectorAll('input').forEach(i => i.value = '');
      success.classList.remove('hidden');
      animate(success, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, easing: ease });
      btn.textContent = 'Envoyé ✓';
      btn.style.opacity = '0.6';
    }, 800);
  });
});
