/* ===========================================================
   Spazio Armonia — main.js
   i18n, nav mobile, carrossel, toggle individual/grupo, accordion FAQ
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSplashIntro();
  initI18n();
  initMobileNav();
  initCarousel();
  initServiceModal();
  initFormatToggle();
  initAccordion();
  initProfessoraToggle();
  initResumeTabs();
  initScrollReveal();
  initHeaderScroll();
  initShowcase();
  initHeroPhotoStack();
  initTestimonialCarousel();
  initGalleryMarquee();
  initGalleryLightbox();
  initLogoWriteAnimation();
});

/* ============ HERO PHOTO STACK ============ */
function initHeroPhotoStack(){
  const stack = document.getElementById('heroPhotoStack');
  if (!stack) return;

  const photos = Array.from(stack.querySelectorAll('.hero-polaroid'));
  if (photos.length < 2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let zCounter = photos.length;
  // a foto 0 já está visível; a ordem gira por todas, incluindo ela de novo no fim do ciclo
  let order = photos.map((_, i) => i).slice(1).concat(0);

  function landPhoto(index){
    const photo = photos[index];
    zCounter += 1;
    photo.style.zIndex = zCounter;
    photo.classList.add('is-active');

    // reinicia a animação mesmo se a classe já tiver sido usada antes
    photo.classList.remove('is-landing');
    void photo.offsetWidth;
    photo.classList.add('is-landing');

    const onEnd = () => {
      photo.classList.remove('is-landing');
      photo.removeEventListener('animationend', onEnd);
    };
    photo.addEventListener('animationend', onEnd);
  }

  setInterval(() => {
    const next = order.shift();
    order.push(next);
    landPhoto(next);
  }, 5000);
}

/* ============ HEADER HIDE ON SCROLL DOWN ============ */
function initHeaderScroll(){
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('mainNav');
  if (!header) return;

  const threshold = 80;
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    if (nav && nav.classList.contains('open')){
      lastY = currentY;
      return;
    }

    if (currentY <= threshold){
      header.classList.remove('header-hidden');
    } else if (currentY > lastY){
      header.classList.add('header-hidden');
    } else if (currentY < lastY){
      header.classList.remove('header-hidden');
    }

    lastY = currentY;
  }, { passive:true });
}

/* ============ SHOWCASE — momentos da professora (não dos serviços) ============ */
/* Todas as fotos usam a mesma paleta da marca (tinta #144673, papel
   #F5F0DC) — aqui o card é sobre ELA, então a cor não muda por "tema
   de serviço" como antes; o que muda é a forma do selo (só variedade
   visual de scrapbook) e a legenda de cada foto. */
const SHOWCASE_INK = '#144673';
const SHOWCASE_TINT = 'rgba(20, 70, 115, 0.28)';
const SHOWCASE_BG_BACK = '#F5F0DC';
// coração — motivo pessoal/afetivo, igual para todas as fotos
const SHOWCASE_ICON = '<path d="M12 20.5S3.5 15.4 3.5 9.6C3.5 6.4 5.9 4.5 8.5 4.5c1.6 0 3 .9 3.5 2.2.5-1.3 1.9-2.2 3.5-2.2 2.6 0 5 1.9 5 5.1 0 5.8-8.5 10.9-8.5 10.9z"/>';

const SHOWCASE_THEMES = [
  {
    key: 'yoga',
    photo: 'assets/images/marina/marina-1992.webp',
    caption: 'Yoga',
    captionSub: 'Prática diária de equilíbrio',
    stickerRotate: -6,
    shape: 'circle',
    decorSize: { w: 84, h: 84 },
    stampBottom: '★ YOGA ★'
  },
  {
    key: 'musica',
    photo: 'assets/images/marina/marina-1994.webp',
    caption: 'Música',
    captionSub: 'Também se ensina aqui',
    stickerRotate: 7,
    shape: 'oval',
    decorSize: { w: 106, h: 76 },
    stampBottom: '★ MÚSICA ★'
  },
  {
    key: 'sicilia',
    photo: 'assets/images/marina/marina-1978.webp',
    caption: 'Sicília',
    captionSub: 'Entre templos gregos, na Itália',
    stickerRotate: -5,
    shape: 'rect',
    decorSize: { w: 112, h: 74 },
    stampBottom: '★ ITÁLIA ★'
  },
  {
    key: 'japao',
    photo: 'assets/images/marina/marina-2005.webp',
    caption: 'Japão',
    captionSub: 'Cerimônia do chá, de kimono',
    stickerRotate: 8,
    shape: 'stadium',
    decorSize: { w: 66, h: 100 },
    stampBottom: '★ JAPÃO ★'
  },
  {
    key: 'mar',
    photo: 'assets/images/marina/marina-1991.webp',
    caption: 'Beira-mar',
    captionSub: 'Um salto de alegria',
    stickerRotate: 9,
    shape: 'circle',
    decorSize: { w: 84, h: 84 },
    stampBottom: '★ VIAGEM ★'
  },
  {
    key: 'nepal',
    photo: 'assets/images/marina/marina-1993.webp',
    caption: 'Nepal',
    captionSub: 'Boudhanath, energia e cores',
    stickerRotate: -8,
    shape: 'oval',
    decorSize: { w: 106, h: 76 },
    stampBottom: '★ NEPAL ★'
  },
  {
    key: 'caiaque',
    photo: 'assets/images/marina/marina-2001.webp',
    caption: 'Caiaque',
    captionSub: 'Remando por uma caverna escondida',
    stickerRotate: 6,
    shape: 'rect',
    decorSize: { w: 112, h: 74 },
    stampBottom: '★ AVENTURA ★'
  },
  {
    key: 'granada',
    photo: 'assets/images/marina/marina-2006.webp',
    caption: 'Granada',
    captionSub: 'Um telhado com vista para a Alhambra',
    stickerRotate: -9,
    shape: 'stadium',
    decorSize: { w: 66, h: 100 },
    stampBottom: '★ ESPANHA ★'
  },
  {
    key: 'vietna',
    photo: 'assets/images/marina/marina-1999.webp',
    caption: 'Vietnã',
    captionSub: 'Entre montanhas de calcário',
    stickerRotate: 5,
    shape: 'circle',
    decorSize: { w: 84, h: 84 },
    stampBottom: '★ VIETNÃ ★'
  }
].map(theme => ({
  ...theme,
  tint: SHOWCASE_TINT,
  bgBack: SHOWCASE_BG_BACK,
  ink: SHOWCASE_INK,
  stampTop: 'SPAZIO ARMONIA',
  icon: SHOWCASE_ICON
}));

