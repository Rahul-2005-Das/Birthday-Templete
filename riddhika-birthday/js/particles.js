/**
 * particles.js
 * Handles: Canvas fireworks, hearts rain, stars background, floating emojis
 * Riddhika Birthday Website
 */

/* ====================================================
   FIREWORKS ENGINE
   ==================================================== */
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fireworksCanvas.getContext('2d');

let fwWidth, fwHeight;
let fireworks = [];
let fwParticles = [];
let fwRunning = false;

function resizeFireworks() {
  fwWidth = fireworksCanvas.width = window.innerWidth;
  fwHeight = fireworksCanvas.height = window.innerHeight;
}

class Firework {
  constructor() {
    this.x = Math.random() * fwWidth;
    this.y = fwHeight;
    this.targetY = Math.random() * fwHeight * 0.5;
    this.vy = -Math.random() * 8 - 6;
    this.trail = [];
    this.colors = [
      '#ff69b4','#ffd700','#e91e8c','#9c27b0','#ff6b9d',
      '#c2185b','#f48fb1','#ffeb3b','#ff4081','#e040fb'
    ];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 12) this.trail.shift();
      this.y += this.vy;
      if (this.y <= this.targetY) {
        this.exploded = true;
        this.createExplosion();
      }
    }
  }

  draw() {
    if (!this.exploded) {
      for (let i = 0; i < this.trail.length; i++) {
        const a = i / this.trail.length;
        fwCtx.beginPath();
        fwCtx.arc(this.trail[i].x, this.trail[i].y, 2 * a, 0, Math.PI * 2);
        fwCtx.fillStyle = this.color;
        fwCtx.globalAlpha = a;
        fwCtx.fill();
      }
      fwCtx.globalAlpha = 1;
    }
  }

  createExplosion() {
    const count = Math.floor(Math.random() * 60) + 60;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = Math.random() * 6 + 2;
      fwParticles.push(new FWParticle(this.x, this.y, angle, speed, this.color));
    }
  }
}

class FWParticle {
  constructor(x, y, angle, speed, color) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.alpha = 1;
    this.gravity = 0.15;
    this.decay = Math.random() * 0.015 + 0.01;
    this.size = Math.random() * 3 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.alpha -= this.decay;
  }

  draw() {
    fwCtx.beginPath();
    fwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    fwCtx.fillStyle = this.color;
    fwCtx.globalAlpha = Math.max(0, this.alpha);
    fwCtx.fill();
    fwCtx.globalAlpha = 1;
  }

  isDead() { return this.alpha <= 0; }
}

function fireworksLoop() {
  if (!fwRunning) return;
  fwCtx.fillStyle = 'rgba(0,0,0,0.15)';
  fwCtx.fillRect(0, 0, fwWidth, fwHeight);

  // Auto-launch fireworks
  if (Math.random() < 0.06) {
    fireworks.push(new Firework());
  }

  fireworks = fireworks.filter(fw => {
    fw.update();
    fw.draw();
    return !fw.exploded;
  });

  fwParticles = fwParticles.filter(p => {
    p.update();
    p.draw();
    return !p.isDead();
  });

  requestAnimationFrame(fireworksLoop);
}

function startFireworks() {
  fwRunning = true;
  fireworksLoop();
}

function stopFireworks() {
  fwRunning = false;
  fwCtx.clearRect(0, 0, fwWidth, fwHeight);
}


/* ====================================================
   HEARTS CANVAS ENGINE
   ==================================================== */
const heartsCanvas = document.getElementById('heartsCanvas');
const htCtx = heartsCanvas.getContext('2d');
let htWidth, htHeight;
let heartsList = [];

function resizeHearts() {
  htWidth = heartsCanvas.width = window.innerWidth;
  htHeight = heartsCanvas.height = window.innerHeight;
}

class Heart {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * htWidth;
    this.y = htHeight + 20;
    this.size = Math.random() * 15 + 8;
    this.vy = -(Math.random() * 1.5 + 0.5);
    this.vx = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.6 + 0.4;
    this.color = ['#ff69b4', '#e91e8c', '#ff4081', '#f48fb1', '#ffd700'][Math.floor(Math.random() * 5)];
    this.rotation = Math.random() * 0.4 - 0.2;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.05 + 0.02;
  }

  update() {
    this.y += this.vy;
    this.wobble += this.wobbleSpeed;
    this.x += this.vx + Math.sin(this.wobble) * 0.5;
    this.alpha -= 0.003;
    if (this.alpha <= 0 || this.y < -20) this.reset();
  }

  draw() {
    htCtx.save();
    htCtx.translate(this.x, this.y);
    htCtx.rotate(this.rotation);
    htCtx.globalAlpha = this.alpha;
    htCtx.fillStyle = this.color;
    this.drawHeartShape(this.size);
    htCtx.restore();
  }

  drawHeartShape(s) {
    htCtx.beginPath();
    htCtx.moveTo(0, -s * 0.3);
    htCtx.bezierCurveTo(s * 0.5, -s, s, -s * 0.5, s, 0);
    htCtx.bezierCurveTo(s, s * 0.5, s * 0.5, s, 0, s * 1.2);
    htCtx.bezierCurveTo(-s * 0.5, s, -s, s * 0.5, -s, 0);
    htCtx.bezierCurveTo(-s, -s * 0.5, -s * 0.5, -s, 0, -s * 0.3);
    htCtx.fill();
  }
}

