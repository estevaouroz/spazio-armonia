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
  initAgenda();
  initAccordion();
  initProfessoraToggle();
  initResumeTabs();
  initScrollReveal();
  initStickerStamp();
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

  /* "is-top": ainda dentro do hero (topo da página) — outras partes do
     header.css podem usar esse estado pra ajustes visuais específicos do
     topo; ao rolar pra outras seções, some. */
  const updateTopState = (y) => {
    header.classList.toggle('is-top', y <= threshold);
  };
  updateTopState(lastY);

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    updateTopState(currentY);

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
    photo: 'assets/images/marina/marina-2029.webp',
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

    // botões só com ícone traduzem o aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const value = resolveKey(dict, el.getAttribute('data-i18n-aria'));
      if (value !== undefined) el.setAttribute('aria-label', value);
    });

    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // partes montadas pelo JS (ex.: a agenda) se redesenham no idioma novo
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
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

  const header = document.querySelector('.site-header');

  function setOpen(isOpen){
    nav.classList.toggle('open', isOpen);
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));

    /* trava o scroll da página por trás do overlay e garante que o header
       (que pode estar escondido por scroll, ver initHeaderScroll) fique
       sempre visível e parado enquanto o menu está aberto — sem isso, um
       header já com transform: translateY(-130%) arrasta o #mainNav (que
       vive dentro dele) junto, já que um ancestral com transform vira o
       containing block de um filho position: fixed. */
    document.documentElement.style.overflow = isOpen ? 'hidden' : '';
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (header) header.classList.toggle('nav-open', isOpen);
  }

  hamburger.addEventListener('click', () => {
    setOpen(!nav.classList.contains('open'));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
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

      // avisa a agenda (initAgenda) pra filtrar pelo formato escolhido
      toggle.dispatchEvent(new CustomEvent('formatchange', { detail: { format } }));
    });
  });
}

/* ============ ADESIVOS (efeito "carimbada" ao entrar na tela) ============ */
/* os adesivos (.adesivo e os .footer-decor do rodapé) ficam escondidos até
   aparecerem na tela e aí "batem" na página — ver @keyframes sticker-stamp em
   home.css. Sem JS (ou com movimento reduzido) eles só ficam visíveis. */
