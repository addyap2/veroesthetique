document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

requestAnimationFrame(() => document.body.classList.add('is-loaded'));

if (menuToggle && navigation) {
  menuToggle.hidden = false;
  const closeMenu = (returnFocus = false) => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('.menu-label').textContent = 'Menu';
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (returnFocus) menuToggle.focus();
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.menu-label').textContent = open ? 'Fermer' : 'Menu';
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());
}

const revealItems = document.querySelectorAll('.reveal, .reveal-image');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('in-view'));
}

document.querySelectorAll('.treatment-row').forEach(row => {
  row.addEventListener('toggle', () => {
    if (!row.open) return;
    document.querySelectorAll('.treatment-row[open]').forEach(other => {
      if (other !== row) other.open = false;
    });
  });
});

const threshold = document.querySelector('.threshold');
const parallaxItem = document.querySelector('[data-parallax]');
let scrollFrame = 0;

const updateScrollScenes = () => {
  scrollFrame = 0;
  const scrollY = window.scrollY;
  header?.classList.toggle('is-scrolled', scrollY > 48);

  if (!reducedMotion.matches && parallaxItem && scrollY < window.innerHeight * 1.2) {
    const strength = Number(parallaxItem.dataset.parallax || 0);
    parallaxItem.style.transform = `translate3d(0, ${scrollY * strength}px, 0)`;
  }

  if (!reducedMotion.matches && threshold) {
    const rect = threshold.getBoundingClientRect();
    const distance = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    const doorOpen = Math.min(1, Math.max(0, (progress - 0.18) / 0.66));
    threshold.style.setProperty('--door-open', doorOpen.toFixed(3));
  }
};

const queueScrollUpdate = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScrollScenes);
};
window.addEventListener('scroll', queueScrollUpdate, { passive: true });
window.addEventListener('resize', queueScrollUpdate, { passive: true });
updateScrollScenes();

const imageDialog = document.querySelector('#image-dialog');
if (imageDialog) {
  const image = imageDialog.querySelector('#dialog-image');
  const title = imageDialog.querySelector('#image-dialog-title');
  const caption = imageDialog.querySelector('#dialog-caption');
  const original = imageDialog.querySelector('#dialog-original');
  const hasNativeDialog = typeof imageDialog.showModal === 'function';
  let previousFocus;

  const openDialog = () => {
    if (hasNativeDialog) imageDialog.showModal();
    else {
      imageDialog.setAttribute('open', '');
      imageDialog.classList.add('is-fallback-modal');
    }
    document.body.classList.add('dialog-open');
  };

  const closeDialog = () => {
    if (hasNativeDialog) imageDialog.close();
    else {
      imageDialog.removeAttribute('open');
      imageDialog.classList.remove('is-fallback-modal');
      document.body.classList.remove('dialog-open');
      image.removeAttribute('src');
      previousFocus?.focus({ preventScroll: true });
    }
  };

  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      previousFocus = link;
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt || link.dataset.title;
      title.textContent = link.dataset.title;
      caption.textContent = link.dataset.caption || '';
      original.href = link.href;
      openDialog();
    });
  });

  imageDialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
  imageDialog.addEventListener('click', event => {
    if (event.target !== imageDialog) return;
    const bounds = imageDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && imageDialog.hasAttribute('open') && !hasNativeDialog) closeDialog();
  });
  imageDialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    image.removeAttribute('src');
    previousFocus?.focus({ preventScroll: true });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
