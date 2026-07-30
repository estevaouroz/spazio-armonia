/* ===========================================================
   Spazio Armonia — main.js
   i18n, nav mobile, carrossel, toggle individual/grupo, accordion FAQ
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initMobileNav();
  initCarousel();
  initFormatToggle();
  initAccordion();
  initScrollReveal();
});

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

/* ============ CAROUSEL ============ */
function initCarousel(){
  const track = document.getElementById('carouselTrack');
  const viewport = document.querySelector('.carousel-viewport');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !viewport) return;

  const slides = Array.from(track.children);
  let index = 0;
  let slidesPerView = 1;

  function computeSlidesPerView(){
    const width = window.innerWidth;
    if (width >= 1024) return 2;
    return 1;
  }

  function maxIndex(){
    return Math.max(0, slides.length - slidesPerView);
  }

  function buildDots(){
    dotsContainer.innerHTML = '';
    const dotCount = maxIndex() + 1;
    for (let i = 0; i < dotCount; i++){
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots(){
    Array.from(dotsContainer.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function goToSlide(i){
    index = Math.min(Math.max(i, 0), maxIndex());
    const slideWidth = slides[0].getBoundingClientRect().width + slideGapPx();
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    updateDots();
  }

  function slideGapPx(){
    const style = window.getComputedStyle(slides[0]);
    return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  function refresh(){
    slidesPerView = computeSlidesPerView();
    if (index > maxIndex()) index = maxIndex();
    buildDots();
    goToSlide(index);
  }

  /* autoplay */
  const AUTOPLAY_DELAY = 5000;
  let autoplayTimer = null;

  function stopAutoplay(){
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goToSlide(index >= maxIndex() ? 0 : index + 1);
    }, AUTOPLAY_DELAY);
  }

  function restartAutoplay(){
    stopAutoplay();
    startAutoplay();
  }

  window.addEventListener('resize', refresh);

  const carouselEl = document.getElementById('servicesCarousel');
  carouselEl.addEventListener('mouseenter', stopAutoplay);
  carouselEl.addEventListener('mouseleave', startAutoplay);
  carouselEl.addEventListener('touchstart', stopAutoplay, { passive: true });

  /* touch / drag swipe */
  let startX = 0;
  let isDragging = false;

  viewport.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  viewport.addEventListener('touchmove', () => {}, { passive: true });

  viewport.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = e.changedTouches[0].clientX - startX;
    const threshold = 40;
    if (deltaX > threshold) goToSlide(index - 1);
    else if (deltaX < -threshold) goToSlide(index + 1);
    startAutoplay();
  });

  refresh();
  startAutoplay();
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
    '.section-title', '.section-subtitle',
    '.service-card',
    '.pill-toggle', '.format-content', '.calcom-placeholder',
    '.how-item',
    '.gallery-grid .polaroid',
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

/* ============ FAQ ACCORDION ============ */
function initAccordion(){
  const items = document.querySelectorAll('.accordion-item');

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
}
