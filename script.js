// ── Music Setup ──
const bgMusic = document.getElementById('bgMusic');
const voiceAudio = document.getElementById('voiceAudio');
let musicStarted = false;
let voicePlayed = false;

function startMusic() {
  if (!musicStarted) {
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeVolume(bgMusic, 0, 0.07, 3000);
    musicStarted = true;
  }
}

function fadeVolume(audio, from, to, duration) {
  const steps = 60;
  const stepTime = duration / steps;
  const diff = (to - from) / steps;
  let current = from;
  audio.volume = from;
  const interval = setInterval(() => {
    current += diff;
    audio.volume = Math.min(Math.max(current, 0), 1);
    if ((diff > 0 && current >= to) || (diff < 0 && current <= to)) {
      audio.volume = to;
      clearInterval(interval);
    }
  }, stepTime);
}

// ── Enter Site ──
function enterSite() {
  const enterScreen = document.getElementById('enterScreen');
  const mainSite = document.getElementById('mainSite');
  enterScreen.style.opacity = '0';
  setTimeout(() => {
    enterScreen.style.display = 'none';
    mainSite.classList.remove('hidden');
    startMusic();
    createPetals();
    typewriterEffect('heroName', 'Akansha');
    initScrollAnimations();
    initCounters();
    initStars();
    initOpenWhen();
    initUniverse();
    initVoiceSection();
    initLastPage();
    startNotifications();
  }, 1000);
}

// ── Typewriter ──
function typewriterEffect(elementId, text, speed = 120) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let i = 0;
  el.style.opacity = 1;
  el.textContent = '';
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  setTimeout(type, 800);
}