/* selo de viagem/adesivo de scrapbook — cada tema tem a SUA silhueta
   (oval, círculo, retângulo, cápsula), não um círculo genérico repetido.
   O papel creme e o contorno de tinta são desenhados dentro do próprio
   svg (por isso o drop-shadow em CSS acompanha a forma certinho). Formas
   redondas (oval/círculo) ganham texto curvado com <textPath>; formas
   retas (retângulo/cápsula) usam texto reto no topo/base. O filtro
   `stamp-rough` (definido no HTML, logo antes da seção) dá o acabamento de
   tinta gasta de carimbo em qualquer uma das formas. */
function buildStampSVG(theme, uid){
  const paper = '#fbf4e4';
  const ICON = `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${theme.icon}</g>`;

  if (theme.shape === 'oval'){
    return `
      <svg viewBox="0 0 130 92">
        <defs>
          <path id="arc-top-${uid}" d="M 14,54 A 53,35 0 0 1 116,54" fill="none"/>
          <path id="arc-bottom-${uid}" d="M 118,60 A 55,37 0 0 1 12,60" fill="none"/>
        </defs>
        <ellipse cx="65" cy="46" rx="61" ry="41" fill="none" stroke="${paper}" stroke-width="8"/>
        <ellipse cx="65" cy="46" rx="58" ry="38" fill="${paper}"/>
        <g filter="url(#stamp-rough)">
          <ellipse cx="65" cy="46" rx="58" ry="38" fill="none" stroke="currentColor" stroke-width="2.2"/>
          <ellipse cx="65" cy="46" rx="50" ry="31" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="0.5 4.2" stroke-linecap="round"/>
          <text font-family="'Permanent Marker', cursive" font-size="8" letter-spacing="0.4" fill="currentColor">
            <textPath href="#arc-top-${uid}" startOffset="50%" text-anchor="middle">${theme.stampTop}</textPath>
          </text>
          <text font-family="'Permanent Marker', cursive" font-size="6.6" letter-spacing="0.4" fill="currentColor">
            <textPath href="#arc-bottom-${uid}" startOffset="50%" text-anchor="middle">${theme.stampBottom}</textPath>
          </text>
          <g transform="translate(65 47) translate(-11 -11) scale(0.85)">${ICON}</g>
        </g>
      </svg>`;
  }

  if (theme.shape === 'rect'){
    return `
      <svg viewBox="0 0 140 92">
        <rect x="4" y="4" width="132" height="84" rx="9" fill="none" stroke="${paper}" stroke-width="8"/>
        <rect x="4" y="4" width="132" height="84" rx="9" fill="${paper}"/>
        <g filter="url(#stamp-rough)">
          <rect x="7" y="7" width="126" height="78" rx="7" fill="none" stroke="currentColor" stroke-width="2.2"/>
          <rect x="14" y="14" width="112" height="64" rx="4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="0.5 4.2" stroke-linecap="round"/>
          <text x="70" y="24" text-anchor="middle" font-family="'Permanent Marker', cursive" font-size="8.5" letter-spacing="0.4" fill="currentColor">${theme.stampTop}</text>
          <text x="70" y="72" text-anchor="middle" font-family="'Permanent Marker', cursive" font-size="7.5" letter-spacing="0.4" fill="currentColor">${theme.stampBottom}</text>
          <g transform="translate(70 47) translate(-11 -11) scale(0.85)">${ICON}</g>
        </g>
      </svg>`;
  }

  if (theme.shape === 'stadium'){
    return `
      <svg viewBox="0 0 92 140">
        <rect x="4" y="4" width="84" height="132" rx="42" fill="none" stroke="${paper}" stroke-width="8"/>
        <rect x="4" y="4" width="84" height="132" rx="42" fill="${paper}"/>
        <g filter="url(#stamp-rough)">
          <rect x="7" y="7" width="78" height="126" rx="39" fill="none" stroke="currentColor" stroke-width="2.2"/>
          <rect x="15" y="15" width="62" height="110" rx="31" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="0.5 4.2" stroke-linecap="round"/>
          <text x="46" y="30" text-anchor="middle" font-family="'Permanent Marker', cursive" font-size="7" letter-spacing="0.3" fill="currentColor">${theme.stampTop}</text>
          <text x="46" y="114" text-anchor="middle" font-family="'Permanent Marker', cursive" font-size="6.4" letter-spacing="0.3" fill="currentColor">${theme.stampBottom}</text>
          <g transform="translate(46 71) translate(-11 -11) scale(0.85)">${ICON}</g>
        </g>
      </svg>`;
  }

  // 'circle' (padrão)
  return `
    <svg viewBox="0 0 100 100">
      <defs>
        <path id="arc-top-${uid}" d="M 10,56 A 40,40 0 0 1 90,56" fill="none"/>
        <path id="arc-bottom-${uid}" d="M 92,60 A 42,42 0 0 1 8,60" fill="none"/>
      </defs>
      <circle cx="50" cy="50" r="48" fill="none" stroke="${paper}" stroke-width="8"/>
      <circle cx="50" cy="50" r="45" fill="${paper}"/>
      <g filter="url(#stamp-rough)">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2.2"/>
        <circle cx="50" cy="50" r="38.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="0.5 4.2" stroke-linecap="round"/>
        <text font-family="'Permanent Marker', cursive" font-size="8" letter-spacing="0.5" fill="currentColor">
          <textPath href="#arc-top-${uid}" startOffset="50%" text-anchor="middle">${theme.stampTop}</textPath>
        </text>
        <text font-family="'Permanent Marker', cursive" font-size="7" letter-spacing="0.5" fill="currentColor">
          <textPath href="#arc-bottom-${uid}" startOffset="50%" text-anchor="middle">${theme.stampBottom}</textPath>
        </text>
        <g transform="translate(50 50) translate(-11 -11) scale(0.92)">${ICON}</g>
      </g>
    </svg>`;
}

