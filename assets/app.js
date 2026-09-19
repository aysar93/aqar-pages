const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const faqButtons = [...document.querySelectorAll('.faq-item button')];
const revealItems = [...document.querySelectorAll('.reveal')];
const mobileInstall = document.querySelector('.mobile-install');
const hero = document.querySelector('.hero');
const footer = document.querySelector('.site-footer');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'فتح القائمة');
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'فتح القائمة' : 'إغلاق القائمة');
  nav?.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('click', (event) => {
  if (!nav?.classList.contains('open')) return;
  if (nav.contains(event.target) || menuButton?.contains(event.target)) return;
  closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 24);
}

function updateMobileInstall() {
  if (!mobileInstall || !hero || !footer) return;
  const hasPassedHero = window.scrollY > hero.offsetHeight * 0.55;
  const footerIsNear = footer.getBoundingClientRect().top < window.innerHeight * 0.9;
  const shouldShow = window.innerWidth <= 720 && hasPassedHero && !footerIsNear;
  mobileInstall.classList.toggle('visible', shouldShow);
  document.body.classList.toggle('install-visible', shouldShow);
}

window.addEventListener('scroll', () => {
  updateHeader();
  updateMobileInstall();
}, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 992) closeMenu();
  updateMobileInstall();
});
updateHeader();
updateMobileInstall();

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answer = item?.querySelector('.faq-answer');
    const willOpen = button.getAttribute('aria-expanded') !== 'true';

    faqButtons.forEach((otherButton) => {
      const otherAnswer = otherButton.closest('.faq-item')?.querySelector('.faq-answer');
      otherButton.setAttribute('aria-expanded', 'false');
      if (otherAnswer) otherAnswer.hidden = true;
    });

    button.setAttribute('aria-expanded', String(willOpen));
    if (answer) answer.hidden = !willOpen;
  });
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.13 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-35% 0px -55%', threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));
}

const phoneViews = [...document.querySelectorAll('[data-phone-view]')];
const phoneNavigation = [...document.querySelectorAll('[data-phone-target]')];
const phoneBottomButtons = [...document.querySelectorAll('.phone-bottom-nav [data-phone-target]')];
const phonePropertyButtons = [...document.querySelectorAll('[data-open-property]')];

function showPhoneView(viewName) {
  if (!phoneViews.length) return;
  phoneViews.forEach((view) => {
    const isActive = view.dataset.phoneView === viewName;
    view.hidden = !isActive;
    view.classList.toggle('is-active', isActive);
    if (isActive) view.scrollTop = 0;
  });

  const navView = viewName === 'detail' ? 'home' : viewName;
  phoneBottomButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.phoneTarget === navView);
  });
}

phoneNavigation.forEach((button) => {
  button.addEventListener('click', () => showPhoneView(button.dataset.phoneTarget));
});

phonePropertyButtons.forEach((button) => {
  button.addEventListener('click', () => showPhoneView('detail'));
});

document.querySelectorAll('.phone-category-row, .phone-filter-grid').forEach((group) => {
  group.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !group.contains(button)) return;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
  });
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const propertySearch = document.querySelector('#property-search');
propertySearch?.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = document.querySelector('#search-city')?.value || 'anbar';
  const type = document.querySelector('#search-type')?.value || 'all';
  const routes = {
    'ramadi:all': 'ramadi/',
    'fallujah:all': 'fallujah/',
    'anbar:houses': 'properties/houses-for-sale/',
    'anbar:land': 'properties/land-for-sale/',
    'anbar:apartments': 'properties/apartments-for-rent/'
  };
  const route = routes[`${city}:${type}`] || `browse.html?city=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}`;
  window.location.assign(route);
});

const browseResult = document.querySelector('#browse-result');
if (browseResult) {
  const params = new URLSearchParams(window.location.search);
  const cityNames = { ramadi: 'الرمادي', fallujah: 'الفلوجة', anbar: 'محافظة الأنبار' };
  const typeNames = { all: 'كل العقارات', houses: 'البيوت المعروضة للبيع', land: 'الأراضي المعروضة للبيع', apartments: 'الشقق المعروضة للإيجار' };
  const city = params.get('city') || 'anbar';
  const type = params.get('type') || 'all';
  browseResult.textContent = `${typeNames[type] || typeNames.all} في ${cityNames[city] || cityNames.anbar}`;
}