// ── Petals ──
function createPetals() {
  const container = document.getElementById('petalsContainer');
  const petals = ['🌸', '🌺', '🌷', '✿', '🌸'];
  for (let i = 0; i < 20; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${7 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 12}s`;
    petal.style.fontSize = `${0.9 + Math.random() * 0.9}rem`;
    container.appendChild(petal);
  }
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.classList.contains('cake-emoji')
          ? 'translateY(0) scale(1)' : 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(
    '.letter-label, .letter-body, .cake-label, .cake-emoji, .cake-instruction,' +
    '.vault-label, .vault-sublabel, .admit-label, .admit-sublabel, .admit-drawer,' +
    '.openwhen-label, .openwhen-sublabel, .future-label, .future-envelope'
  ).forEach(el => observer.observe(el));
}

// ── Counters ──
function calculateDaysTogether() {
  const start = new Date('2024-08-19');
  return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
}

function animateCounter(elementId, target, duration = 2000) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const days = calculateDaysTogether();
  let triggered = false;
  const els = document.querySelectorAll('.counter-label, .counter-item');

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        animateCounter('daysTogether', days, 2000);
        animateCounter('thoughtCount', days, 2500);
      }
    });
  }, { threshold: 0.2 }).observe(document.getElementById('counterSection'));

  els.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 }).observe(el);
  });
}

// ── Stars ──
const starMessages = [
  "I still remember the first time you made me laugh out of nowhere 🌙",
  "Sometimes I read our old chats just to smile 💬",
  "You looked extra pretty that day, not that I'd say it directly 😅",
  "I think about you more than I'll ever admit ⭐",
  "That moment on Dhanno? Still lives rent free in my head 🛵",
  "You have no idea how fast I open your messages 📱",
  "I smile like an idiot at my phone because of you 😭",
  "Honestly? You're my favorite person. Don't tell anyone 🤫",
  "I fall for you a little more every time you laugh 🌸",
  "Some nights I just hope you're having a good day 🌟"
];

function initStars() {
  const grid = document.getElementById('starsGrid');
  const messageBox = document.getElementById('starMessageBox');
  const messageText = document.getElementById('starMessageText');

  starMessages.forEach(msg => {
    const btn = document.createElement('button');
    btn.classList.add('star-btn');
    btn.textContent = '✦';
    btn.addEventListener('click', () => {
      document.querySelectorAll('.star-btn').forEach(s => s.classList.remove('revealed'));
      btn.classList.add('revealed');
      messageText.textContent = msg;
      messageBox.classList.add('visible');
    });
    grid.appendChild(btn);
  });

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stars-label, .stars-sublabel').forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = 'opacity 1s ease, transform 1s ease';
            el.style.opacity = '1'; el.style.transform = 'translateY(0)';
          }, i * 200);
        });
        document.querySelectorAll('.star-btn').forEach((star, i) => {
          setTimeout(() => {
            star.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            star.style.opacity = '1'; star.style.transform = 'scale(1)';
          }, i * 100);
        });
      }
    });
  }, { threshold: 0.2 }).observe(document.getElementById('starsSection'));
}

// ── Universe ──
function initUniverse() {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ['uLine1', 'uLine2', 'uLine3'].forEach((id, i) => {
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
              el.style.opacity = '1'; el.style.transform = 'translateY(0)';
            }
          }, i * 700);
        });
      }
    });
  }, { threshold: 0.4 }).observe(document.getElementById('universeSection'));
}

// ── Cake ──
let cakeTaps = 0;
function handleCakeTap() {
  const emoji = document.getElementById('cakeEmoji');
  const msg = document.getElementById('cakeMessage');
  const instruction = document.getElementById('cakeInstruction');
  cakeTaps++;
  if (cakeTaps === 1) {
    emoji.textContent = '🎂✨';
    instruction.textContent = 'now blow out the candles...';
    instruction.style.color = '#c9a96e';
  } else if (cakeTaps === 2) {
    emoji.textContent = '🎉';
    emoji.style.animation = 'none';
    instruction.style.display = 'none';
    msg.textContent = 'My wish was never the candles. It was you. 💗';
    msg.classList.add('visible');
  }
}

// ── Memory Vault ──
let vaultAttempts = 0;
const hints = [
  "The legendary scooty with lots of memories 🛵",
  "Starts with D...",
  "My old scooty's name ❤️"
];
const wrongMessages = [
  "Nopeee, try again ❤️",
  "Close... maybe think about our rides 👀",
  "Babyy, u definitely know this one 😭",
  "Babyy... 😭😭"
];

function checkVaultPassword() {
  const input = document.getElementById('vaultInput').value.trim().toLowerCase();
  const feedback = document.getElementById('vaultFeedback');
  const hint = document.getElementById('vaultHint');
  if (input === 'dhanno') {
    document.getElementById('vaultInput').disabled = true;
    document.querySelector('.vault-btn').disabled = true;
    feedback.textContent = 'There she is 🥹';
    feedback.style.color = '#c9a96e';
    hint.textContent = '';
    const granted = document.getElementById('vaultGranted');
    granted.style.display = 'block';
    granted.style.animation = 'fadeUp 1s ease forwards';
    setTimeout(() => {
      granted.style.display = 'none';
      const content = document.getElementById('vaultContent');
      content.style.display = 'block';
      content.style.animation = 'fadeUp 1s ease forwards';
      feedback.textContent = '';
    }, 2500);
  } else {
    const idx = Math.min(vaultAttempts, wrongMessages.length - 1);
    feedback.textContent = wrongMessages[idx];
    feedback.style.color = '#ff6b6b';
    if (vaultAttempts < hints.length) hint.textContent = hints[vaultAttempts];
    vaultAttempts++;
    document.getElementById('vaultInput').value = '';
  }
}

// ── Drawer ──
let drawerOpen = false;
function toggleDrawer() {
  const content = document.getElementById('drawerContent');
  const handle = document.querySelector('.drawer-handle');
  drawerOpen = !drawerOpen;
  content.classList.toggle('open', drawerOpen);
  handle.textContent = drawerOpen ? '▲ close' : '▼ open';
}

// ── Open When ──
const openWhenData = [
  { label: "Open when you're sad 🌧️", text: "Hey. I know things feel heavy right now. But I need you to know — you are so much stronger than whatever this moment feels like. I'm not going anywhere. And whenever you're ready to talk, I'm right here. Always. 💗" },
  { label: "Open when you miss me 🥺", text: "Good. That means I'm doing something right 😄 But seriously — I miss you too, probably more than I'd ever say out loud. Just know I'm thinking about you. I always am." },
  { label: "Open when you need motivation 💪", text: "You're literally one of the most capable people I know. I've watched you handle things that would break most people. Whatever you're facing right now — you've got this. And I've got you." },
  { label: "Open when you can't sleep 🌙", text: "Put your phone down after this, okay? 😄 But before you do — you're safe, you're loved, and tomorrow is going to be okay. Close your eyes. I hope you dream of something beautiful." },
  { label: "Open when you want to smile 🌸", text: "Remember that time we— actually, you already know which moment I'm thinking of 😭 That one. That's my favorite. You make ordinary moments feel like the best parts of my life." }
];

function initOpenWhen() {
  const grid = document.getElementById('openWhenGrid');
  openWhenData.forEach((item, i) => {
    const card = document.createElement('div');
    card.classList.add('openwhen-card');
    card.textContent = item.label;
    card.addEventListener('click', () => {
      document.querySelectorAll('.openwhen-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      openLetter(item.label, item.text);
    });
    grid.appendChild(card);
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            card.style.opacity = '1'; card.style.transform = 'translateY(0)';
          }, i * 120);
        }
      });
    }, { threshold: 0.1 }).observe(card);
  });

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ['.openwhen-label', '.openwhen-sublabel'].forEach((sel, i) => {
          setTimeout(() => {
            const el = document.querySelector(sel);
            if (el) { el.style.transition = 'opacity 1s ease, transform 1s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
          }, i * 200);
        });
      }
    });
  }, { threshold: 0.2 }).observe(document.getElementById('openWhenSection'));
}

function openLetter(label, text) {
  const letter = document.getElementById('openWhenLetter');
  document.getElementById('letterFor').textContent = label;
  document.getElementById('letterText').textContent = text;
  letter.classList.add('visible');
  setTimeout(() => letter.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

function closeLetter() {
  document.getElementById('openWhenLetter').classList.remove('visible');
  document.querySelectorAll('.openwhen-card').forEach(c => c.classList.remove('active'));
}

// ── Future Message ──
function openFutureMessage() {
  document.getElementById('futureEnvelope').style.display = 'none';
  document.getElementById('futureMessage').classList.add('visible');
}

// ── Voice Note Section ──
function initVoiceSection() {
  const section = document.getElementById('voiceSection');
  const intro = document.getElementById('voiceIntro');
  const orbWrap = document.getElementById('voiceOrbWrap');
  const hint = document.getElementById('voiceHint');
  const tapHint = document.getElementById('voiceTapHint');

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // fade in intro line
        setTimeout(() => {
          intro.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
          intro.style.opacity = '1'; intro.style.transform = 'translateY(0)';
        }, 300);
        // orb appears
        setTimeout(() => {
          orbWrap.classList.add('visible');
        }, 1200);
        // hint lines
        setTimeout(() => {
          hint.style.transition = 'opacity 1s ease, transform 1s ease';
          hint.style.opacity = '1'; hint.style.transform = 'translateY(0)';
        }, 2000);
        setTimeout(() => {
          tapHint.style.transition = 'opacity 1s ease, transform 1s ease';
          tapHint.style.opacity = '1'; tapHint.style.transform = 'translateY(0)';
        }, 2600);
      }
    });
  }, { threshold: 0.3 }).observe(section);
}

function handleOrbTap() {
  if (voicePlayed) return;
  voicePlayed = true;

  const orb = document.getElementById('voiceOrb');
  const waveform = document.getElementById('voiceWaveform');
  const tapHint = document.getElementById('voiceTapHint');
  const hint = document.getElementById('voiceHint');

  // ripple on tap
  orb.style.transform = 'translate(-50%, -50%) scale(1.15)';
  setTimeout(() => { orb.style.transform = 'translate(-50%, -50%) scale(1)'; }, 200);

  tapHint.style.opacity = '0';
  hint.textContent = 'listen...';

  // duck music
  fadeVolume(bgMusic, bgMusic.volume, 0.015, 800);

  // 0.7s pause then play voice
  setTimeout(() => {
    voiceAudio.play().catch(() => {});
    waveform.style.display = 'block';

    voiceAudio.addEventListener('ended', handleVoiceEnded, { once: true });
  }, 700);
}

function handleVoiceEnded() {
  const waveform = document.getElementById('voiceWaveform');
  const ending = document.getElementById('voiceEnding');
  const line1 = document.getElementById('endingLine1');
  const divider = document.getElementById('endingDivider');
  const line2 = document.getElementById('endingLine2');
  const hint = document.getElementById('voiceHint');

  waveform.style.display = 'none';
  hint.textContent = '';

  // music swells back
  fadeVolume(bgMusic, bgMusic.volume, 0.07, 2000);

  // silence beat then lines appear
  ending.classList.add('visible');

  setTimeout(() => {
    line1.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
    line1.style.opacity = '1'; line1.style.transform = 'translateY(0)';
  }, 800);

  setTimeout(() => {
    divider.classList.add('drawn');
  }, 2200);

  setTimeout(() => {
    line2.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
    line2.style.opacity = '1'; line2.style.transform = 'translateY(0)';
  }, 3800);
}

// ── Last Page ──
function initLastPage() {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delays = [0, 600, 1200, 2000, 2800, 3600];
        ['lastLine1', 'lastLine2', 'lastLine3'].forEach((id, i) => {
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) { el.style.transition = 'opacity 1.2s ease, transform 1.2s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
          }, delays[i]);
        });
        setTimeout(() => {
          const d = document.getElementById('lastDivider');
          if (d) d.classList.add('expanded');
        }, delays[3]);
        setTimeout(() => {
          typewriterEffect('lastNameEl', 'Akansha', 100);
        }, delays[4]);
        setTimeout(() => {
          const c = document.getElementById('lastCredit');
          if (c) { c.style.transition = 'opacity 1.5s ease'; c.style.opacity = '1'; }
        }, delays[5]);
      }
    });
  }, { threshold: 0.3 }).observe(document.getElementById('lastSection'));
}

// ── Notifications ──
const notifications = [
  { icon: '💌', title: 'New Memory Unlocked', body: 'Akshit.exe is thinking about Akansha again...' },
  { icon: '🌸', title: 'Reminder', body: "You are someone's favorite person today 🥹" },
  { icon: '📱', title: 'Activity Detected', body: 'Akshit opened this website for the 3rd time today' },
  { icon: '💗', title: 'Daily Update', body: 'Days spent smiling because of you: still counting' },
  { icon: '🎂', title: 'Birthday Alert', body: 'Today is the best day of the year. Because of you.' }
];

function showNotification(notif) {
  const popup = document.getElementById('notifPopup');
  document.getElementById('notifIcon').textContent = notif.icon;
  document.getElementById('notifTitle').textContent = notif.title;
  document.getElementById('notifBody').textContent = notif.body;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 3500);
}

function startNotifications() {
  let index = 0;
  setTimeout(() => {
    showNotification(notifications[index % notifications.length]);
    index++;
    setInterval(() => {
      showNotification(notifications[index % notifications.length]);
      index++;
    }, 18000);
  }, 8000);
}