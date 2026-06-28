
(function () {
  const btn     = document.getElementById('hamburgerBtn');
  const nav     = document.getElementById('mainNav');
  const overlay = document.getElementById('navOverlay');

  if (!btn || !nav) return;

  function open() {
    btn.classList.add('open');
    nav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    btn.classList.remove('open');
    nav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () =>
    btn.classList.contains('open') ? close() : open()
  );

  if (overlay) overlay.addEventListener('click', close);

  
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();
