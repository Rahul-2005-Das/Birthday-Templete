/**
 * quotes.js
 * Handles: Quote carousel with auto-play and navigation
 * Riddhika Birthday Website
 */

let currentQuote = 0;
const totalQuotes = 6;
let quoteAutoPlay = null;

/* ====================================================
   BUILD DOTS
   ==================================================== */
function buildQuoteDots() {
  const dotsContainer = document.getElementById('quoteDots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';

  for (let i = 0; i < totalQuotes; i++) {
    const dot = document.createElement('div');
    dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dot.addEventListener('click', () => goToQuote(i));
    dotsContainer.appendChild(dot);
  }
}

/* ====================================================
   GO TO QUOTE
   ==================================================== */
function goToQuote(index) {
  const cards  = document.querySelectorAll('.quote-card');
  const dots   = document.querySelectorAll('.quote-dot');

  // Deactivate current
  cards[currentQuote]?.classList.remove('active');
  dots[currentQuote]?.classList.remove('active');

  currentQuote = (index + totalQuotes) % totalQuotes;

  // Activate new
  cards[currentQuote]?.classList.add('active');
  dots[currentQuote]?.classList.add('active');

  // Reset autoplay timer
  resetAutoPlay();
}

/* ====================================================
   NAVIGATION FUNCTIONS (globally accessible)
   ==================================================== */
function nextQuote() { goToQuote(currentQuote + 1); }
function prevQuote() { goToQuote(currentQuote - 1); }

/* ====================================================
   AUTO-PLAY
   ==================================================== */
function startAutoPlay() {
  quoteAutoPlay = setInterval(nextQuote, 5000);
}

function resetAutoPlay() {
  if (quoteAutoPlay) clearInterval(quoteAutoPlay);
  startAutoPlay();
}

/* ====================================================
   SWIPE SUPPORT (mobile)
   ==================================================== */
function initSwipeSupport() {
  const carousel = document.getElementById('quotesCarousel');
  if (!carousel) return;

  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextQuote();
      else prevQuote();
    }
  }, { passive: true });
}

/* ====================================================
   KEYBOARD NAVIGATION
   ==================================================== */
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextQuote();
    if (e.key === 'ArrowLeft')  prevQuote();
  });
}

/* ====================================================
   INIT QUOTES
   ==================================================== */
function initQuotes() {
  buildQuoteDots();
  startAutoPlay();
  initSwipeSupport();
  initKeyboardNav();
}
