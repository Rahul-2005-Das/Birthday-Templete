/**
 * main.js
 * Handles: App initialization, loader, and orchestration
 * Riddhika Birthday Website
 */

/* ====================================================
   LOADER SEQUENCE
   ==================================================== */
function runLoader() {
  const loader    = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  let progress = 0;

  const messages = [
    'Gathering all your love...',
    'Filling the room with roses...',
    'Adding extra sparkle for Riddhika...',
    'Almost ready to surprise you!',
    '🎂 Happy Birthday, Riddhika! 🎂',
  ];
  let msgIndex = 0;
  const msgEl = loader.querySelector('.loader-text');

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress > 100) progress = 100;
    loaderBar.style.width = progress + '%';

    // Update message
    const newMsgIdx = Math.floor((progress / 100) * messages.length);
    if (newMsgIdx !== msgIndex && newMsgIdx < messages.length) {
      msgIndex = newMsgIdx;
      msgEl.style.opacity = '0';
      setTimeout(() => {
        msgEl.textContent = messages[msgIndex];
        msgEl.style.opacity = '1';
      }, 200);
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        onAppReady();
      }, 800);
    }
  }, 120);
}

/* ====================================================
   APP READY — fire all systems
   ==================================================== */
function onAppReady() {
  // Start particles
  initParticles();
  
  // Start fireworks burst on entry
  startFireworks();
  setTimeout(stopFireworks, 5000);

  // Launch confetti
  setTimeout(launchConfetti, 500);
  setTimeout(launchConfetti, 2000);

  // Init quotes carousel
  initQuotes();

  // Init game
  initGame();

  // Init animations (scroll reveal, cursor sparkles)
  initAnimations();

  // Init music (starts on first user interaction)
  initMusic();

  // Start hearts
  // (already started in initParticles)

  // Reveal body
  document.body.style.visibility = 'visible';
}

/* ====================================================
   PREVENT CONTEXT MENU ON PHOTO (protect image)
   ==================================================== */
function preventImageRightClick() {
  const photo = document.getElementById('heroPhoto');
  if (photo) {
    photo.addEventListener('contextmenu', (e) => e.preventDefault());
    photo.addEventListener('dragstart', (e) => e.preventDefault());
  }
}

/* ====================================================
   SMOOTH SECTION REVEAL ON SCROLL
   ==================================================== */
function initIntersectionObservers() {
  const sections = document.querySelectorAll('section');
  
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(s => {
    s.style.opacity = '1'; // visible by default
    obs.observe(s);
  });
}

/* ====================================================
   NAME TYPING EFFECT (Easter Egg)
   ==================================================== */
let typingActive = false;
function initNameTypingEffect() {
  const name = document.querySelector('.glitter-name');
  if (!name) return;

  name.addEventListener('click', () => {
    if (typingActive) return;
    typingActive = true;
    
    const spans = name.querySelectorAll('span');
    const hearts = ['💖','💕','❤️','💗','💝'];
    
    spans.forEach((span, i) => {
      setTimeout(() => {
        const original = span.textContent;
        span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        span.style.transform = 'scale(1.5)';
        setTimeout(() => {
          span.textContent = original;
          span.style.transform = '';
          if (i === spans.length - 1) {
            typingActive = false;
            launchConfetti();
          }
        }, 600);
      }, i * 150);
    });
  });
}

/* ====================================================
   RESPONSIVE RESIZE HANDLER
   ==================================================== */
function handleResize() {
  // Reposition any floating no buttons on resize
  document.querySelectorAll('.btn-no').forEach(btn => {
    if (btn.style.position === 'fixed') {
      const newLeft = Math.min(parseFloat(btn.style.left), window.innerWidth - 160);
      const newTop  = Math.min(parseFloat(btn.style.top), window.innerHeight - 60);
      btn.style.left = Math.max(20, newLeft) + 'px';
      btn.style.top  = Math.max(20, newTop)  + 'px';
    }
  });
}

window.addEventListener('resize', handleResize);

/* ====================================================
   DOCUMENT READY
   ==================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
  document.body.style.visibility = 'visible';

  // Prevent image right-click
  preventImageRightClick();

  // Name click easter egg
  initNameTypingEffect();

  // Run loader then init app
  runLoader();
});
