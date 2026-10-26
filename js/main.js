// Víno Olbramovice

// Rok v patičce se přepíná sám
document.getElementById('rok').textContent = new Date().getFullYear();

// Menu na mobilu
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menu-btn');

menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? 'Zavřít' : 'Menu';
});

menu.addEventListener('click', (e) => {
  if (e.target.tagName !== 'A') return;
  menu.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', false);
  menuBtn.textContent = 'Menu';
});

// Fotky apartmánů se otevřou ve větším
const viewer = document.getElementById('viewer');
const viewerImg = viewer.querySelector('img');

document.querySelectorAll('#gallery a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    viewerImg.src = link.href;
    viewerImg.alt = link.querySelector('img').alt;
    viewer.hidden = false;
  });
});

function closeViewer() {
  viewer.hidden = true;
}

viewer.addEventListener('click', (e) => {
  if (e.target !== viewerImg) closeViewer();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeViewer();
});

// Mapa okolí: výchozí je vinařství, po kliknutí na výlet ukáže to místo
const mapFrame = document.getElementById('map-frame');
const mapCaption = document.getElementById('map-caption');
const mapHome = document.getElementById('map-home');
const tripButtons = [...document.querySelectorAll('#trips button')];
const HOME = { q: '48.9946097,16.3922214', z: 15, text: mapCaption.textContent };

function showOnMap(q, z, text, active) {
  mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&hl=cs&output=embed`;
  mapCaption.textContent = text;
  mapHome.hidden = !active;
  tripButtons.forEach((b) => b.classList.toggle('is-on', b === active));
}

tripButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    showOnMap(btn.dataset.q, 13, btn.textContent, btn);
    // na mobilu je mapa pod seznamem, tak k ní posuneme
    const r = mapFrame.getBoundingClientRect();
    if (r.top < 70 || r.bottom > innerHeight) mapFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

mapHome.addEventListener('click', () => showOnMap(HOME.q, HOME.z, HOME.text, null));

// Poptávka: zatím bez serveru, otevře e-mail s vyplněným textem
const form = document.getElementById('poptavka');
const msg = form.querySelector('.form__msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const missing = [...form.querySelectorAll('[required]')].filter((f) => !f.value.trim());
  form.querySelectorAll('.chyba').forEach((f) => f.classList.remove('chyba'));
  if (missing.length) {
    missing.forEach((f) => f.classList.add('chyba'));
    missing[0].focus();
    msg.textContent = 'Vyplňte prosím jméno a kontakt, ať se vám můžeme ozvat.';
    return;
  }

  const d = Object.fromEntries(new FormData(form));
  const kdy = d.od ? new Date(d.od).toLocaleDateString('cs-CZ') : 'zatím nevím';
  const text = `Dobrý den,\n\nplánuji: ${d.typ}\nKdy: ${kdy}\nPočet lidí: ${d.osoby}\n\n${d.zprava}\n\n${d.jmeno}\n${d.kontakt}`;

  window.location.href = 'mailto:matous.vino@seznam.cz'
    + '?subject=' + encodeURIComponent('Poptávka z webu: ' + d.typ)
    + '&body=' + encodeURIComponent(text);
  msg.textContent = 'Otevřeli jsme vám e-mail s vyplněnou zprávou, stačí ho odeslat.';
});