const cardCarousel = document.querySelector('[data-card-carousel]');
if (cardCarousel) {
  const cards = [...cardCarousel.querySelectorAll('[data-carousel-card]')];
  const dotsContainer = cardCarousel.querySelector('.carousel-dots');
  const previousButton = cardCarousel.querySelector('[data-carousel-prev]');
  const nextButton = cardCarousel.querySelector('[data-carousel-next]');
  const track = cardCarousel.querySelector('.browse-grid');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let startX = 0;
  let suppressClick = false;
  let autoTimer;

  const dots = cards.map((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `عرض القسم ${index + 1}: ${card.querySelector('h3')?.textContent || ''}`);
    dot.addEventListener('click', () => setActive(index, true));
    dotsContainer?.appendChild(dot);
    return dot;
  });

  function renderCarousel() {
    cards.forEach((card, index) => {
      const stack = (index - activeIndex + cards.length) % cards.length;
      card.style.setProperty('--stack', String(stack));
      card.dataset.stack = String(stack);
      card.tabIndex = stack === 0 ? 0 : -1;
      card.setAttribute('aria-current', stack === 0 ? 'true' : 'false');
      card.setAttribute('aria-label', `${card.querySelector('h3')?.textContent || 'قسم عقاري'}${stack === 0 ? '، البطاقة الحالية؛ اضغط لفتح القسم' : '؛ اضغط لإظهار البطاقة'}`);
    });
    dots.forEach((dot, index) => dot.setAttribute('aria-selected', String(index === activeIndex)));
  }

  function restartAutoPlay() {
    window.clearInterval(autoTimer);
    if (reduceMotion) return;
    autoTimer = window.setInterval(() => setActive(activeIndex + 1, false), 5200);
  }

  function setActive(index, userInitiated = false) {
    activeIndex = (index + cards.length) % cards.length;
    renderCarousel();
    if (userInitiated) restartAutoPlay();
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', (event) => {
      if (suppressClick) {
        event.preventDefault();
        suppressClick = false;
        return;
      }
      if (index !== activeIndex) {
        event.preventDefault();
        setActive(index, true);
      }
    });
  });

  previousButton?.addEventListener('click', () => setActive(activeIndex - 1, true));
  nextButton?.addEventListener('click', () => setActive(activeIndex + 1, true));

  cardCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActive(activeIndex + 1, true);
      cards[activeIndex]?.focus();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActive(activeIndex - 1, true);
      cards[activeIndex]?.focus();
    }
  });

  track?.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
    suppressClick = false;
    track.setPointerCapture?.(event.pointerId);
  });

  track?.addEventListener('pointerup', (event) => {
    const distance = event.clientX - startX;
    if (Math.abs(distance) < 45) return;
    suppressClick = true;
    setActive(activeIndex + (distance < 0 ? 1 : -1), true);
  });

  cardCarousel.addEventListener('mouseenter', () => window.clearInterval(autoTimer));
  cardCarousel.addEventListener('mouseleave', restartAutoPlay);
  cardCarousel.addEventListener('focusin', () => window.clearInterval(autoTimer));
  cardCarousel.addEventListener('focusout', (event) => {
    if (!cardCarousel.contains(event.relatedTarget)) restartAutoPlay();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearInterval(autoTimer);
    else restartAutoPlay();
  });

  renderCarousel();
  restartAutoPlay();
}

const siteVideos = [...document.querySelectorAll('.video-frame video')];
siteVideos.forEach((video) => {
  const frame = video.closest('.video-frame');
  const playButton = frame?.querySelector('[data-video-play]');

  playButton?.addEventListener('click', async () => {
    siteVideos.forEach((otherVideo) => {
      if (otherVideo !== video) otherVideo.pause();
    });
    try {
      await video.play();
    } catch {
      frame?.classList.remove('is-playing');
    }
  });

  video.addEventListener('play', () => {
    siteVideos.forEach((otherVideo) => {
      if (otherVideo !== video) otherVideo.pause();
    });
    frame?.classList.add('is-playing');
  });

  video.addEventListener('pause', () => frame?.classList.remove('is-playing'));
  video.addEventListener('ended', () => {
    frame?.classList.remove('is-playing');
    video.currentTime = 0;
  });
});
