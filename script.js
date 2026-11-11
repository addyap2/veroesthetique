document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuToggle && navigation) {
  menuToggle.hidden = false;
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('.menu-label').textContent = 'Menu';
    navigation.classList.remove('is-open');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.menu-label').textContent = open ? 'Fermer' : 'Menu';
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
}

const imageDialog = document.querySelector('#image-dialog');
if (imageDialog && typeof imageDialog.showModal === 'function') {
  const image = imageDialog.querySelector('#dialog-image');
  const title = imageDialog.querySelector('#image-dialog-title');
  const caption = imageDialog.querySelector('#dialog-caption');
  const original = imageDialog.querySelector('#dialog-original');
  let previousFocus;
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      // Keep browser shortcuts and the original-image fallback available.
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      previousFocus = link;
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt || link.dataset.title;
      title.textContent = link.dataset.title;
      caption.textContent = link.dataset.caption || '';
      original.href = link.href;
      imageDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', event => {
    if (event.target !== imageDialog) return;
    const bounds = imageDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) imageDialog.close();
  });
  imageDialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    image.removeAttribute('src');
    previousFocus?.focus({preventScroll: true});
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
