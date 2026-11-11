/* Véro Esthétique — motion « respiration ». No dependencies, no tracking. */
(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const year = document.getElementById('annee');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- opening: light comes up once the hero photo is ready ---------- */
  const heroPhoto = document.querySelector('.porte-photo');
  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('is-ready')));
  if (!heroPhoto || heroPhoto.complete) ready();
  else {
    heroPhoto.addEventListener('load', ready, { once: true });
    heroPhoto.addEventListener('error', ready, { once: true });
    setTimeout(ready, 2500);
  }

  /* ---------- focus reveals ---------- */
  const focusables = [...document.querySelectorAll('[data-focus]')];
  if ('IntersectionObserver' in window && !reduced.matches) {
    const io = new IntersectionObserver(entries => {
      const entering = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      entering.forEach((entry, i) => {
        entry.target.style.setProperty('--delay', `${Math.min(i * 0.12, 0.6)}s`);
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    focusables.forEach(el => io.observe(el));
  } else {
    focusables.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- scroll-linked: clock, scenes, tones, parallax ---------- */
  const bar = document.querySelector('[data-bar]');
  const clock = document.querySelector('[data-clock]');
  const clockMin = document.querySelector('[data-clock-min]');
  const clockChapter = document.querySelector('[data-clock-chapter]');
  const chapters = [...document.querySelectorAll('[data-minute]')];
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const toned = [...document.querySelectorAll('section, .pied')];
  const porte = document.querySelector('.porte');
  const drifters = [...document.querySelectorAll('[data-drift]')];
  const mobileCall = document.querySelector('.appel-mobile');
  const sortie = document.querySelector('.sortie');

  let geometry = [];
  const measure = () => {
    const y = window.scrollY;
    geometry = chapters.map(el => ({
      el,
      top: el.getBoundingClientRect().top + y,
      minute: Number(el.dataset.minute),
      name: el.dataset.chapter
    }));
  };

  const toneAt = (y) => {
    for (const el of toned) {
      const r = el.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        if (el.dataset.tone === 'scene') return Number(el.style.getPropertyValue('--e') || 0) > 0.55 ? 'dark' : 'light';
        return el.dataset.tone === 'dark' ? 'dark' : 'light';
      }
    }
    return 'light';
  };

  let lastMinute = -1;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    // scenes: progress 0 → 1 while the sticky stage is pinned
    if (!reduced.matches) {
      for (const scene of scenes) {
        const r = scene.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - vh));
        scene.style.setProperty('--p', p.toFixed(4));
        scene.style.setProperty('--e', easeInOut(clamp(p / 0.8)).toFixed(4));
      }
      if (porte) porte.style.setProperty('--s', clamp(y / vh).toFixed(4));
      for (const el of drifters) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const centre = (r.top + r.height / 2 - vh / 2);
        el.style.setProperty('--y', (centre * Number(el.dataset.drift)).toFixed(1));
      }
    }

    // the clock: minutes advance with the reader through the chapters
    const probe = y + vh * 0.2;
    let minute = 0, name = geometry[0]?.name || '';
    for (let i = 0; i < geometry.length; i++) {
      const a = geometry[i], b = geometry[i + 1];
      if (probe >= a.top) {
        name = a.name;
        minute = b ? a.minute + (b.minute - a.minute) * clamp((probe - a.top) / (b.top - a.top)) : a.minute;
      }
    }
    if (y < 4) minute = 0;
    if (y + vh >= document.documentElement.scrollHeight - 4) { minute = 60; name = geometry.at(-1)?.name || name; }
    const m = Math.round(minute);
    if (m !== lastMinute && clock) {
      lastMinute = m;
      clock.style.setProperty('--min', m);
      clockMin.textContent = String(m).padStart(2, '0');
      if (clockChapter.textContent !== name) clockChapter.textContent = name;
    }

    // tones for the fixed bar and clock
    if (bar) bar.dataset.tone = toneAt(bar.offsetHeight / 2);

    // the bar gains a soft frosted ground once past the opening
    if (bar) bar.classList.toggle('is-solid', y > vh * 0.75);

    // mobile call bar: after the first screen, hidden on the final chapter
    if (mobileCall && sortie) {
      const sr = sortie.getBoundingClientRect();
      mobileCall.classList.toggle('is-shown', y > vh * 0.6 && sr.top > vh * 0.85);
    }
  };

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const onResize = () => { measure(); onScroll(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('load', onResize);
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(document.body);
  reduced.addEventListener?.('change', () => location.reload());
  measure();
  update();

  /* ---------- the mirror film ---------- */
  const film = document.querySelector('[data-film]');
  if (film) {
    const video = film.querySelector('video');
    const toggle = film.querySelector('[data-film-toggle]');
    const state = film.querySelector('[data-film-state]');
    const progress = film.querySelector('[data-film-progress]');
    const sync = () => {
      const playing = !video.paused && !video.ended;
      film.classList.toggle('is-playing', playing);
      toggle.setAttribute('aria-label', playing ? 'Mettre le film en pause' : 'Lire le film');
      state.textContent = playing ? 'Appuyez pour mettre en pause' : (video.ended ? 'Revoir le film' : 'Appuyez pour lire');
    };
    toggle.addEventListener('click', () => {
      if (video.paused || video.ended) {
        video.play().catch(() => { video.controls = true; });
      } else video.pause();
    });
    ['play', 'pause', 'ended'].forEach(e => video.addEventListener(e, sync));
    video.addEventListener('timeupdate', () => {
      if (video.duration) progress.style.setProperty('--film', (video.currentTime / video.duration).toFixed(3));
    });
    // pause when the mirror leaves the screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { if (!entry.isIntersecting && !video.paused) video.pause(); }, { threshold: 0.15 }).observe(film);
    }
  }

  /* ---------- the card viewer ---------- */
  const dialog = document.getElementById('visionneuse');
  if (dialog && typeof dialog.showModal === 'function') {
    const caption = document.getElementById('visionneuse-legende');
    const title = document.getElementById('visionneuse-titre');
    const image = document.getElementById('visionneuse-image');
    let opener = null;
    document.querySelectorAll('[data-lightbox]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        opener = link;
        title.textContent = link.dataset.title || 'La carte des soins';
        caption.textContent = link.dataset.caption || '';
        image.alt = 'Photo de la carte des soins et des tarifs affichée à l’institut';
        dialog.showModal();
      });
    });
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => opener?.focus());
  }
})();
