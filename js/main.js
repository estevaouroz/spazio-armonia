/* ===========================================================
   Spazio Armonia — main.js
   i18n, nav mobile, carrossel, toggle individual/grupo, accordion FAQ
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
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

/* ============ SHOWCASE — cópia exata do demo-showcase-card-polaroid.html ============ */
const SHOWCASE_THEMES = [
  {
    key: 'yoga',
    photo: 'https://picsum.photos/seed/showcase-yoga/500/700',
    tint: 'rgba(11, 110, 106, 0.38)',
    bgBack: '#eafffa',
    caption: 'Yoga',
    captionSub: 'Bem-estar',
    ink: '#0b6e6a',
    stickerRotate: -8,
    shape: 'oval',
    decorSize: { w: 106, h: 76 },
    stampTop: 'SPAZIO ARMONIA',
    stampBottom: '★ BEM-ESTAR ★',
    // bússola — motivo de "jornada/momento", não um pictograma de yoga
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 6.5 14 12 12 17.5 10 12z" fill="currentColor" stroke="none"/>'
  },
  {
    key: 'musica',
    photo: 'https://picsum.photos/seed/showcase-musica/500/700',
    tint: 'rgba(110, 19, 48, 0.38)',
    bgBack: '#ffe3ea',
    caption: 'Música',
    captionSub: 'Ritmo & som',
    ink: '#6e1330',
    stickerRotate: 6,
    shape: 'circle',
    decorSize: { w: 84, h: 84 },
    stampTop: 'SPAZIO ARMONIA',
    stampBottom: '★ RITMO & SOM ★',
    icon: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'
  },
  {
    key: 'italiano',
    photo: 'https://picsum.photos/seed/showcase-italiano/500/700',
    tint: 'rgba(193, 68, 14, 0.38)',
    bgBack: '#fff3e6',
    caption: 'Italiano',
    captionSub: 'Língua e cultura',
    ink: '#c1440e',
    stickerRotate: -5,
    shape: 'rect',
    decorSize: { w: 112, h: 74 },
    stampTop: 'SPAZIO ARMONIA',
    stampBottom: '★ ITALIA ★',
    // torre de Pisa bem simplificada, levemente tombada
    icon: '<g transform="rotate(9 12 13)"><rect x="9" y="3" width="6" height="2.6" rx="0.6"/><rect x="8" y="6.2" width="8" height="12.6" rx="1"/><rect x="6.4" y="19.2" width="11.2" height="2.4" rx="0.6"/></g>'
  },
  {
    key: 'comunidade',
    photo: 'https://picsum.photos/seed/showcase-comunidade/500/700',
    tint: 'rgba(95, 138, 18, 0.38)',
    bgBack: '#f2ffe0',
    caption: 'Comunidade',
    captionSub: 'Junte-se a nós',
    ink: '#5f8a12',
    stickerRotate: 9,
    shape: 'stadium',
    decorSize: { w: 66, h: 100 },
    stampTop: 'SPAZIO ARMONIA',
    stampBottom: '★ COMUNIDADE ★',
    // coração — memória/afeto, mais pessoal do que um ícone de "grupo"
    icon: '<path d="M12 20.5S3.5 15.4 3.5 9.6C3.5 6.4 5.9 4.5 8.5 4.5c1.6 0 3 .9 3.5 2.2.5-1.3 1.9-2.2 3.5-2.2 2.6 0 5 1.9 5 5.1 0 5.8-8.5 10.9-8.5 10.9z"/>'
  }
];

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
    '.service-card',
    '.pill-toggle', '.format-content', '.calcom-placeholder',
    '.how-item',
    '.clothesline-heading', '.clothesline-lead', '.peg-photo', '.clothesline-tagline', '.clothesline-pillars',
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