function initShowcase(){
  const stage = document.getElementById('showcaseStage');
  if (!stage) return;

  const back = document.getElementById('showcaseBack');
  const cube = document.getElementById('showcaseCube');
  const faceA = document.getElementById('showcaseFaceA');
  const faceB = document.getElementById('showcaseFaceB');
  const decorIcon = document.getElementById('showcaseDecorIcon');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FLIP_MS = 850;
  const DECOR_FADE_MS = 220;
  const INTERVAL_MS = 3000;

  let current = 0;
  let flipStep = 0;
  let frontFace = 'a';
  let timer = null;

  function faceMarkup(theme){
    return `
      <div class="showcase-face-photo">
        <img src="${theme.photo}" alt="" loading="lazy">
        <div class="showcase-face-tint" style="background-color:${theme.tint}"></div>
      </div>
      <div class="showcase-face-caption">
        <span class="showcase-face-caption-title">${theme.caption}</span>
        <span class="showcase-face-caption-sub">${theme.captionSub}</span>
      </div>`;
  }

  function paintFace(faceEl, theme){
    faceEl.innerHTML = faceMarkup(theme);
  }

  function paintDecor(theme){
    const mobileScale = window.matchMedia('(max-width: 640px)').matches ? 0.78 : 1;
    decorIcon.style.width = (theme.decorSize.w * mobileScale) + 'px';
    decorIcon.style.height = (theme.decorSize.h * mobileScale) + 'px';
    decorIcon.style.color = theme.ink;
    decorIcon.style.transform = `rotate(${theme.stickerRotate}deg)`;
    decorIcon.innerHTML = buildStampSVG(theme, theme.key);
  }

  function goTo(index){
    current = ((index % SHOWCASE_THEMES.length) + SHOWCASE_THEMES.length) % SHOWCASE_THEMES.length;
    const theme = SHOWCASE_THEMES[current];
    const hiddenFace = frontFace === 'a' ? faceB : faceA;

    paintFace(hiddenFace, theme);
    back.style.backgroundColor = theme.bgBack;

    if (reduceMotion){
      paintDecor(theme);
      frontFace = frontFace === 'a' ? 'b' : 'a';
      return;
    }

    flipStep += 1;
    cube.style.setProperty('--flip', (flipStep * 180) + 'deg');
    frontFace = frontFace === 'a' ? 'b' : 'a';

    setTimeout(() => decorIcon.classList.add('is-fading'), Math.max(0, FLIP_MS / 2 - DECOR_FADE_MS));
    setTimeout(() => {
      paintDecor(theme);
      decorIcon.classList.remove('is-fading');
    }, FLIP_MS / 2);
  }

  function start(){
    stop();
    if (reduceMotion) return;
    timer = setInterval(() => goTo(current + 1), INTERVAL_MS);
  }

  function stop(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  paintFace(faceA, SHOWCASE_THEMES[0]);
  paintDecor(SHOWCASE_THEMES[0]);
  start();
}

/* ============ I18N ============ */
function initI18n(){
  const STORAGE_KEY = 'spazio-armonia-lang';
  const supported = ['pt', 'en', 'it'];

  function detectDefaultLang(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && supported.includes(saved)) return saved;
    const nav = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    return supported.includes(nav) ? nav : 'pt';
  }

  function resolveKey(dict, key){
    return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
  }

  function applyLanguage(lang){
    const dict = translations[lang] || translations.pt;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = resolveKey(dict, el.getAttribute('data-i18n'));
      if (value !== undefined) el.textContent = value;
    });

    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
  });

  applyLanguage(detectDefaultLang());
}

