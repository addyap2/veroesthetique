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

  /* reveal on scroll */
  const elements = document.querySelectorAll('.revele');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((entry, i) => {
          entry.target.style.setProperty('--d', `${Math.min(i * 0.08, 0.4)}s`);
          entry.target.classList.add('est-visible');
          io.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -6% 0px' });
    elements.forEach(el => io.observe(el));
  } else {
    elements.forEach(el => el.classList.add('est-visible'));
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
