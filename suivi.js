
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


document.querySelectorAll('.open-form-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.modal;
    const overlay = document.getElementById(id);
    resetModal(overlay);
    overlay.classList.add('open');
  });
});

document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
  overlay.querySelector('.close-btn').addEventListener('click', () => {
    overlay.classList.remove('open');
  });
});


document.querySelectorAll('.pay-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.closest('.pay-grid').querySelectorAll('.pay-card');
    name.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    card.querySelector('input[type=radio]').checked = true;
  });
});


function resetModal(overlay) {
  overlay.querySelectorAll('input[type=text], input[type=tel]').forEach(i => i.value = '');
  overlay.querySelectorAll('select').forEach(s => s.value = '');
  overlay.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
  overlay.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
}


document.getElementById('modalMensuel').querySelector('.send-btn').addEventListener('click', () => {
  const m = document.getElementById('modalMensuel');
  const nom      = m.querySelector('.f-nom').value.trim();
  const prenom   = m.querySelector('.f-prenom').value.trim();
  const tel1     = m.querySelector('.f-tel1').value.trim();
  const tel2     = m.querySelector('.f-tel2').value.trim();
  const quartier = m.querySelector('.f-quartier').value.trim();
  const mois     = m.querySelector('.f-mois').value;
  const paiement = m.querySelector('input[name="pay-m"]:checked')?.value || '';

  if (!nom || !prenom || !tel1 || !quartier) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  if (!mois)     { alert('Veuillez sélectionner un mois.'); return; }
  if (!paiement) { alert('Veuillez choisir un type de paiement.'); return; }

  let msg = `📋 *FORMULAIRE DE SUIVI MENSUEL*\n`;
  msg += `──────────────────\n`;
  msg += `👤 *Nom :* ${nom}\n👤 *Prénom :* ${prenom}\n`;
  msg += `📞 *Numéro 1 :* ${tel1}\n`;
  if (tel2) msg += `📞 *Numéro 2 :* ${tel2}\n`;
  msg += `📍 *Quartier :* ${quartier}\n`;
  msg += `📅 *Mois choisi :* ${mois}\n`;
  msg += `💳 *Paiement :* ${paiement}\n`;

  window.open(`https://wa.me/22391610515?text=${encodeURIComponent(msg)}`, '_blank');
});


document.getElementById('modalJournalier').querySelector('.send-btn').addEventListener('click', () => {
  const m = document.getElementById('modalJournalier');
  const nom      = m.querySelector('.f-nom').value.trim();
  const prenom   = m.querySelector('.f-prenom').value.trim();
  const tel1     = m.querySelector('.f-tel1').value.trim();
  const tel2     = m.querySelector('.f-tel2').value.trim();
  const quartier = m.querySelector('.f-quartier').value.trim();
  const jour     = m.querySelector('.f-jour').value;
  const paiement = m.querySelector('input[name="pay-j"]:checked')?.value || '';

  if (!nom || !prenom || !tel1 || !quartier) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
  if (!jour)     { alert('Veuillez sélectionner un jour.'); return; }
  if (!paiement) { alert('Veuillez choisir un type de paiement.'); return; }

  let msg = `📋 *FORMULAIRE DE SUIVI JOURNALIER*\n`;
  msg += `──────────────────\n`;
  msg += `👤 *Nom :* ${nom}\n👤 *Prénom :* ${prenom}\n`;
  msg += `📞 *Numéro 1 :* ${tel1}\n`;
  if (tel2) msg += `📞 *Numéro 2 :* ${tel2}\n`;
  msg += `📍 *Quartier :* ${quartier}\n`;
  msg += `📅 *Jour choisi :* ${jour}\n`;
  msg += `💳 *Paiement :* ${paiement}\n`;

  window.open(`https://wa.me/22391610515?text=${encodeURIComponent(msg)}`, '_blank');
});