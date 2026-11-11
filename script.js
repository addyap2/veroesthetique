/* Véro Esthétique — menu, photo viewer, gentle reveals. No dependencies, no tracking. */
(() => {
  'use strict';

  const annee = document.getElementById('annee');
  if (annee) annee.textContent = String(new Date().getFullYear());

  /* header hairline + mobile call bar (shown once the hero button is off-screen) */
  const entete = document.querySelector('[data-entete]');
  const appel = document.querySelector('.appel-mobile');
  const contact = document.getElementById('contact');
  const heroCta = document.querySelector('[data-hero-cta]');
  const onScroll = () => {
    entete?.classList.toggle('est-defile', window.scrollY > 8);
    if (appel) {
      const vh = window.innerHeight;
      const ctaParti = !heroCta || heroCta.getBoundingClientRect().bottom < 0;
      const avantContact = !contact || contact.getBoundingClientRect().top > vh;
      appel.classList.toggle('est-visible', ctaParti && avantContact);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  const bouton = document.querySelector('[data-menu-bouton]');
  const menu = document.getElementById('menu');
  if (bouton && menu) {
    const fermer = () => { menu.classList.remove('est-ouvert'); bouton.setAttribute('aria-expanded', 'false'); };
    bouton.addEventListener('click', () => {
      const ouvert = menu.classList.toggle('est-ouvert');
      bouton.setAttribute('aria-expanded', String(ouvert));
    });
    menu.addEventListener('click', e => { if (e.target.closest('a')) fermer(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fermer(); });
  }

  /* ---------- motion system (docs/MOTION.md) ---------- */
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tous = [...document.querySelectorAll('.revele')];
  const hero = tous.filter(el => el.closest('.hero'));
  const reste = tous.filter(el => !el.closest('.hero'));
  const montrer = (el, delaiMs) => {
    el.style.setProperty('--d', `${delaiMs / 1000}s`);
    el.classList.add('est-visible');
  };

  if (reduit || !('IntersectionObserver' in window)) {
    tous.forEach(el => el.classList.add('est-visible'));
  } else {
    /* loading sequence: wait for the fonts (max 500 ms) so text never jumps */
    const lancerHero = () => hero.forEach(el => montrer(el, Number(el.dataset.d || 0)));
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise(r => setTimeout(r, 500))])
      .then(() => requestAnimationFrame(lancerHero));

    /* scroll reveals: once, ordered top-to-bottom then left-to-right, 80 ms apart, capped at 400 ms */
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((entry, i) => {
          montrer(entry.target, Math.min(i * 80, 400));
          io.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -6% 0px' });
    reste.forEach(el => io.observe(el));

    /* light parallax: the photo moves inside its frame, only while on screen */
    const cadres = [...document.querySelectorAll('[data-parallax]')];
    const visibles = new Set();
    let enAttente = false;
    const parallaxe = () => {
      enAttente = false;
      const centre = window.innerHeight / 2;
      visibles.forEach(el => {
        const r = el.getBoundingClientRect();
        const base = parseFloat(getComputedStyle(el).getPropertyValue('--base')) || 1.08;
        const limite = r.height * (base - 1) / 2 * 0.9; // never travel past the photo's bleed
        const ecart = Math.max(-limite, Math.min(limite, (r.top + r.height / 2 - centre) * Number(el.dataset.parallax)));
        const img = el.querySelector('img');
        if (img) img.style.setProperty('--py', `${ecart.toFixed(1)}px`);
      });
    };
    const demander = () => { if (!enAttente) { enAttente = true; requestAnimationFrame(parallaxe); } };
    const ioP = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target));
      demander();
    });
    cadres.forEach(el => ioP.observe(el));
    window.addEventListener('scroll', demander, { passive: true });
    window.addEventListener('resize', demander);
  }

  /* current section in the nav */
  const liens = [...document.querySelectorAll('.menu a[href^="#"]')];
  if ('IntersectionObserver' in window && liens.length) {
    const cibles = liens.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        liens.forEach(a => {
          if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    cibles.forEach(c => navObserver.observe(c));
  }

  /* film: custom play button, then native controls */
  const film = document.querySelector('[data-film]');
  if (film) {
    const video = film.querySelector('video');
    film.querySelector('[data-film-lecture]').addEventListener('click', () => {
      film.classList.add('est-lancee');
      video.controls = true;
      video.play().catch(() => {});
    });
  }

  /* photo viewer */
  const dialog = document.getElementById('visionneuse');
  if (dialog && typeof dialog.showModal === 'function') {
    const image = document.getElementById('visionneuse-image');
    const legende = document.getElementById('visionneuse-legende');
    let source = null;
    document.querySelectorAll('[data-visionneuse]').forEach(lien => {
      lien.addEventListener('click', e => {
        e.preventDefault();
        source = lien;
        image.src = lien.getAttribute('href');
        image.alt = lien.querySelector('img')?.alt || lien.dataset.legende || '';
        legende.textContent = lien.dataset.legende || '';
        dialog.showModal();
      });
    });
    dialog.querySelector('[data-fermer]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => source?.focus());
  }
})();