/* ============ MOBILE NAV ============ */
function initMobileNav(){
  const hamburger = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('mainNav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============ CAROUSEL ============
   marquee automático controlado via JS (translateX + requestAnimationFrame), para poder
   combinar autoplay contínuo com arraste manual (mouse/touch) no mesmo track.
   O HTML só define um grupo de cards; aqui clonamos esse grupo quantas vezes for
   preciso até o conteúdo passar de 2x a largura da tela, garantindo loop sem "buraco"
   mesmo quando sobra espaço (poucos cards / telas largas). */
function initCarousel(){
  const marquee = document.getElementById('servicesCarousel');
  const track = document.getElementById('carouselTrack');
  if (!marquee || !track) return;

  const baseGroup = track.querySelector('.carousel-group');
  if (!baseGroup) return;

  function stripA11y(node){
    node.setAttribute('aria-hidden', 'true');
    node.querySelectorAll('[data-i18n]').forEach(el => el.removeAttribute('data-i18n'));
    node.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
  }

  function ensureEnoughGroups(){
    const groupWidth = baseGroup.getBoundingClientRect().width;
    if (!groupWidth) return;
    const minWidth = window.innerWidth * 2.5;
    while (track.scrollWidth < minWidth){
      const clone = baseGroup.cloneNode(true);
      stripA11y(clone);
      track.appendChild(clone);
    }
  }

  const SPEED = 40; // px por segundo
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let position = 0;
  let halfWidth = 0;
  let dragging = false;
  let dragMoved = false;
  let dragStartX = 0;
  let dragStartPosition = 0;
  let paused = false;
  let modalOpen = false;
  let lastTime = null;

  function recalc(){
    ensureEnoughGroups();
    halfWidth = track.scrollWidth / 2;
    wrap();
    render();
  }

  function wrap(){
    if (halfWidth <= 0) return;
    while (position <= -halfWidth) position += halfWidth;
    while (position > 0) position -= halfWidth;
  }

  function render(){
    track.style.transform = `translateX(${position}px)`;
  }

  function frame(time){
    if (lastTime === null) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    if (!dragging && !paused && !modalOpen && !prefersReducedMotion){
      position -= SPEED * dt;
      wrap();
      render();
    }

    requestAnimationFrame(frame);
  }

  /* pausa ao passar o mouse por cima (sem afetar o arraste) */
  marquee.addEventListener('mouseenter', () => { paused = true; });
  marquee.addEventListener('mouseleave', () => { if (!dragging) paused = false; });

  /* pausa enquanto o modal de detalhes da aula estiver aberto */
  document.addEventListener('service-modal:open', () => { modalOpen = true; });
  document.addEventListener('service-modal:close', () => { modalOpen = false; });

  /* arraste com mouse e touch */
  function dragStart(clientX){
    dragging = true;
    dragMoved = false;
    paused = true;
    dragStartX = clientX;
    dragStartPosition = position;
    track.classList.add('is-dragging');
  }

  function dragMove(clientX){
    if (!dragging) return;
    const deltaX = clientX - dragStartX;
    if (Math.abs(deltaX) > 4) dragMoved = true;
    position = dragStartPosition + deltaX;
    wrap();
    render();
  }

  function dragEnd(){
    if (!dragging) return;
    dragging = false;
    paused = false;
    track.classList.remove('is-dragging');

    /* evita que o "click" disparado ao soltar o arraste ative o link do badge */
    if (dragMoved){
      const suppressClick = e => {
        e.preventDefault();
        e.stopPropagation();
        marquee.removeEventListener('click', suppressClick, true);
      };
      marquee.addEventListener('click', suppressClick, true);
    }
  }

  marquee.addEventListener('mousedown', e => {
    e.preventDefault();
    dragStart(e.clientX);
  });
  window.addEventListener('mousemove', e => dragMove(e.clientX));
  window.addEventListener('mouseup', dragEnd);

  marquee.addEventListener('touchstart', e => dragStart(e.touches[0].clientX), { passive: true });
  marquee.addEventListener('touchmove', e => dragMove(e.touches[0].clientX), { passive: true });
  marquee.addEventListener('touchend', dragEnd);

  window.addEventListener('resize', recalc);

  recalc();
  requestAnimationFrame(frame);
}

/* ============ FORMAT TOGGLE (INDIVIDUAL x GRUPO) ============ */
function initFormatToggle(){
  const toggle = document.getElementById('formatToggle');
  if (!toggle) return;

  const buttons = toggle.querySelectorAll('.pill-btn');
  const panelIndividual = document.getElementById('panelIndividual');
  const panelGrupo = document.getElementById('panelGrupo');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const format = btn.getAttribute('data-format');
      panelIndividual.classList.toggle('active', format === 'individual');
      panelGrupo.classList.toggle('active', format === 'grupo');
    });
  });
}

