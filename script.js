/* Véro Esthétique — menu, photo viewer, gentle reveals. No dependencies, no tracking. */
(() => {
  'use strict';

  const annee = document.getElementById('annee');
  if (annee) annee.textContent = String(new Date().getFullYear());

  /* header shadow + mobile call bar */
  const entete = document.querySelector('[data-entete]');
  const appel = document.querySelector('.appel-mobile');
  const contact = document.getElementById('contact');
  const onScroll = () => {
    const y = window.scrollY;
    entete?.classList.toggle('est-defile', y > 8);
    if (appel) {
      const avantContact = !contact || contact.getBoundingClientRect().top > window.innerHeight;
      appel.classList.toggle('est-visible', y > window.innerHeight * 0.5 && avantContact);
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
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('est-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    elements.forEach(el => io.observe(el));
  } else {
    elements.forEach(el => el.classList.add('est-visible'));
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
