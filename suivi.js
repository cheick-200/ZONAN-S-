/* suivi.js — ZONZAN SÔ */

// ── HAMBURGER ──
(function () {
  const btn = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('mainNav');
  const ov  = document.getElementById('navOverlay');
  if (!btn) return;
  const open  = () => { btn.classList.add('open'); nav.classList.add('open'); ov?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { btn.classList.remove('open'); nav.classList.remove('open'); ov?.classList.remove('open'); document.body.style.overflow = ''; };
  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  ov?.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

// ── SLIDERS ──
document.querySelectorAll('[data-slider]').forEach(wrap => {
  const slidesEl = wrap.querySelector('.slides');
  const dotsEl   = wrap.querySelector('.dots');
  const leftBtn  = wrap.querySelector('.slider-arrow.left');
  const rightBtn = wrap.querySelector('.slider-arrow.right');
  const curEl    = wrap.querySelector('.cur');
  const total    = slidesEl.children.length;
  let current    = 0;
  let autoTimer  = null;

  // créer les dots
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsEl.appendChild(d);
  }

  function goTo(n) {
    current = (n + total) % total;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
    if (curEl) curEl.textContent = current + 1;
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  leftBtn?.addEventListener('click',  () => { goTo(current - 1); resetAuto(); });
  rightBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // swipe tactile
  let startX = 0;
  wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  resetAuto();
});

// ── MODALS ──
document.querySelectorAll('.open-form-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const overlay = document.getElementById(btn.dataset.modal);
    resetModal(overlay);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeOverlay(overlay);
  });
  overlay.querySelector('.close-btn')?.addEventListener('click', () => closeOverlay(overlay));
});

function closeOverlay(overlay) {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function resetModal(overlay) {
  overlay.querySelectorAll('input[type=text], input[type=tel]').forEach(i => i.value = '');
  overlay.querySelectorAll('select').forEach(s => s.value = '');
  overlay.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
}

// ── ENVOI MENSUEL ──
document.getElementById('modalMensuel').querySelector('.send-btn').addEventListener('click', () => {
  const m        = document.getElementById('modalMensuel');
  const nom      = m.querySelector('.f-nom').value.trim();
  const prenom   = m.querySelector('.f-prenom').value.trim();
  const tel1     = m.querySelector('.f-tel1').value.trim();
  const tel2     = m.querySelector('.f-tel2').value.trim();
  const quartier = m.querySelector('.f-quartier').value.trim();
  const mois     = m.querySelector('.f-mois').value;
  const paiement = m.querySelector('input[name="pay-m"]:checked')?.value || '';

  if (!nom || !prenom || !tel1 || !quartier) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  if (!mois)     { alert('Veuillez sélectionner un mois.'); return; }
  if (!paiement) { alert('Veuillez choisir un mode de paiement.'); return; }

  const msg =
    `📋 *FORMULAIRE DE SUIVI MENSUEL*\n` +
    `──────────────────\n` +
    `👤 *Nom :* ${nom}\n👤 *Prénom :* ${prenom}\n` +
    `📞 *Numéro 1 :* ${tel1}\n` +
    (tel2 ? `📞 *Numéro 2 :* ${tel2}\n` : '') +
    `📍 *Quartier :* ${quartier}\n` +
    `📅 *Mois choisi :* ${mois}\n` +
    `💳 *Paiement :* ${paiement}\n` +
    `──────────────────\n_Envoyé depuis ZONZAN SÔ_`;

  window.open(`https://wa.me/22369613683?text=${encodeURIComponent(msg)}`, '_blank');
});

// ── ENVOI JOURNALIER ──
document.getElementById('modalJournalier').querySelector('.send-btn').addEventListener('click', () => {
  const m        = document.getElementById('modalJournalier');
  const nom      = m.querySelector('.f-nom').value.trim();
  const prenom   = m.querySelector('.f-prenom').value.trim();
  const tel1     = m.querySelector('.f-tel1').value.trim();
  const tel2     = m.querySelector('.f-tel2').value.trim();
  const quartier = m.querySelector('.f-quartier').value.trim();
  const jour     = m.querySelector('.f-jour').value;
  const paiement = m.querySelector('input[name="pay-j"]:checked')?.value || '';

  if (!nom || !prenom || !tel1 || !quartier) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  if (!jour)     { alert('Veuillez sélectionner un jour.'); return; }
  if (!paiement) { alert('Veuillez choisir un mode de paiement.'); return; }

  const msg =
    `📋 *FORMULAIRE DE SUIVI JOURNALIER*\n` +
    `──────────────────\n` +
    `👤 *Nom :* ${nom}\n👤 *Prénom :* ${prenom}\n` +
    `📞 *Numéro 1 :* ${tel1}\n` +
    (tel2 ? `📞 *Numéro 2 :* ${tel2}\n` : '') +
    `📍 *Quartier :* ${quartier}\n` +
    `📅 *Jour choisi :* ${jour}\n` +
    `💳 *Paiement :* ${paiement}\n` +
    `──────────────────\n_Envoyé depuis ZONZAN SÔ_`;

  window.open(`https://wa.me/22369613683?text=${encodeURIComponent(msg)}`, '_blank');
});