/* ============ SCROLL REVEAL (fade-in on scroll) ============ */
function initScrollReveal(){
  const selectors = [
    '.hero-text', '.hero-photo',
    '.about-photo', '.about-text',
    '.showcase', '.professora-text',
    '.section-title', '.section-subtitle',
    '.pill-toggle', '.format-content', '.calcom-placeholder',
    '.how-item',
    '.clothesline-heading', '.clothesline-lead', '.clothesline-tagline', '.clothesline-pillars',
    '.location-text', '.location-map',
    '.accordion-item',
    '.contact-buttons .btn-contact'
  ];
  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  elements.forEach(el => el.classList.add('reveal'));

  /* stagger elements that share the same parent */
  const countByParent = new Map();
  elements.forEach(el => {
    const parent = el.parentElement;
    const count = countByParent.get(parent) || 0;
    el.style.transitionDelay = Math.min(count * 90, 360) + 'ms';
    countByParent.set(parent, count + 1);
  });

  if (!('IntersectionObserver' in window)){
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* ============ TOGGLE "Minhas especialidades" / "Certificações" ============ */
function initProfessoraToggle(){
  const group = document.querySelector('.professora-toggle-group');
  if (!group) return;

  const buttons = group.querySelectorAll('.professora-toggle-btn');
  const panels = document.querySelectorAll('.professora-panel-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-panel-target');

      buttons.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      panels.forEach(panel => {
        const isTarget = panel.getAttribute('data-panel') === target;
        panel.classList.toggle('is-active', isTarget);
        panel.hidden = !isTarget;
      });
    });
  });
}

/* ============ RESUME TABS (Education / Certifications) ============ */
function initResumeTabs(){
  document.querySelectorAll('.resume-tabs').forEach(tabs => {
    const wrapper = tabs.parentElement;
    const buttons = tabs.querySelectorAll('.resume-tab');
    const panels = wrapper.querySelectorAll('.resume-tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab-target');

        buttons.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        panels.forEach(panel => {
          const isTarget = panel.getAttribute('data-tab-panel') === target;
          panel.classList.toggle('is-active', isTarget);
          panel.hidden = !isTarget;
        });
      });
    });
  });
}

/* ============ ACCORDIONS (FAQ, especialidades, etc.) ============ */
function initAccordion(){
  document.querySelectorAll('.accordion').forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion-item');

    items.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');

      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        items.forEach(other => {
          other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.accordion-panel').style.maxHeight = null;
        });

        if (!isOpen){
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  });
}

/* ============ DEPOIMENTOS — carrossel de 1 card com autoplay em loop infinito ============ */
function initTestimonialCarousel(){
  const carousel = document.getElementById('testimonialCarousel');
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  if (!carousel || !track || !prevBtn || !nextBtn) return;

  const originalSlides = Array.from(track.children);
  const total = originalSlides.length;
  if (total <= 1){
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* sem animação, o "salto" do loop não é perceptível — troca simples por módulo,
     sem precisar clonar slides. */
  if (reducedMotion){
    let plainIndex = 0;
    const render = () => { track.style.transform = `translateX(-${plainIndex * 100}%)`; };
    const goTo = (target) => {
      plainIndex = ((target % total) + total) % total;
      render();
    };
    prevBtn.addEventListener('click', () => goTo(plainIndex - 1));
    nextBtn.addEventListener('click', () => goTo(plainIndex + 1));
    render();
    return;
  }

  /* clona o primeiro e o último slide para criar um loop sem "salto" visual:
     ao avançar do último, desliza normalmente até essa cópia do primeiro,
     depois pula sem transição para o slide real — o usuário nunca percebe. */
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[total - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  const TRANSITION = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';

  let index = 1; // posição 0 é o clone do último; slides reais vão de 1 a total
  let autoplayTimer = null;

  function jumpTo(targetIndex){
    track.style.transition = 'none';
    index = targetIndex;
    track.style.transform = `translateX(-${index * 100}%)`;
    void track.offsetWidth; // força reflow antes de reativar a transição
    track.style.transition = TRANSITION;
  }

  function goTo(targetIndex){
    index = targetIndex;
    track.style.transition = TRANSITION;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    if (index === total + 1) jumpTo(1);
    else if (index === 0) jumpTo(total);
  });

  function stopAutoplay(){
    if (autoplayTimer){
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(index + 1), 3000);
  }

  function restartAutoplay(){
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => {
    goTo(index - 1);
    restartAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goTo(index + 1);
    restartAutoplay();
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  jumpTo(1);
  startAutoplay();
}

/* ============ GALERIA — lightbox das polaroids via Fancybox ============
   o seletor usa "começa com" porque o varal infinito clona o mesmo conjunto de
   fotos em vários grupos ("galeria-0", "galeria-1"...) — ver initGalleryMarquee */
function initGalleryLightbox(){
  if (typeof Fancybox === 'undefined') return;

  Fancybox.bind('[data-fancybox^="galeria"]', {
    Carousel: {
      infinite: true,
    },
  });
}

/* ============ GALERIA — varal infinito, só arrastável (sem movimento sozinho) ============
   a trilha (.clothesline-track) começa com UM conjunto de fotos (marcado no HTML,
   funciona como fallback com scroll nativo se o JS não rodar). Aqui a gente clona
   esse conjunto quantas vezes forem necessárias pra cobrir a tela toda + uma folga,
   não importa o tamanho da janela — assim dá pra arrastar pra qualquer lado sem
   nunca esbarrar em espaço vazio. Cada cópia clonada ganha seu próprio grupo de
   lightbox (galeria-0, galeria-1...) pra não duplicar fotos dentro do mesmo álbum. */
function initGalleryMarquee(){
  const marquee = document.getElementById('galeriaMarquee');
  const track = document.getElementById('galeriaTrack');
  if (!marquee || !track) return;

  const baseSet = track.querySelector('.clothesline-set');
  if (!baseSet) return;

  let setWidth = 0;
  let pos = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartPos = 0;
  let dragMoved = 0;

  function relabelCopy(setEl, index){
    setEl.querySelectorAll('[data-fancybox]').forEach(a => {
      a.setAttribute('data-fancybox', `galeria-${index}`);
    });
  }

  /* garante cópias suficientes pra cobrir largura visível + 1 conjunto de folga,
     que é exatamente o espaço que a posição (sempre entre -setWidth e 0) pode
     revelar — recalculado no resize, porque a largura da tela pode mudar */
  function ensureCopies(){
    setWidth = baseSet.getBoundingClientRect().width;
    if (setWidth <= 0) return;

    const containerWidth = marquee.clientWidth;
    const needed = Math.max(2, Math.ceil(containerWidth / setWidth) + 1);
    let copies = track.querySelectorAll('.clothesline-set').length;

    while (copies < needed) {
      const clone = baseSet.cloneNode(true);
      relabelCopy(clone, copies);
      /* a cópia base pode ter a classe do fade-in-ao-rolar (.reveal); a cópia
         clonada nunca é observada pelo IntersectionObserver, então precisa
         nascer já totalmente visível, sem herdar esse estado "escondido" */
      clone.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal', 'is-visible'));
      track.appendChild(clone);
      bindClickGuard(clone);
      copies++;
    }
    while (copies > needed) {
      track.lastElementChild.remove();
      copies--;
    }
  }

  function wrap(){
    if (setWidth <= 0) return;
    while (pos <= -setWidth) pos += setWidth;
    while (pos > 0) pos -= setWidth;
  }

  function render(){
    track.style.transform = `translateX(${pos}px)`;
  }

  function pointerDown(e){
    dragging = true;
    dragMoved = 0;
    dragStartX = e.clientX;
    dragStartPos = pos;
    marquee.classList.add('is-dragging');
    /* de propósito SEM setPointerCapture: capturar o ponteiro faz o navegador
       redirecionar o clique nativo pro contêiner em vez da foto, e o Fancybox
       nunca recebe o clique. Em vez disso, escuta no window enquanto arrasta,
       pra continuar seguindo o mouse mesmo se ele sair da área do varal. */
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);
  }

  function pointerMove(e){
    if (!dragging) return;
    const delta = e.clientX - dragStartX;
    dragMoved = Math.max(dragMoved, Math.abs(delta));
    pos = dragStartPos + delta;
    wrap();
    render();
  }

  function pointerUp(){
    if (!dragging) return;
    dragging = false;
    marquee.classList.remove('is-dragging');
    window.removeEventListener('pointermove', pointerMove);
    window.removeEventListener('pointerup', pointerUp);
    window.removeEventListener('pointercancel', pointerUp);
  }

  /* arrastar não deve disparar o link/lightbox da foto — só um clique de verdade */
  function suppressClickAfterDrag(e){
    if (dragMoved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function bindClickGuard(scope){
    scope.querySelectorAll('.peg-photo a').forEach(a => {
      a.addEventListener('click', suppressClickAfterDrag);
    });
  }

  relabelCopy(baseSet, 0);
  bindClickGuard(baseSet);
  ensureCopies();
  marquee.classList.add('is-draggable');
  render();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { ensureCopies(); wrap(); render(); }, 150);
  });
  track.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', () => ensureCopies(), { once: true });
  });

  marquee.addEventListener('pointerdown', pointerDown);
  /* sem isso, clicar e arrastar em cima do link/imagem da foto dispara o
     "arrastar link" nativo do navegador em vez do nosso drag do varal */
  marquee.addEventListener('dragstart', e => e.preventDefault());
}

