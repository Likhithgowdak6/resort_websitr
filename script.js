// =============================
// HEADER – scroll behaviour
// =============================
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });


// =============================
// NAV OVERLAY – open / close
// =============================
const btnMenu    = document.getElementById('btn-menu');
const btnClose   = document.getElementById('btn-close');
const navOverlay = document.getElementById('nav-overlay');

btnMenu.addEventListener('click', () => {
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

btnClose.addEventListener('click', () => {
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});


// =============================
// SUITE TABS
// =============================
const suiteTabs   = document.querySelectorAll('.suite-tab');
const suitePanels = document.querySelectorAll('.suite-panel');

suiteTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = parseInt(tab.dataset.suite);

    suiteTabs.forEach(t => t.classList.remove('active'));
    suitePanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    suitePanels[target].classList.add('active');
  });
});


// =============================
// ACCORDION
// =============================
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  const body   = item.querySelector('.accordion-body');
  const icon   = item.querySelector('.accordion-icon');

  // Initialise open items
  if (item.classList.contains('open')) {
    body.style.display = 'block';
  }

  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    accordionItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-body').style.display = 'none';
      i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      i.querySelector('.accordion-icon').textContent = '+';
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      body.style.display = 'block';
      header.setAttribute('aria-expanded', 'true');
      icon.textContent = '−';

      // Smooth reveal
      body.style.opacity = '0';
      body.style.transform = 'translateY(-8px)';
      requestAnimationFrame(() => {
        body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        body.style.opacity = '1';
        body.style.transform = 'translateY(0)';
      });
    }
  });
});


// =============================
// GALLERY SLIDER
// =============================
const track       = document.getElementById('gallery-track');
const slides      = document.querySelectorAll('.gallery-slide');
const prevBtn     = document.getElementById('gallery-prev');
const nextBtn     = document.getElementById('gallery-next');
const dotsWrapper = document.getElementById('gallery-dots');

let currentSlide = 0;
const totalSlides = slides.length;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('gallery-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrapper.appendChild(dot);
});

function updateDots() {
  document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = (index + totalSlides) % totalSlides;
  const slideWidth = slides[0].offsetWidth + 12; // 12 = gap approximation
  track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  updateDots();
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Touch / swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
  }
});

// Auto-play
let autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);

[prevBtn, nextBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
  });
});

// Recalculate on resize
window.addEventListener('resize', () => goToSlide(currentSlide));


// =============================
// NEWSLETTER FORM
// =============================
const newsletterForm = document.getElementById('newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  const btn = newsletterForm.querySelector('button[type="submit"]');

  btn.textContent = 'Subscribed ✓';
  btn.style.background = '#4a7c59';
  btn.disabled = true;
  emailInput.value = '';

  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
    btn.disabled = false;
  }, 4000);
});


// =============================
// SCROLL REVEAL ANIMATION
// =============================
const revealElements = document.querySelectorAll(
  '.intro-text, .intro-image, .safaris-text, .safaris-image, ' +
  '.unique-text, .unique-image, .activity-card, .suite-panel.active, ' +
  '.culture-text, .culture-images, .founders-image, .founders-quote, ' +
  '.collection-card, .camp-info-header, .accordion'
);

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 80 * i);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));


// =============================
// SMOOTH ANCHOR SCROLL
// =============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    // Skip plain '#' links with no target id
    if (!href || href === '#') {
      e.preventDefault();
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close nav if open
      navOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
