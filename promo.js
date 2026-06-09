 /*le mot de passe*/
 
 const ADMIN_PASSWORD = '1234'; 

 
    let isLoggedIn = false;
    let promos = JSON.parse(localStorage.getItem('promos_v2') || '[]');
    let currentImgBase64 = null;

    // ===== LOGIN =====
    function askLogin() {
      if (isLoggedIn) { togglePanel(); return; }
      document.getElementById('loginModal').classList.add('active');
      document.getElementById('pwdInput').value = '';
      document.getElementById('loginError').style.display = 'none';
      setTimeout(() => document.getElementById('pwdInput').focus(), 200);
    }
    function closeLogin() {
      document.getElementById('loginModal').classList.remove('active');
    }
    function checkLogin() {
      const val = document.getElementById('pwdInput').value;
      if (val === ADMIN_PASSWORD) {
        isLoggedIn = true;
        closeLogin();
        document.getElementById('btnLogout').classList.add('visible');
        document.getElementById('btnAdmin').textContent = '⚙️ Panneau Admin';
        togglePanel();
      } else {
        document.getElementById('loginError').style.display = 'block';
        document.getElementById('pwdInput').value = '';
        document.getElementById('pwdInput').focus();
      }
    }
    function logout() {
      isLoggedIn = false;
      document.getElementById('adminPanel').classList.remove('open');
      document.getElementById('btnLogout').classList.remove('visible');
      document.getElementById('btnAdmin').textContent = '⚙️ Espace Admin';
    }
    function togglePanel() {
      const p = document.getElementById('adminPanel');
      p.classList.toggle('open');
      document.getElementById('btnAdmin').textContent =
        p.classList.contains('open') ? '✖ Fermer le panneau' : '⚙️ Panneau Admin';
    }

    
    function previewImg(input) {
      if (!input.files || !input.files[0]) return;
      const reader = new FileReader();
      reader.onload = e => {
        currentImgBase64 = e.target.result;
        const prev = document.getElementById('imgPreview');
        prev.src = currentImgBase64;
        prev.style.display = 'block';
      };
      reader.readAsDataURL(input.files[0]);
    }

    
    function fmt(n) { return Number(n).toLocaleString('fr-FR') + ' FCFA'; }
    function today() { return new Date().toISOString().split('T')[0]; }
    function statusOf(p) {
      const t = today();
      if (p.end && p.end < t) return 'expired';
      if (p.start && p.start > t) return 'upcoming';
      return 'active';
    }
    function save() { localStorage.setItem('promos_v2', JSON.stringify(promos)); }

    // ===== COUNTDOWN =====
    function buildCD(id, endDate) {
      if (!endDate) return '';
      return `<div class="countdown" id="cd-${id}">
        <div class="cd-block"><span class="cd-num" id="cdj-${id}">--</span><span class="cd-lbl">Jours</span></div>
        <div class="cd-block"><span class="cd-num" id="cdh-${id}">--</span><span class="cd-lbl">Heures</span></div>
        <div class="cd-block"><span class="cd-num" id="cdm-${id}">--</span><span class="cd-lbl">Min</span></div>
        <div class="cd-block"><span class="cd-num" id="cds-${id}">--</span><span class="cd-lbl">Sec</span></div>
      </div>`;
    }
    function tickAll() {
      promos.filter(p => statusOf(p) === 'active' && p.end).forEach(p => {
        const diff = new Date(p.end + 'T23:59:59') - Date.now();
        if (diff <= 0) return;
        const pad = v => String(Math.floor(v)).padStart(2,'0');
        const set = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = pad(v); };
        set('cdj-'+p.id, diff/86400000);
        set('cdh-'+p.id, (diff%86400000)/3600000);
        set('cdm-'+p.id, (diff%3600000)/60000);
        set('cds-'+p.id, (diff%60000)/1000);
      });
    }
    setInterval(tickAll, 1000);

    
    function renderPromos() {
      const grid = document.getElementById('promoGrid');
      const empty = document.getElementById('emptyState');
      grid.innerHTML = '';
      const active = promos.filter(p => statusOf(p) === 'active');
      if (active.length === 0) { empty.style.display = 'block'; return; }
      empty.style.display = 'none';

      active.forEach((p, i) => {
        const saving = p.oldPrice && p.newPrice
          ? Math.round((1 - p.newPrice / p.oldPrice) * 100) : null;
        const imgHtml = p.img
          ? `<img src="${p.img}" alt="${p.title}"/>`
          : `<div class="no-img">🎓</div>`;
        const expHtml = p.end
          ? `<div class="expires-row">⏳ Expire le ${new Date(p.end+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div>`
          : '';
        const priceHtml = p.newPrice ? `
          <div class="price-row">
            <span class="price-new">${fmt(p.newPrice)}</span>
            ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span>` : ''}
            ${saving ? `<span class="save-pill">-${saving}%</span>` : ''}
          </div>` : '';
        const ftHtml = p.formationType
          ? `<div style="display:inline-block;background:var(--g4);color:var(--g1);font-size:.72rem;font-weight:800;padding:3px 10px;border-radius:100px;margin-bottom:10px;">📚 ${p.formationType}</div>` : '';

        const card = document.createElement('div');
        card.className = 'promo-card';
        card.style.animationDelay = (i * 0.08) + 's';
        card.innerHTML = `
          <div class="card-img">
            ${imgHtml}
            ${p.badge ? `<div class="badge-float">${p.badge}</div>` : ''}
            <div class="flame-float">🔥</div>
          </div>
          <div class="card-body">
            <h3>${p.title}</h3>
            ${ftHtml}
            ${p.desc ? `<p class="desc">${p.desc}</p>` : ''}
            ${priceHtml}
            ${expHtml}
            ${buildCD(p.id, p.end)}
          </div>`;
        grid.appendChild(card);
      });
      setTimeout(tickAll, 100);
    }

    
    function renderAdmin() {
      const list = document.getElementById('adminList');
      if (promos.length === 0) {
        list.innerHTML = '<div class="admin-empty">Aucune promotion enregistrée.</div>';
        return;
      }
      list.innerHTML = promos.map(p => {
        const st = statusOf(p);
        const stLabel = { active:'🟢 Active', upcoming:'🟡 À venir', expired:'⚫ Expirée' }[st];
        const endTxt = p.end
          ? 'Fin : ' + new Date(p.end+'T00:00:00').toLocaleDateString('fr-FR')
          : 'Sans date de fin';
        const thumbHtml = p.img
          ? `<div class="ai-thumb"><img src="${p.img}" alt=""/></div>`
          : `<div class="ai-thumb">🎓</div>`;
        return `<div class="admin-item">
          ${thumbHtml}
          <div class="ai-info">
            <strong>${p.title}</strong>
            <span>${p.formationType ? '📚 '+p.formationType+' · ' : ''}${endTxt}</span>
          </div>
          <span class="ai-status ${st}">${stLabel}</span>
          <button class="btn-del" onclick="deletePromo('${p.id}')">🗑 Supprimer</button>
        </div>`;
      }).join('');
    }

    // ===== ADD PROMO =====
    function addPromo() {
      const title = document.getElementById('aTitle').value.trim();
      if (!title) { alert('⚠️ Le titre est obligatoire.'); return; }
      const start = document.getElementById('aStart').value || today();
      const end   = document.getElementById('aEnd').value;
      if (end && end < start) { alert('⚠️ La date de fin doit être après la date de début.'); return; }

      promos.push({
        id: Date.now().toString(),
        title,
        badge:         document.getElementById('aBadge').value.trim(),
        oldPrice:      document.getElementById('aOldPrice').value || null,
        newPrice:      document.getElementById('aNewPrice').value || null,
        formationType: document.getElementById('aFormationType').value || null,
        start, end: end || null,
        desc:          document.getElementById('aDesc').value.trim(),
        img:           currentImgBase64 || null,
      });
      save();

      
      ['aTitle','aBadge','aOldPrice','aNewPrice','aStart','aEnd','aDesc']
        .forEach(id => document.getElementById(id).value = '');
      document.getElementById('aFormationType').value = '';
      document.getElementById('aImage').value = '';
      document.getElementById('imgPreview').style.display = 'none';
      currentImgBase64 = null;

      renderAdmin();
      renderPromos();
    }

    
    function deletePromo(id) {
      if (!confirm('Supprimer cette promotion ?')) return;
      promos = promos.filter(p => p.id !== id);
      save();
      renderAdmin();
      renderPromos();
    }
    
    renderPromos();
    renderAdmin();