function initStickerStamp(){
  const stickers = document.querySelectorAll('.adesivo, .footer-decor');
  if (!stickers.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  stickers.forEach((el, i) => {
    el.classList.add('stamp-ready');
    // atraso levemente diferente pra cada um, pra dois adesivos da mesma seção não baterem juntos
    el.style.animationDelay = (120 + (i % 3) * 180) + 'ms';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-stamped');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  stickers.forEach(el => observer.observe(el));
}

/* ============ AGENDA VIVA (aulas do Google Calendar da escola) ============ */
/* mostra a semana com as aulas do calendário da escola, lidas da Netlify
   Function /api/aulas (que consulta o Google Calendar na hora), e inscreve a
   pessoa numa aula experimental via /api/agendar. Os filtros combinam o toggle
   Individual/Grupo (formato) com as matérias. Atualiza sozinha a cada minuto
   enquanto a seção está na tela, pra vagas e aulas novas aparecerem. */
function initAgenda(){
  const root = document.getElementById('agendaViva');
  if (!root) return;

  const TZ = 'America/Sao_Paulo';
  const LOCALES = { pt: 'pt-BR', en: 'en-GB', it: 'it-IT' };
  const DAY = 86400000;
  const REFRESH_MS = 60000;

  const weekEl = document.getElementById('agendaWeek');
  const rangeEl = document.getElementById('agendaRange');
  const demoEl = document.getElementById('agendaDemo');
  const filtersEl = document.getElementById('agendaFilters');
  const dialog = document.getElementById('agendaDialog');
  const form = document.getElementById('agendaForm');
  const formError = document.getElementById('agendaFormError');

  const state = {
    weekStart: null,      // 'AAAA-MM-DD' da segunda-feira mostrada
    formato: 'individual',
    modalidade: 'todas',
    aulas: [],
    status: 'idle',       // idle | loading | ok | error
    selected: null,
    visible: false
  };
  let refreshTimer = null;
  let requestId = 0;

  /* ---------- datas (sempre no fuso de São Paulo, UTC-3) ---------- */
  const dateKey = d => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const keyToDate = key => new Date(key + 'T00:00:00-03:00');
  const addDays = (key, n) => dateKey(new Date(keyToDate(key).getTime() + n * DAY + 12 * 3600000));

  function mondayOf(key){
    const weekday = new Date(key + 'T12:00:00Z').getUTCDay(); // 0 = domingo
    return addDays(key, weekday === 0 ? -6 : 1 - weekday);
  }

  /* ---------- textos ---------- */
  const lang = () => (translations[document.documentElement.lang] ? document.documentElement.lang : 'pt');
  const locale = () => LOCALES[lang()];
  const t = key => {
    const value = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), translations[lang()].agendamento.agenda);
    return value !== undefined ? value : key;
  };
  const fmt = (date, opts) => new Intl.DateTimeFormat(locale(), { timeZone: TZ, ...opts }).format(date);
  const time = date => fmt(date, { hour: '2-digit', minute: '2-digit' });

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- dados ---------- */
  async function load({ silent = false } = {}){
    const id = ++requestId;
    if (!silent){
      state.status = 'loading';
      render();
    }

    const from = keyToDate(state.weekStart).toISOString();
    const to = keyToDate(addDays(state.weekStart, 7)).toISOString();

    try {
      const res = await fetch(`/api/aulas?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (id !== requestId) return; // chegou resposta de uma semana que já saiu da tela
      state.aulas = data.aulas || [];
      state.status = 'ok';
      demoEl.hidden = !data.demo;
    } catch (err){
      if (id !== requestId) return;
      if (silent) return; // falha na atualização automática: mantém o que já estava na tela
      state.status = 'error';
    }
    render();
  }

  /* ---------- desenho da semana ---------- */
  function render(){
    const start = keyToDate(state.weekStart);
    const end = keyToDate(addDays(state.weekStart, 6));
    rangeEl.textContent = `${fmt(start, { day: 'numeric', month: 'short' })} – ${fmt(end, { day: 'numeric', month: 'short' })}`;

    // não deixa voltar pra semanas que já passaram
    root.querySelector('.agenda-nav[data-dir="-1"]').disabled = state.weekStart <= mondayOf(dateKey(new Date()));

    if (state.status === 'loading' && !state.aulas.length){
      weekEl.innerHTML = `<p class="agenda-message">${escapeHtml(t('carregando'))}</p>`;
      return;
    }
    if (state.status === 'error'){
      weekEl.innerHTML = `<p class="agenda-message">${escapeHtml(t('erro'))}
        <button type="button" class="agenda-retry">${escapeHtml(t('tentar'))}</button></p>`;
      return;
    }

    const aulas = state.aulas.filter(a =>
      a.formato === state.formato && (state.modalidade === 'todas' || a.modalidade === state.modalidade)
    );

    if (!aulas.length){
      const msg = state.aulas.length ? t('semAulasFiltro') : t('semAulas');
      weekEl.innerHTML = `<p class="agenda-message">${escapeHtml(msg)}</p>`;
      weekEl.classList.toggle('is-loading', state.status === 'loading');
      return;
    }

    const today = dateKey(new Date());
    let html = '';
    for (let i = 0; i < 7; i++){
      const key = addDays(state.weekStart, i);
      const date = keyToDate(key);
      const dayAulas = aulas.filter(a => dateKey(new Date(a.start)) === key);
      const classes = ['agenda-day'];
      if (!dayAulas.length) classes.push('is-empty');
      if (key === today) classes.push('is-today');

      html += `<div class="${classes.join(' ')}">
        <div class="agenda-day-head">
          <span class="agenda-day-name">${escapeHtml(fmt(date, { weekday: 'short' }).replace('.', ''))}</span>
          <span class="agenda-day-num">${escapeHtml(fmt(date, { day: 'numeric' }))}</span>
        </div>
        <div class="agenda-day-list">${dayAulas.map(cardHtml).join('')}</div>
      </div>`;
    }
    weekEl.innerHTML = html;
    weekEl.classList.toggle('is-loading', state.status === 'loading');
  }

  function cardHtml(aula){
    const full = aula.restantes <= 0;
    const vagas = aula.formato === 'individual'
      ? (full ? t('lotada') : t('individual'))
      : (full ? t('lotada') : aula.restantes === 1 ? t('vaga') : t('vagas').replace('{n}', aula.restantes));

    return `<button type="button" class="agenda-card agenda-card--${escapeHtml(aula.modalidade)}${full ? ' is-full' : ''}"
        data-id="${escapeHtml(aula.id)}" ${full ? 'disabled' : ''}>
      <span class="agenda-card-time">${escapeHtml(time(new Date(aula.start)))} – ${escapeHtml(time(new Date(aula.end)))}</span>
      <span class="agenda-card-title">${escapeHtml(aula.title)}</span>
      <span class="agenda-card-meta">
        <span class="agenda-card-vagas">${escapeHtml(vagas)}</span>
        ${aula.online ? `<span class="agenda-card-tag">${escapeHtml(t('online'))}</span>` : ''}
      </span>
      ${full ? '' : `<span class="agenda-card-cta">${escapeHtml(t('experimentar'))} →</span>`}
    </button>`;
  }

  /* ---------- inscrição ---------- */
  function openDialog(aula){
    state.selected = aula;
    const start = new Date(aula.start);
    document.getElementById('agendaDialogTitle').textContent = aula.title;
    document.getElementById('agendaDialogWhen').textContent =
      `${fmt(start, { weekday: 'long', day: 'numeric', month: 'long' })} · ${time(start)} – ${time(new Date(aula.end))}`;
    document.getElementById('agendaDialogForm').hidden = false;
    document.getElementById('agendaDialogDone').hidden = true;
    formError.hidden = true;
    dialog.showModal();
    form.querySelector('input[name="nome"]').focus();
  }

  async function submit(e){
    e.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector('.agenda-submit');
    const data = Object.fromEntries(new FormData(form));
    button.disabled = true;
    button.textContent = t('enviando');
    formError.hidden = true;

    try {
      const res = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, aulaId: state.selected.id })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || 'agenda_indisponivel');

      document.getElementById('agendaDialogForm').hidden = true;
      document.getElementById('agendaDialogDone').hidden = false;
      form.reset();
      load({ silent: true });
    } catch (err){
      const key = 'erros.' + err.message;
      const msg = t(key);
      formError.textContent = msg === key ? t('erros.agenda_indisponivel') : msg;
      formError.hidden = false;
      // aula lotou/saiu enquanto a pessoa preenchia: atualiza a semana atrás da janela
      if (['lotada', 'aula_nao_encontrada', 'prazo_encerrado'].includes(err.message)) load({ silent: true });
    } finally {
      button.disabled = false;
      button.textContent = t('confirmar');
    }
  }

  /* ---------- eventos ---------- */
  root.querySelectorAll('.agenda-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      state.weekStart = addDays(state.weekStart, 7 * parseInt(btn.dataset.dir, 10));
      state.aulas = [];
      load();
    });
  });

  filtersEl.addEventListener('click', e => {
    const chip = e.target.closest('.agenda-chip');
    if (!chip) return;
    filtersEl.querySelectorAll('.agenda-chip').forEach(c => c.classList.toggle('active', c === chip));
    state.modalidade = chip.dataset.modalidade;
    render();
  });

  weekEl.addEventListener('click', e => {
    if (e.target.closest('.agenda-retry')){
      load();
      return;
    }
    const card = e.target.closest('.agenda-card');
    if (!card || card.disabled) return;
    const aula = state.aulas.find(a => a.id === card.dataset.id);
    if (aula) openDialog(aula);
  });

  form.addEventListener('submit', submit);
  dialog.addEventListener('click', e => {
    // clique no "fundo" (fora do conteúdo) ou num botão de fechar
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });

  const toggle = document.getElementById('formatToggle');
  if (toggle){
    toggle.addEventListener('formatchange', e => {
      state.formato = e.detail.format;
      render();
    });
  }

  document.addEventListener('langchange', () => {
    if (state.weekStart) render();
  });

  /* ---------- começo + atualização automática ---------- */
  state.weekStart = mondayOf(dateKey(new Date()));

  function setRefresh(on){
    clearInterval(refreshTimer);
    refreshTimer = on ? setInterval(() => {
      if (!document.hidden && !dialog.open) load({ silent: true });
    }, REFRESH_MS) : null;
  }

  if (!('IntersectionObserver' in window)){
    load();
    setRefresh(true);
    return;
  }

  let loaded = false;
  new IntersectionObserver(entries => {
    state.visible = entries.some(entry => entry.isIntersecting);
    if (state.visible && !loaded){
      loaded = true;
      load();
    }
    setRefresh(state.visible);
  }, { rootMargin: '400px 0px' }).observe(root);
}

/* ============ SCROLL REVEAL (fade-in on scroll) ============ */
function initScrollReveal(){
  const selectors = [
    '.hero-text', '.hero-photo',
    '.about-photo', '.about-text',
    '.showcase', '.professora-text',
    '.section-title', '.section-subtitle',
    '.pill-toggle', '.format-content', '.agenda',
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

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTOPLAY_SPEED = 32; // px por segundo — bem lento, tipo brisa

  let setWidth = 0;
  let pos = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartPos = 0;
  let dragMoved = 0;
  let autoplayPaused = false;
  let rafId = null;
  let lastFrameTime = null;

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

  /* varal anda sozinho pra esquerda feito uma esteira contínua (não é o slide
     com paradas do carrossel dos serviços); pausa ao arrastar, passar o mouse
     ou focar dentro dele, e nem começa a andar se o usuário prefere menos
     movimento na tela. */
  function autoplayTick(timestamp){
    if (lastFrameTime === null) lastFrameTime = timestamp;
    const deltaSeconds = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;

    if (!dragging && !autoplayPaused && setWidth > 0) {
      pos -= AUTOPLAY_SPEED * deltaSeconds;
      wrap();
      render();
    }
    rafId = requestAnimationFrame(autoplayTick);
  }

  function pauseAutoplay(){
    autoplayPaused = true;
  }

  function resumeAutoplay(){
    autoplayPaused = false;
    lastFrameTime = null;
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

  if (!reduceMotion) {
    marquee.addEventListener('mouseenter', pauseAutoplay);
    marquee.addEventListener('mouseleave', resumeAutoplay);
    marquee.addEventListener('focusin', pauseAutoplay);
    marquee.addEventListener('focusout', resumeAutoplay);
    rafId = requestAnimationFrame(autoplayTick);
  }
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

    document.documentElement.style.overflow = 'hidden';
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
    document.documentElement.style.overflow = '';
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

/* ============ SPLASH DE ABERTURA (toda carga da página) ============ */
function initSplashIntro(){
  /* o script inline no <head> pode ter escondido a página (document.documentElement)
     pra evitar o flash "site → splash → site" — revela de volta em TODO caminho
     que não termina inserindo o overlay (o overlay é que passa a cobrir a tela). */
  function revealPage(){
    document.documentElement.style.visibility = '';
  }

  const sourceSvg = document.getElementById('sobreLogo');
  if (!sourceSvg){ revealPage(); return; }

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion){
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
  document.documentElement.style.overflow = 'hidden';
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
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    return;
  }

  const HOLD_AFTER_DRAW = 350;    /* segura o logo completo por um instante antes de fechar sozinho */
  const FADE_DURATION = 850;      /* duração do fade de saída (bate com splash-intro.css) */
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
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

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
