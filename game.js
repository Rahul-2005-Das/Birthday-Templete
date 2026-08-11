/**
 * game.js
 * Handles: Funny interactive game with "No" button that runs away
 * Riddhika Birthday Website
 */

let noClickCount = 0;
const funnyMessages = [
  "You can't say no! 😤",
  "The button ran away! 🏃💨",
  "Come back here, 'No'! 😂",
  "You thought you could catch it? 😏",
  "Nope, the 'No' button has escaped! 🚀",
  "It's doing parkour now! 🤸",
  "Even the button knows you love me! 💖",
  "404: No button not found! 🔍",
  "The 'No' button called me and said it's on your side! 😂",
  "Stop trying! Just click YES already! 🥺",
];

/* ====================================================
   RUN AWAY BUTTON
   ==================================================== */
function runAwayBtn(btn) {
  noClickCount++;
  const stageId = btn.closest('.game-stage').id;
  const msgId = 'escapeMsg' + stageId.replace('stage', '');

  const gameContainer = document.getElementById('gameContainer');
  const containerRect = gameContainer.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  // Calculate random direction to escape
  const directions = [
    { x: Math.random() * 200 + 80, y: Math.random() * 60 - 30 },
    { x: -(Math.random() * 200 + 80), y: Math.random() * 60 - 30 },
    { x: Math.random() * 80 - 40, y: Math.random() * 120 + 60 },
    { x: Math.random() * 80 - 40, y: -(Math.random() * 120 + 60) },
  ];
  const dir = directions[Math.floor(Math.random() * directions.length)];

  // Get current position
  const currentLeft = btn.offsetLeft || 0;
  const currentTop  = btn.offsetTop  || 0;

  // Use fixed positioning for escape
  btn.style.position = 'fixed';
  btn.style.left = btnRect.left + 'px';
  btn.style.top  = btnRect.top  + 'px';
  btn.style.zIndex = '10000';
  btn.style.transition = 'left 0.25s ease, top 0.25s ease, transform 0.25s ease';

  // Force repaint
  btn.getBoundingClientRect();

  // Calculate new position (keep within viewport)
  let newLeft = btnRect.left + dir.x;
  let newTop  = btnRect.top  + dir.y;
  
  // Bounce off edges
  newLeft = Math.max(20, Math.min(window.innerWidth  - 160, newLeft));
  newTop  = Math.max(20, Math.min(window.innerHeight - 60,  newTop));

  // Spin animation
  btn.style.transform = `rotate(${Math.random() * 40 - 20}deg) scale(${Math.random() * 0.2 + 0.9})`;
  btn.style.left = newLeft + 'px';
  btn.style.top  = newTop  + 'px';

  // Show funny message
  const msgEl = document.getElementById(msgId);
  if (msgEl) {
    const msg = funnyMessages[Math.min(noClickCount - 1, funnyMessages.length - 1)];
    msgEl.textContent = msg;
    msgEl.style.opacity = '1';
    clearTimeout(msgEl._timeout);
    msgEl._timeout = setTimeout(() => { msgEl.style.opacity = '0'; }, 2500);
  }

  // Grow YES button
  const yesBtn = btn.closest('.game-stage').querySelector('.btn-yes');
  if (yesBtn) {
    const scale = Math.min(1 + noClickCount * 0.05, 1.5);
    yesBtn.style.transform = `scale(${scale})`;
    yesBtn.style.transition = 'transform 0.3s ease';
  }

  // Extra: make button tiny if caught too many times
  if (noClickCount >= 7) {
    btn.style.fontSize = '0.5rem';
    btn.style.padding = '0.3rem 0.8rem';
    btn.textContent = '🤏 tiny no';
  }

  // Teleport randomly after multiple attempts
  if (noClickCount >= 5) {
    setTimeout(() => {
      btn.style.left = (Math.random() * (window.innerWidth - 160) + 20) + 'px';
      btn.style.top  = (Math.random() * (window.innerHeight - 60) + 20) + 'px';
    }, 300);
  }
}


/* ====================================================
   HANDLE YES CLICKS
   ==================================================== */
function showStage(stageId) {
  document.querySelectorAll('.game-stage').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  
  // Reset all No buttons position
  document.querySelectorAll('.btn-no').forEach(btn => {
    btn.style.position = '';
    btn.style.left = '';
    btn.style.top  = '';
    btn.style.zIndex = '';
    btn.style.transform = '';
    btn.style.fontSize = '';
    btn.style.padding = '';
    btn.textContent = btn.textContent.includes('no') ? '😬 Umm... no' : btn.textContent;
  });

  const stage = document.getElementById(stageId);
  if (stage) {
    stage.style.display = 'flex';
    stage.classList.add('active');
    stage.style.animation = 'none';
    stage.getBoundingClientRect();
    stage.style.animation = 'cardPopIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both';
  }

  noClickCount = 0;
}

function handleYes1() {
  launchConfetti();
  startFireworks();
  setTimeout(stopFireworks, 3000);
  showStage('stage2');
  document.getElementById('stage2').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleYes2() {
  launchConfetti();
  showStage('stage3');
  document.getElementById('stage3').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleFinalYes() {
  launchConfetti();
  startFireworks();
  setTimeout(stopFireworks, 5000);
  showStage('stageFinal');
  document.getElementById('stageFinal').scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Extra confetti bursts
  setTimeout(launchConfetti, 1000);
  setTimeout(launchConfetti, 2000);
}

/* ====================================================
   INIT GAME
   ==================================================== */
function initGame() {
  // Make sure first stage is visible
  const firstStage = document.getElementById('stage1');
  if (firstStage) {
    firstStage.style.display = 'flex';
    firstStage.classList.add('active');
  }
}