function heartsLoop() {
  htCtx.clearRect(0, 0, htWidth, htHeight);
  heartsList.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(heartsLoop);
}

function initHearts() {
  for (let i = 0; i < 25; i++) {
    const h = new Heart();
    h.y = Math.random() * htHeight; // start scattered
    heartsList.push(h);
  }
  heartsLoop();
}


/* ====================================================
   STARS BACKGROUND
   ==================================================== */
function createStars() {
  const bg = document.getElementById('starsBg');
  if (!bg) return;
  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.setProperty('--dur', (Math.random() * 3 + 1.5) + 's');
    star.style.setProperty('--delay', (Math.random() * 4) + 's');
    star.style.left = Math.random() * 100 + '%';
    star.style.top  = Math.random() * 100 + '%';
    star.style.width = star.style.height = (Math.random() * 3 + 1) + 'px';
    bg.appendChild(star);
  }
}


/* ====================================================
   FLOATING EMOJIS BACKGROUND
   ==================================================== */
function createFloatingEmojis() {
  const container = document.getElementById('floatingEmojis');
  if (!container) return;
  const emojis = ['🌸','💕','✨','🌟','💖','🎊','🌹','💫','🦋','🎀','💝','🌺'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'float-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.setProperty('--size', (Math.random() * 1.5 + 0.8) + 'rem');
    el.style.setProperty('--left', Math.random() * 100 + '%');
    el.style.setProperty('--dur', (Math.random() * 10 + 12) + 's');
    el.style.setProperty('--delay', (Math.random() * 8) + 's');
    container.appendChild(el);
  }
}


/* ====================================================
   PHOTO SPARKLES
   ==================================================== */
function createPhotoSparkles() {
  const container = document.getElementById('photoSparkles');
  if (!container) return;
  const sparks = ['✨','⭐','💫','🌟','✦'];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.className = 'photo-sparkle';
    el.textContent = sparks[Math.floor(Math.random() * sparks.length)];
    el.style.setProperty('--size', (Math.random() * 1 + 0.7) + 'rem');
    el.style.setProperty('--top', (Math.random() * 90) + '%');
    el.style.setProperty('--left', (Math.random() * 90) + '%');
    el.style.setProperty('--delay', (Math.random() * 2) + 's');
    container.appendChild(el);
  }
}


/* ====================================================
   FLOATING ROSES
   ==================================================== */
function createFloatingRoses() {
  const container = document.getElementById('floatingRoses');
  if (!container) return;
  const roses = ['🌹','🌸','🌺','💐','🌷'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.className = 'float-rose';
    el.textContent = roses[Math.floor(Math.random() * roses.length)];
    const angle = (i / 6) * Math.PI * 2;
    const r = 55 + Math.random() * 20;
    el.style.setProperty('--top', (50 + Math.sin(angle) * 50) + '%');
    el.style.setProperty('--left', (50 + Math.cos(angle) * 50) + '%');
    el.style.setProperty('--dur', (Math.random() * 4 + 5) + 's');
    el.style.setProperty('--delay', (Math.random() * 3) + 's');
    container.appendChild(el);
  }
}


/* ====================================================
   CONFETTI BURST
   ==================================================== */
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#ff69b4','#ffd700','#e91e8c','#9c27b0','#00bcd4','#4caf50','#ff5722','#ffffff'];
  const shapes = ['2px','4px','6px'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const isCircle = Math.random() > 0.5;
    piece.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
    piece.style.setProperty('--w', (Math.random() * 10 + 5) + 'px');
    piece.style.setProperty('--h', (Math.random() * 14 + 8) + 'px');
    piece.style.setProperty('--br', isCircle ? '50%' : '2px');
    piece.style.setProperty('--left', Math.random() * 100 + '%');
    piece.style.setProperty('--dur', (Math.random() * 2 + 2) + 's');
    piece.style.setProperty('--delay', (Math.random() * 1.5) + 's');
    container.appendChild(piece);
  }
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}


/* ====================================================
   INIT ALL PARTICLES
   ==================================================== */
function initParticles() {
  resizeFireworks();
  resizeHearts();
  createStars();
  createFloatingEmojis();
  createPhotoSparkles();
  createFloatingRoses();
  initHearts();
}

window.addEventListener('resize', () => {
  resizeFireworks();
  resizeHearts();
});
