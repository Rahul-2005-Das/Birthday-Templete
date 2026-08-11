/**
 * music.js
 * Handles: Birthday music using Web Audio API
 * Riddhika Birthday Website
 */

let audioCtx = null;
let musicPlaying = false;
let musicNodes = [];

/* ====================================================
   BIRTHDAY SONG NOTES (Web Audio API)
   Happy Birthday melody using oscillator
   ==================================================== */
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00,
};

// Happy Birthday melody: [note, duration(seconds)]
const HAPPY_BIRTHDAY = [
  ['G4', 0.3], ['G4', 0.3], ['A4', 0.6], ['G4', 0.6], ['C5', 0.6], ['B4', 1.0],
  ['G4', 0.3], ['G4', 0.3], ['A4', 0.6], ['G4', 0.6], ['D5', 0.6], ['C5', 1.0],
  ['G4', 0.3], ['G4', 0.3], ['G5', 0.6], ['E5', 0.6], ['C5', 0.6], ['B4', 0.6], ['A4', 0.8],
  ['F5', 0.3], ['F5', 0.3], ['E5', 0.6], ['C5', 0.6], ['D5', 0.6], ['C5', 1.2],
];

function createAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playNote(ctx, frequency, startTime, duration, volume = 0.15) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startTime);

  // Envelope
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, startTime + duration * 0.6);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);

  musicNodes.push(oscillator);
  return oscillator;
}

function addHarmony(ctx, frequency, startTime, duration) {
  // Add a soft harmony at 1.5x frequency (fifth)
  playNote(ctx, frequency * 1.5, startTime, duration, 0.06);
  // Add very soft octave
  playNote(ctx, frequency * 2, startTime, duration, 0.04);
}

function playBirthdaySong() {
  try {
    const ctx = createAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    let currentTime = ctx.currentTime + 0.1;
    const songDuration = HAPPY_BIRTHDAY.reduce((sum, [, dur]) => sum + dur + 0.08, 0);

    HAPPY_BIRTHDAY.forEach(([noteName, duration]) => {
      const freq = NOTES[noteName];
      if (freq) {
        playNote(ctx, freq, currentTime, duration);
        addHarmony(ctx, freq, currentTime, duration);
      }
      currentTime += duration + 0.08;
    });

    // Loop the song
    setTimeout(() => {
      if (musicPlaying) {
        musicNodes = [];
        playBirthdaySong();
      }
    }, songDuration * 1000 + 200);

  } catch (e) {
    console.warn('Audio not supported:', e);
  }
}

function stopMusic() {
  musicNodes.forEach(node => {
    try { node.stop(); } catch(e) {}
  });
  musicNodes = [];
  if (audioCtx) {
    audioCtx.suspend();
  }
}

/* ====================================================
   TOGGLE MUSIC (publicly accessible)
   ==================================================== */
function toggleMusic() {
  const icon = document.getElementById('musicIcon');
  const btn  = document.getElementById('musicToggle');

  if (musicPlaying) {
    musicPlaying = false;
    stopMusic();
    if (icon) icon.textContent = '🎵';
    if (btn)  btn.style.animation = 'none';
  } else {
    musicPlaying = true;
    playBirthdaySong();
    if (icon) icon.textContent = '🎶';
    if (btn)  btn.style.animation = 'musicPulse 0.5s ease-in-out infinite';
  }
}

/* ====================================================
   AUTO-START MUSIC ON FIRST INTERACTION
   ==================================================== */
function initMusic() {
  const startOnInteraction = () => {
    if (!musicPlaying) {
      musicPlaying = true;
      playBirthdaySong();
      const icon = document.getElementById('musicIcon');
      if (icon) icon.textContent = '🎶';
    }
    document.removeEventListener('click', startOnInteraction);
    document.removeEventListener('touchstart', startOnInteraction);
  };

  document.addEventListener('click', startOnInteraction);
  document.addEventListener('touchstart', startOnInteraction, { passive: true });
}
