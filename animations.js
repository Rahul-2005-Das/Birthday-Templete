/**
 * animations.js
 * Handles: Scroll reveals, cursor sparkles, section transitions
 * Riddhika Birthday Website
 */

/* ====================================================
   SCROLL REVEAL
   ==================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.quote-card-static, .wish-card, .section-header, .game-card'
  );
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}


/* ====================================================
   CUSTOM CURSOR SPARKLE
   ==================================================== */
function initCursorSparkle() {
  const sparkleEmojis = ['✨','💕','⭐','🌸','💫','🎊'];
  
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.85) {
      createCursorSparkle(e.clientX, e.clientY, sparkleEmojis);
    }
  });

  document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => createCursorSparkle(
        e.clientX + (Math.random() - 0.5) * 40,
        e.clientY + (Math.random() - 0.5) * 40,
        sparkleEmojis
      ), i * 60);
    }
  });
}

function createCursorSparkle(x, y, emojis) {
  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: ${Math.random() * 14 + 10}px;
    pointer-events: none;
    z-index: 9996;
    transform: translate(-50%, -50%);
    animation: sparkleAppear 0.8s ease forwards;
    will-change: transform, opacity;
  `;
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}


/* ====================================================
   SECTION ENTRANCE ANIMATIONS
   ==================================================== */
function initSectionAnimations() {
  const sections = document.querySelectorAll('section');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (id === 'game') {
          // Trigger mini confetti when reaching game section
          setTimeout(launchConfetti, 300);
        }
        if (id === 'wishes') {
          // Trigger fireworks burst
          if (!fwRunning) {
            startFireworks();
            setTimeout(stopFireworks, 4000);
          }
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));
}


/* ====================================================
   PHOTO GLOW ON HOVER
   ==================================================== */
function initPhotoInteractions() {
  const photoFrame = document.querySelector('.photo-frame');
  if (!photoFrame) return;
  
  photoFrame.addEventListener('mouseenter', () => {
    launchConfetti();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const rect = photoFrame.getBoundingClientRect();
        createCursorSparkle(
          rect.left + Math.random() * rect.width,
          rect.top + Math.random() * rect.height,
          ['💕','✨','🌸','💖']
        );
      }, i * 100);
    }
  });
}


/* ====================================================
   SCROLL TO SECTION
   ==================================================== */
function scrollToQuotes() {
  document.getElementById('quotes').scrollIntoView({ behavior: 'smooth' });
}


/* ====================================================
   FINALE HEARTS ANIMATION
   ==================================================== */
function createFinaleHearts() {
  const container = document.getElementById('finaleHearts');
  if (!container) return;
  const emojis = ['💕','💖','💗','💝','❤️','🌹','✨'];
  
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('span');
    el.style.cssText = `
      position: absolute;
      font-size: ${Math.random() * 20 + 12}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: roseFloat ${Math.random() * 3 + 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      pointer-events: none;
    `;
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    container.appendChild(el);
  }
}


/* ====================================================
   INIT ALL ANIMATIONS
   ==================================================== */
function initAnimations() {
  initScrollReveal();
  initCursorSparkle();
  initSectionAnimations();
  initPhotoInteractions();
  createFinaleHearts();
}
