(() => {
  const button = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('main-navigation');
  if (!button || !menu) return;
  const close = () => {
    menu.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation menu');
  };
  button.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !button.contains(event.target)) close();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', (event) => {
    if (event.matches) close();
  });
})();
