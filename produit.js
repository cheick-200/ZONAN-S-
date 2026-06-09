
/*la partie produit*/

const quantites = document.querySelectorAll(".quantite");

  function formatNum(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function calculerTotal() {
    let total = 0;
    let items = [];

    quantites.forEach(input => {
      let qte = parseInt(input.value) || 0;
      let prix = parseInt(input.dataset.prix) || 0;
      let nom = input.dataset.nom || input.closest(".product").querySelector(".product-name").innerText;
      if (qte > 0) {
        let sous = prix * qte;
        total += sous;
        items.push({ nom, qte, sous });
      }
    });

    const panierEl = document.getElementById("Panier");
    if (items.length === 0) {
      panierEl.innerHTML = '<div class="panier-empty">Aucun article sélectionné.</div>';
    } else {
      panierEl.innerHTML = items.map(i =>
        `<div class="item-line"><span>${i.nom} × ${i.qte}</span><span>${formatNum(i.sous)} FCFA</span></div>`
      ).join('');
    }

    document.getElementById("Total").innerText = formatNum(total);
    return { items, total };
  }

  quantites.forEach(input => input.addEventListener("input", calculerTotal));

  function envoyerCommande() {
    const { items, total } = calculerTotal();
    if (items.length === 0) { alert("Veuillez sélectionner au moins un produit."); return; }

    let msg = "Bonjour ! Je souhaite commander :%0A%0A";
    items.forEach(i => { msg += `• ${i.nom} × ${i.qte} = ${i.sous} FCFA%0A`; });
    msg += `%0A*Total : ${total} FCFA*`;
    window.open(`https://wa.me/22369613683?text=${msg}`);
  }

  function ouvrirPaiement() {
    const { items } = calculerTotal();
    if (items.length === 0) { alert("Veuillez sélectionner au moins un produit."); return; }
    document.getElementById("modalOverlay").classList.add("open");
  }

  function fermerModal() {
    document.getElementById("modalOverlay").classList.remove("open");
  }

  function fermerPaiement(e) {
    if (e.target === document.getElementById("modalOverlay")) fermerModal();
  }

  function confirmerPaiement() {
    const numero = document.getElementById("numeroClient").value.trim();
    if (!numero) { alert("Veuillez entrer votre numéro de téléphone."); return; }

    const methode = document.getElementById("methode").value;
    const { items, total } = calculerTotal();

    let msg = `Commande payée ✅%0AMode : ${methode}%0AClient : ${numero}%0A%0A`;
    items.forEach(i => { msg += `• ${i.nom} × ${i.qte} = ${i.sous} FCFA%0A`; });
    msg += `%0A*Total payé : ${total} FCFA*`;

    window.open(`https://wa.me/22369613683?text=${msg}`);
    fermerModal();
  }

 
 


 /*la partie storie*/


 const ADMIN_PASS = "1234"; /*le mote de pass*/

let sData = [];
try { sData = JSON.parse(localStorage.getItem('s_stories') || '[]'); } catch(e){}
let sIdx = 0, sTimer = null;
let sPendFile = null, sPendURL = null;
let sSelectedDays = 1;

function sSetDur(btn) {
  document.querySelectorAll('.s-dur-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  sSelectedDays = parseInt(btn.dataset.days);
}


function sCleanExpired() {
  const now = Date.now();
  const before = sData.length;
  sData = sData.filter(s => !s.expiresAt || now < s.expiresAt);
  if (sData.length !== before) sSave();
}


function sRender() {
  sCleanExpired();
  const row = document.getElementById('stories-circles');
  if (!row) return;
  row.innerHTML = '';
  sData.forEach((s, i) => {
    const b = document.createElement('div'); b.className = 's-bubble';
    b.style.animationDelay = (i*0.06)+'s';
    b.onclick = () => sOpenViewer(i);
    const ring = document.createElement('div'); ring.className = 's-ring';
    const inner = document.createElement('div'); inner.className = 's-inner';
    if (s.type==='image') { const img=document.createElement('img'); img.src=s.url; inner.appendChild(img); }
    else { const vid=document.createElement('video'); vid.src=s.url; vid.muted=true; inner.appendChild(vid); }
    ring.appendChild(inner);
    const lbl = document.createElement('div'); lbl.className = 's-label';
    lbl.textContent = s.caption || (s.type==='image'?'Photo':'Vidéo');
    b.appendChild(ring); b.appendChild(lbl);
    row.appendChild(b);
  });
}


function sOpenViewer(idx) {
  sIdx = idx;
  document.getElementById('s-viewer').classList.add('s-open');
  sBuildBars(); sShow(sIdx);
}
function storiesCloseViewer() {
  sStopTimer();
  document.getElementById('s-viewer').classList.remove('s-open');
  document.getElementById('s-vid').pause();
}
function sBuildBars() {
  const row = document.getElementById('s-prog-row'); row.innerHTML = '';
  sData.forEach(() => {
    const seg=document.createElement('div'); seg.className='s-prog-seg';
    const fill=document.createElement('div'); fill.className='s-prog-fill';
    seg.appendChild(fill); row.appendChild(seg);
  });
}
function sShow(idx) {
  sStopTimer();
  const s = sData[idx];
  const img=document.getElementById('s-img'), vid=document.getElementById('s-vid');
  document.getElementById('s-cap').textContent = s.caption||'';
  document.getElementById('s-date').textContent = s.date||'';
  document.querySelectorAll('.s-prog-fill').forEach((f,i)=>{
    f.style.animation='none'; f.classList.remove('s-active','s-done');
    if(i<idx) f.classList.add('s-done');
  });
  if (s.type==='image') {
    img.src=s.url; img.style.display='block'; vid.style.display='none'; vid.pause();
    const dur = (s.duration || 5) * 1000;
    sStartBar(idx, dur);
    sTimer = setTimeout(()=>storiesNext(), dur);
  } else {
    vid.src=s.url; vid.style.display='block'; img.style.display='none'; vid.play();
    vid.onloadedmetadata=()=>sStartBar(idx, vid.duration*1000);
    vid.onended=()=>storiesNext();
  }
}
function sStartBar(idx, dur) {
  const fills = document.querySelectorAll('.s-prog-fill');
  if (!fills[idx]) return;
  const f=fills[idx]; f.style.animation='none'; void f.offsetWidth;
  f.style.animationDuration=(dur/1000)+'s'; f.classList.add('s-active');
}
function sStopTimer() {
  clearTimeout(sTimer); sTimer=null;
  const vid=document.getElementById('s-vid'); vid.onended=null;
}
function storiesNext() {
  if(sIdx<sData.length-1){sIdx++;sShow(sIdx);}else{storiesCloseViewer();}
}
function storiesPrev() { sShow(sIdx>0?--sIdx:0); }


function storiesOpenLogin() {
  document.getElementById('s-login').classList.add('s-open');
  document.getElementById('s-pwd').value='';
  document.getElementById('s-err').textContent='';
  setTimeout(()=>document.getElementById('s-pwd').focus(),200);
}
function storiesCloseLogin(){ document.getElementById('s-login').classList.remove('s-open'); }
function storiesCheckPwd(){
  if(document.getElementById('s-pwd').value===ADMIN_PASS){
    storiesCloseLogin(); storiesOpenAdmin();
  } else {
    document.getElementById('s-err').textContent='❌ Mot de passe incorrect';
    document.getElementById('s-pwd').value='';
  }
}


function storiesOpenAdmin(){
  document.getElementById('s-admin').classList.add('s-open');
  sRenderList();
}
function storiesCloseAdmin(){
  document.getElementById('s-admin').classList.remove('s-open');
  sClearFile();
}
function sRenderList(){
  const list=document.getElementById('s-list');
  if(!sData.length){list.innerHTML='<div class="s-empty">Aucune story.</div>';return;}
  list.innerHTML='';
  sData.forEach((s,i)=>{
    let timeLeft = '';
    if (s.expiresAt) {
      const diff = s.expiresAt - Date.now();
      const heures = Math.floor(diff / (1000*60*60));
      const jours = Math.floor(heures / 24);
      if (diff <= 0) timeLeft = '⏰ Expirée';
      else if (jours >= 1) timeLeft = '⏳ ' + jours + 'j restant' + (jours>1?'s':'');
      else timeLeft = '⏳ ' + heures + 'h restante' + (heures>1?'s':'');
    }
    const row=document.createElement('div'); row.className='s-item';
    if(s.type==='image'){const img=document.createElement('img');img.src=s.url;row.appendChild(img);}
    else{const vid=document.createElement('video');vid.src=s.url;vid.muted=true;row.appendChild(vid);}
    const info=document.createElement('div'); info.className='s-item-info';
    info.innerHTML=`<div class="s-item-cap">${s.caption||'(sans légende)'}</div>
      <div class="s-item-meta">${s.type==='image'?'📷':'🎥'} ${s.date} · ${s.daysLabel||''} · <span style="color:#FFFC00">${timeLeft}</span></div>`;
    const del=document.createElement('button'); del.className='s-del'; del.textContent='Suppr.';
    del.onclick=()=>sDelete(i);
    row.appendChild(info); row.appendChild(del); list.appendChild(row);
  });
}
function sDelete(i){ if(!confirm('Supprimer ?'))return; sData.splice(i,1); sSave(); sRender(); sRenderList(); }


function sFileChosen(e){const f=e.target.files[0];if(f)sLoadFile(f);e.target.value='';}
function sDragOver(e){e.preventDefault();document.getElementById('s-dropzone').classList.add('s-drag');}
function sDragLeave(){document.getElementById('s-dropzone').classList.remove('s-drag');}
function sDrop(e){e.preventDefault();sDragLeave();const f=e.dataTransfer.files[0];if(f)sLoadFile(f);}
function sLoadFile(file){
  const r=new FileReader();
  r.onload=(ev)=>{
    sPendFile=file; sPendURL=ev.target.result;
    const isImg=file.type.startsWith('image/');
    const pi=document.getElementById('s-prev-img'), pv=document.getElementById('s-prev-vid');
    if(isImg){pi.src=sPendURL;pi.style.display='block';pv.style.display='none';}
    else{pv.src=sPendURL;pv.style.display='block';pi.style.display='none';}
    document.getElementById('s-prev-name').textContent=file.name;
    document.getElementById('s-prev-type').textContent=isImg?'📷 Photo':'🎥 Vidéo';
    document.getElementById('s-preview').classList.add('s-show');
    document.getElementById('s-pub-btn').disabled=false;
  };
  r.readAsDataURL(file);
}
function sClearFile(){
  sPendFile=null;sPendURL=null;
  document.getElementById('s-preview').classList.remove('s-show');
  document.getElementById('s-pub-btn').disabled=true;
}
function sPublish(){
  if(!sPendURL)return;
  const cap=document.getElementById('s-caption').value.trim();
  const isImg=sPendFile.type.startsWith('image/');
  const now=new Date();
  const expiresAt = Date.now() + sSelectedDays * 24 * 60 * 60 * 1000;
  const daysLabel = sSelectedDays === 1 ? '1 jour' : sSelectedDays + ' jours';
  sData.unshift({
    url: sPendURL,
    type: isImg ? 'image' : 'video',
    caption: cap,
    expiresAt: expiresAt,
    daysLabel: daysLabel,
    date: now.toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'})
  });
  document.getElementById('s-caption').value='';
  
  document.querySelectorAll('.s-dur-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('.s-dur-btn[data-days="1"]').classList.add('active');
  sSelectedDays=1;
  sClearFile(); sSave(); sRender(); sRenderList();
}
function sSave(){try{localStorage.setItem('s_stories',JSON.stringify(sData));}catch(e){alert('Stockage plein !');}}

sRender();
