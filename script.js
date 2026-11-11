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
  const heroPhoto = document.querySelector('.seuil-photo');
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
        if (el.hasAttribute('data-porte')) return porteScroll > 0.72 ? 'light' : 'dark';
        if (el.dataset.tone === 'scene') return Number(el.style.getPropertyValue('--e') || 0) > 0.55 ? 'dark' : 'light';
        return el.dataset.tone === 'dark' ? 'dark' : 'light';
      }
    }
    return 'light';
  };

  let lastMinute = -1;
  let porteScroll = 0;
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
      if (porte) {
        const pr = porte.getBoundingClientRect();
        porteScroll = clamp(-pr.top / Math.max(1, pr.height - vh));
      }
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

  /* ---------- the hero door: intro swing, pointer, scroll-through ---------- */
  if (porte && !reduced.matches) {
    const seuil = porte.querySelector('[data-seuil]');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const easeOut = t => 1 - Math.pow(1 - t, 4);
    let t0 = 0, tx = 0, ty = 0, cx = 0, cy = 0, hover = 0, ch = 0, s = 0, running = false, visible = true;

    porte.addEventListener('pointermove', e => {
      if (!fine.matches) return;
      tx = e.clientX / window.innerWidth - .5;
      ty = e.clientY / window.innerHeight - .5;
    });
    porte.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
    seuil.addEventListener('pointerenter', () => { if (fine.matches) hover = 1; });
    seuil.addEventListener('pointerleave', () => { hover = 0; });

    const frame = now => {
      if (!t0) t0 = now;
      const intro = easeOut(clamp((now - t0 - 450) / 1800));
      cx += (tx - cx) * .06; cy += (ty - cy) * .06; ch += (hover - ch) * .08;
      s += (porteScroll - s) * .2;
      const angle = 2 + intro * 66 + ch * 8 + s * 40 + cx * 10 * intro;
      porte.style.setProperty('--angle', angle.toFixed(2) + 'deg');
      porte.style.setProperty('--open', clamp(angle / 100).toFixed(3));
      porte.style.setProperty('--s', s.toFixed(4));
      porte.style.setProperty('--tx', cx.toFixed(4));
      porte.style.setProperty('--ty', cy.toFixed(4));
      if (visible) requestAnimationFrame(frame); else running = false;
    };
    const start = () => { if (!running) { running = true; requestAnimationFrame(frame); } };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && body.classList.contains('is-ready')) start(); }).observe(porte);
    }
    const waitReady = () => body.classList.contains('is-ready') ? start() : requestAnimationFrame(waitReady);
    waitReady();

    /* dust motes drifting in the sunlit doorway */
    const canvas = porte.querySelector('.poussiere');
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      const motes = Array.from({ length: 42 }, () => ({ x: Math.random(), y: Math.random(), r: .4 + Math.random() * 1.6, v: .00008 + Math.random() * .00022, a: Math.random() * Math.PI * 2, w: .3 + Math.random() * .7 }));
      let w = 0, h = 0;
      const size = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      size(); window.addEventListener('resize', size);
      let last = 0;
      const dust = now => {
        const dt = Math.min(64, now - (last || now)); last = now;
        ctx.clearRect(0, 0, w, h);
        for (const m of motes) {
          m.y -= m.v * dt; m.a += dt * .0006; m.x += Math.sin(m.a) * .00012 * dt;
          if (m.y < -.02) { m.y = 1.02; m.x = Math.random(); }
          const flicker = .45 + .55 * Math.sin(m.a * 2.3 + m.w * 9);
          ctx.globalAlpha = .55 * m.w * flicker;
          ctx.fillStyle = '#fff1d6';
          ctx.beginPath(); ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2); ctx.fill();
        }
        if (visible) requestAnimationFrame(dust); else last = 0, requestAnimationFrame(wake);
      };
      const wake = () => visible ? requestAnimationFrame(dust) : setTimeout(() => requestAnimationFrame(wake), 400);
      requestAnimationFrame(dust);
    }
  }

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
