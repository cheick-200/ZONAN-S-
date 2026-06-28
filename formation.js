/* formation.js — ZONZAN SÔ */

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
  const slidesEl  = wrap.querySelector('.slides');
  const dotsEl    = wrap.querySelector('.dots');
  const leftBtn   = wrap.querySelector('.slider-arrow.left');
  const rightBtn  = wrap.querySelector('.slider-arrow.right');
  const curEl     = wrap.querySelector('.cur');
  const total     = slidesEl.children.length;
  let current     = 0;
  let autoTimer   = null;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsEl.appendChild(d);
  }

  function goTo(n) {
    current = (n + total) % total;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
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

// ── CHOICE MODAL ──
let gType = '', gSub = '', gPay = '';

const meta = {
  individuel: { badge: 'INDIVIDUEL',  title: 'Inscription Individuelle', price: '50 000 FCFA', sub: true  },
  presentiel: { badge: 'PRÉSENTIEL',  title: 'Inscription Présentiel',   price: '25 000 FCFA', sub: false },
  enligne:    { badge: 'EN LIGNE',    title: 'Inscription En Ligne',     price: '25 000 FCFA', sub: false },
};

function openChoice() {
  document.getElementById('choiceOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeChoice() {
  document.getElementById('choiceOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// fermer en cliquant hors de la card
document.getElementById('choiceOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('choiceOverlay')) closeChoice();
});

function openForm(type) {
  gType = type; gSub = ''; gPay = '';
  const m = meta[type];
  document.getElementById('fBadge').textContent  = m.badge;
  document.getElementById('fTitle').textContent  = m.title;
  document.getElementById('fPrice').textContent  = m.price;
  document.getElementById('subSection').style.display = m.sub ? 'block' : 'none';
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.pay-card').forEach(p => p.querySelector('input').checked = false);
  ['fNom','fPrenom','fTel1','fTel2','fQuartier'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pickedName').style.display = 'none';
  document.getElementById('fPiece').value = '';
  closeChoice();
  document.getElementById('formScreen').classList.add('active');
  document.getElementById('formScreen').scrollTop = 0;
}

function goBack() {
  document.getElementById('formScreen').classList.remove('active');
  openChoice();
}

function pickSub(s) {
  gSub = s;
  document.getElementById('subA').classList.toggle('active', s === 'presentiel');
  document.getElementById('subB').classList.toggle('active', s === 'enligne');
}

function showFile(input) {
  if (input.files && input.files[0]) {
    const el = document.getElementById('pickedName');
    el.style.display = 'block';
    el.textContent = '✅ ' + input.files[0].name;
  }
}

function envoyerWA() {
  const nom      = document.getElementById('fNom').value.trim();
  const prenom   = document.getElementById('fPrenom').value.trim();
  const tel1     = document.getElementById('fTel1').value.trim();
  const tel2     = document.getElementById('fTel2').value.trim();
  const quartier = document.getElementById('fQuartier').value.trim();
  const piece    = document.getElementById('fPiece').files[0];
  const payEl    = document.querySelector('input[name="pay"]:checked');

  if (!nom || !prenom || !tel1 || !tel2 || !quartier) {
    alert('⚠️ Merci de remplir tous les champs : Nom, Prénom, Numéros et Quartier.'); return;
  }
  if (!payEl) { alert('⚠️ Veuillez sélectionner un mode de paiement.'); return; }
  if (gType === 'individuel' && !gSub) {
    alert('⚠️ Veuillez choisir le mode de suivi : Présentiel ou En Ligne.'); return;
  }

  gPay = payEl.value;
  const m = meta[gType];
  let typeAff = m.title;
  if (gType === 'individuel') typeAff += ' — ' + (gSub === 'presentiel' ? 'Présentiel' : 'En Ligne');

  const msg =
    '🎓 *NOUVELLE INSCRIPTION — FORMATION*\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '📋 *Type :* ' + typeAff + '\n' +
    '💰 *Frais :* ' + m.price + '\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '👤 *Nom :* ' + nom + '\n' +
    '👤 *Prénom :* ' + prenom + '\n' +
    '📞 *Numéro 1 :* ' + tel1 + '\n' +
    '📞 *Numéro 2 :* ' + tel2 + '\n' +
    '📍 *Quartier :* ' + quartier + '\n' +
    '🪪 *Pièce :* ' + (piece ? piece.name : 'Non jointe') + '\n' +
    '💳 *Paiement :* ' + gPay + '\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '_Formulaire envoyé depuis ZONZAN SÔ_';

  window.open('https://wa.me/22669613683?text=' + encodeURIComponent(msg), '_blank');
}
