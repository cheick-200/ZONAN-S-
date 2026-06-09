
document.querySelectorAll('[data-slider]').forEach(wrap => {
  const slidesEl = wrap.querySelector('.slides');
  const dotsEl   = wrap.querySelector('.dots');
  const prevBtn  = wrap.querySelector('.prev');
  const nextBtn  = wrap.querySelector('.next');
  const total    = slidesEl.children.length;
  let current    = 0;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  }

  function goTo(n) {
    current = (n + total) % total;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  setInterval(() => goTo(current + 1), 4000);
});

/* ══ INSCRIPTION ══ */
let gType = '', gSub = '', gPay = '';

const meta = {
  individuel: { badge:'INDIVIDUEL',  title:'Inscription Individuelle', price:'50 000 FCFA', sub:true  },
  presentiel: { badge:'PRÉSENTIEL',  title:'Inscription Présentiel',   price:'25 000 FCFA', sub:false },
  enligne:    { badge:'EN LIGNE',    title:'Inscription En Ligne',     price:'25 000 FCFA', sub:false },
};

function openChoice() {
  document.getElementById('choiceOverlay').classList.add('active');
}
function closeChoice() {
  document.getElementById('choiceOverlay').classList.remove('active');
}
function bgClose(e, id) {
  if (e.target === document.getElementById(id)) closeChoice();
}

function openForm(type) {
  gType = type; gSub = ''; gPay = '';
  const m = meta[type];
  document.getElementById('fBadge').textContent = m.badge;
  document.getElementById('fTitle').textContent = m.title;
  document.getElementById('fPrice').textContent = m.price;
  document.getElementById('subSection').style.display = m.sub ? 'block' : 'none';
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.pay-card').forEach(p => p.classList.remove('active'));
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

function pickPay(el, name) {
  document.querySelectorAll('.pay-card').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  gPay = name;
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

  if (!nom || !prenom || !tel1 || !tel2 || !quartier) {
    alert('⚠️ Merci de remplir tous les champs : Nom, Prénom, Numéros et Quartier.'); return;
  }
  if (!gPay) { alert('⚠️ Veuillez sélectionner un mode de paiement.'); return; }
  if (gType === 'individuel' && !gSub) {
    alert('⚠️ Veuillez choisir le mode de suivi : Présentiel ou En Ligne.'); return;
  }

  const m = meta[gType];
  let typeAff = m.title;
  if (gType === 'individuel') typeAff += ' — ' + (gSub === 'presentiel' ? 'Présentiel' : 'En Ligne');

  const pieceInfo = piece ? piece.name : 'Non jointe';

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
    '🪪 *Pièce d\'identité :* ' + pieceInfo + '\n' +
    '💳 *Paiement :* ' + gPay + '\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '_Formulaire envoyé depuis le site d\'inscription_';

  window.open('https://wa.me/22669613683?text=' + encodeURIComponent(msg), '_blank');
}