/* ============ MODAL DE DETALHES DA AULA ============
   abre ao clicar na foto de um card do carrossel. a foto do modal nasce com um
   efeito FLIP (First-Last-Invert-Play) a partir da posição/tamanho exatos da foto
   clicada, criando a sensação de "expansão contínua" em vez de um corte seco;
   o restante do card (badges, título, descrição) surge com fade logo em seguida. */
function initServiceModal(){
  const track = document.getElementById('carouselTrack');
  const modal = document.getElementById('serviceModal');
  if (!track || !modal) return;

  const box = document.getElementById('serviceModalBox');
  const img = document.getElementById('serviceModalImg');
  const badgesEl = document.getElementById('serviceModalBadges');
  const titleEl = document.getElementById('serviceModalTitle');
  const descEl = document.getElementById('serviceModalDesc');

  function categoryClassOf(card){
    const badgeLink = card.querySelector('.service-badge');
    if (!badgeLink) return '';
    return ['badge-italiano', 'badge-yoga', 'badge-musica'].find(c => badgeLink.classList.contains(c)) || '';
  }

  function openFromCard(card, sourcePhotoEl){
    const name = card.querySelector('.service-card-name');
    const role = card.querySelector('.service-card-role');
    const data = card.querySelector('.service-card-modal-data');
    const photoImg = card.querySelector('.service-card-photo img');
    if (!name || !role || !data || !photoImg) return;

    const categoryClass = categoryClassOf(card);
    const desc = data.querySelector('.modal-data-desc');
    const formato = data.querySelector('.modal-data-formato');
    const nivel = data.querySelector('.modal-data-nivel');

    img.src = photoImg.src;
    img.alt = photoImg.alt;
    titleEl.textContent = role.textContent;
    descEl.textContent = desc ? desc.textContent : '';

    badgesEl.innerHTML = '';
    const categoryPill = document.createElement('span');
    categoryPill.className = 'service-modal-badge-pill is-category ' + categoryClass;
    categoryPill.textContent = name.textContent;
    badgesEl.appendChild(categoryPill);

    if (formato && formato.textContent.trim()){
      const formatoPill = document.createElement('span');
      formatoPill.className = 'service-modal-badge-pill';
      formatoPill.textContent = formato.textContent;
      badgesEl.appendChild(formatoPill);
    }

    if (nivel && nivel.textContent.trim()){
      const nivelPill = document.createElement('span');
      nivelPill.className = 'service-modal-badge-pill';
      nivelPill.textContent = nivel.textContent;
      badgesEl.appendChild(nivelPill);
    }

    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.dispatchEvent(new CustomEvent('service-modal:open'));

    /* FLIP: mede a posição final da foto do modal e "inverte" a partir da foto de origem */
    const startRect = sourcePhotoEl.getBoundingClientRect();
    const endRect = img.getBoundingClientRect();
    const scaleX = startRect.width / endRect.width;
    const scaleY = startRect.height / endRect.height;
    const translateX = (startRect.left + startRect.width / 2) - (endRect.left + endRect.width / 2);
    const translateY = (startRect.top + startRect.height / 2) - (endRect.top + endRect.height / 2);

    img.style.transition = 'none';
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;

    // força reflow antes de animar de volta à posição final
    img.getBoundingClientRect();

    requestAnimationFrame(() => {
      img.style.transition = 'transform 0.55s cubic-bezier(.2, .8, .2, 1)';
      img.style.transform = 'translate(0, 0) scale(1, 1)';
    });
  }

  function closeModal(){
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.dispatchEvent(new CustomEvent('service-modal:close'));
  }

  /* delegação no track: funciona também para os grupos de cards clonados pelo carrossel */
  track.addEventListener('click', e => {
    const photo = e.target.closest('.service-card-photo');
    if (!photo) return;
    const card = photo.closest('.service-card');
    if (!card) return;
    openFromCard(card, photo);
  });

  modal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ============ ANIMAÇÃO "ESCREVENDO À MÃO" DO LOGO (reutilizada pela seção
   Sobre — scroll — e pela splash de abertura — carregamento) ============ */

/* Prepara qualquer clone/instância do SVG do logo para ser "desenhado":
   esconde ícone + letras sem transition, força o navegador a commitar esse
   estado, só então anexa as transitions com o delay de cada traço. Devolve
   play() (dispara a revelação) e duration (ms até a animação terminar
   sozinha, calculado a partir da quantidade real de traços). */
function prepareLogoDraw(svg, opts){
  const iconPaths = Array.from(svg.querySelectorAll('path.cls-1, path.cls-2, path.cls-3'));
  const wordPaths = Array.from(svg.querySelectorAll('path.cls-4'));
  if (!iconPaths.length && !wordPaths.length) return null;

  opts = opts || {};
  const STROKE_DURATION = opts.strokeDuration || 0.5;   /* segundos por traço de letra */
  const STROKE_STAGGER = opts.strokeStagger || 0.16;     /* intervalo entre uma letra e a próxima */
  const FILL_DURATION = opts.fillDuration || 0.35;       /* tempo do "tinteiro" preenchendo a letra */
  const ICON_STAGGER = opts.iconStagger || 0.08;
  const ICON_DURATION = opts.iconDuration || 0.5;
  const ICON_START = 0;                                  /* ícone começa a aparecer imediatamente */
  const WORDS_START = opts.wordsStart != null ? opts.wordsStart : ICON_START + 0.5; /* palavras começam a se desenhar logo depois */

  /* PASSO 1: aplica o estado escondido SEM transition ainda — se a transition
     fosse anexada junto, o navegador já dispararia a animação na hora (do
     valor padrão visível para o escondido), assim que a página carregasse. */
  iconPaths.forEach(path => {
    path.classList.add('logo-icon-path');
    path.style.transition = 'none';
    path.style.opacity = '0';
  });

  const wordInfo = wordPaths.map(path => {
    let length = 0;
    try { length = path.getTotalLength(); } catch (e) { length = 0; }

    path.style.transition = 'none';
    path.style.stroke = getComputedStyle(path).fill;
    path.style.strokeWidth = '2.4px';
    path.style.strokeLinecap = 'round';
    path.style.strokeLinejoin = 'round';
    path.style.fillOpacity = '0';
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    return path;
  });

  /* PASSO 2: força o navegador a "commitar" o estado escondido antes de
     anexar a transition — só a partir daqui uma mudança de valor anima. */
  void svg.getBoundingClientRect();

  /* PASSO 3: agora sim anexa as transitions com o delay de cada letra/traço */
  iconPaths.forEach((path, i) => {
    path.style.transition = 'opacity ' + ICON_DURATION + 's ease ' + (ICON_START + i * ICON_STAGGER) + 's';
  });

  let lastWordFinish = 0;
  wordInfo.forEach((path, i) => {
    const strokeDelay = WORDS_START + i * STROKE_STAGGER;
    const fillDelay = strokeDelay + STROKE_DURATION * 0.75;
    path.style.transition =
      'stroke-dashoffset ' + STROKE_DURATION + 's ease ' + strokeDelay + 's, ' +
      'fill-opacity ' + FILL_DURATION + 's ease ' + fillDelay + 's';
    lastWordFinish = Math.max(lastWordFinish, fillDelay + FILL_DURATION);
  });

  const lastIconFinish = iconPaths.length
    ? ICON_START + (iconPaths.length - 1) * ICON_STAGGER + ICON_DURATION
    : 0;

  svg.classList.add('logo-draw-ready');

  function play(){
    svg.classList.add('logo-draw-active');
    iconPaths.forEach(path => { path.style.opacity = '1'; });
    wordInfo.forEach(path => {
      path.style.strokeDashoffset = '0';
      path.style.fillOpacity = '1';
    });
  }

  return { play, duration: Math.max(lastWordFinish, lastIconFinish) * 1000 };
}

function initLogoWriteAnimation(){
  const svg = document.getElementById('sobreLogo');
  if (!svg) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; /* mantém o logo estático, sem animação */

  const draw = prepareLogoDraw(svg);
  if (!draw) return;

  if (!('IntersectionObserver' in window)){
    draw.play();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        draw.play();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(svg);
}

/* ============ SPLASH DE ABERTURA (só na primeira visita) ============ */
function initSplashIntro(){
  /* o script inline no <head> pode ter escondido a página (document.documentElement)
     pra evitar o flash "site → splash → site" — revela de volta em TODO caminho
     que não termina inserindo o overlay (o overlay é que passa a cobrir a tela). */
  function revealPage(){
    document.documentElement.style.visibility = '';
  }

  const sourceSvg = document.getElementById('sobreLogo');
  if (!sourceSvg){ revealPage(); return; }

  const params = new URLSearchParams(window.location.search);
  const forcePreview = params.get('intro') === '1'; /* ?intro=1 força rever a splash em testes */

  const STORAGE_KEY = 'spazioIntroSeen';

  function introAlreadySeen(){
    if (forcePreview) return false;
    try {
      return window.localStorage && window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return true; /* storage indisponível (modo privado, política do navegador) → nunca bloqueia o site */
    }
  }

  function markIntroSeen(){
    if (forcePreview) return;
    try { window.localStorage && window.localStorage.setItem(STORAGE_KEY, '1'); }
    catch (e) { /* não é crítico se não conseguir gravar */ }
  }

  if (introAlreadySeen()){ revealPage(); return; }

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion){
    markIntroSeen(); /* não mostra a splash, mas não pergunta de novo nesse navegador */
    revealPage();
    return;
  }

  /* clona o SVG ANTES de initLogoWriteAnimation() (chamada por último) mexer
     no #sobreLogo original — assim a splash sempre parte de um SVG "limpo" */
  const splashSvg = sourceSvg.cloneNode(true);
  splashSvg.removeAttribute('id');
  splashSvg.setAttribute('id', 'splashLogo');
  splashSvg.classList.remove('sobre-watermark');

  const overlay = document.createElement('div');
  overlay.id = 'splashIntro';
  overlay.className = 'splash-intro';
  overlay.setAttribute('role', 'presentation');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.appendChild(splashSvg);

  document.body.insertBefore(overlay, document.body.firstChild);
  document.body.style.overflow = 'hidden';
  revealPage(); /* seguro agora — o overlay já está no DOM cobrindo a tela */

  /* Timing só pra splash — a versão da seção Sobre continua no ritmo
     original (chamada sem opts em initLogoWriteAnimation). Pra ajustar a
     velocidade, mexa nesses números: aumentar deixa mais lento/dramático,
     diminuir deixa mais rápido. */
  const draw = prepareLogoDraw(splashSvg, {
    strokeDuration: 0.28,   /* tempo de traço por letra */
    strokeStagger: 0.09,    /* intervalo entre uma letra e a próxima */
    fillDuration: 0.22,     /* tempo do "tinteiro" preenchendo a letra */
    iconDuration: 0.6,      /* fade do ícone ARMONIA */
    iconStagger: 0.05,
    wordsStart: 0.35        /* espera antes de começar a desenhar as letras */
  });
  if (!draw){
    overlay.remove();
    document.body.style.overflow = '';
    markIntroSeen();
    return;
  }

  const HOLD_AFTER_DRAW = 350;    /* segura o logo completo por um instante antes de fechar sozinho */
  const FADE_DURATION = 550;      /* duração do fade de saída */
  const SAFETY_TIMEOUT = draw.duration + 2000; /* rede de segurança bem depois do fim natural */

  let closed = false;
  let naturalEndTimer;
  let safetyTimer;

  function closeOnce(){
    if (closed) return;
    closed = true;
    clearTimeout(naturalEndTimer);
    clearTimeout(safetyTimer);
    document.removeEventListener('keydown', onKeydown);
    overlay.removeEventListener('click', closeOnce);
    document.body.style.overflow = '';
    markIntroSeen();

    overlay.classList.add('is-closing');
    /* transitionend borbulha das letras do SVG ainda em desenho (fill-opacity,
       stroke-dashoffset) — só remove no transitionend que é do PRÓPRIO overlay */
    overlay.addEventListener('transitionend', e => {
      if (e.target === overlay) overlay.remove();
    });
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, FADE_DURATION + 150); /* rede caso transitionend não dispare */
  }

  function onKeydown(e){
    if (e.key === 'Escape') closeOnce();
  }

  overlay.addEventListener('click', closeOnce);
  document.addEventListener('keydown', onKeydown);

  naturalEndTimer = setTimeout(closeOnce, draw.duration + HOLD_AFTER_DRAW);
  safetyTimer = setTimeout(closeOnce, SAFETY_TIMEOUT);

  draw.play();
}
