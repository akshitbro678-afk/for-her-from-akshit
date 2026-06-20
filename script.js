// ── Music Setup ──
const bgMusic = document.getElementById('bgMusic');
const voiceAudio = document.getElementById('voiceAudio');
let musicStarted = false;
let voicePlayed = false;

function startMusic() {
  if (!musicStarted) {
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeVolume(bgMusic, 0, 0.18, 5000);
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

// ══════════════════════════════════════════
// ── PARTICLE BACKGROUND (Three.js) ──
// Soft ambient golden/rose particles behind the
// entry screen only. Mouse-reactive drift.
// Stops + cleans up once the site is entered.
// ══════════════════════════════════════════
let particleRenderer, particleScene, particleCamera, particlePoints;
let particleAnimId = null;
let mouseX = 0, mouseY = 0;

function initParticleBackground() {
  if (!window.THREE) return; // fails silently if CDN didn't load — no break
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  particleScene = new THREE.Scene();
  particleCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  particleCamera.position.z = 50;

  particleRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  particleRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  particleRenderer.setSize(window.innerWidth, window.innerHeight);

  const count = window.innerWidth < 600 ? 220 : 420;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  // warm palette matching the site: gold #c9a96e and rose #e9a1b7
  const palette = [
    [0.79, 0.66, 0.43], // gold
    [0.91, 0.63, 0.72], // rose
    [0.96, 0.94, 0.92]  // soft cream
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  particlePoints = new THREE.Points(geometry, material);
  particleScene.add(particlePoints);

  window.addEventListener('mousemove', onParticleMouseMove);
  window.addEventListener('touchmove', onParticleTouchMove, { passive: true });
  window.addEventListener('resize', onParticleResize);

  animateParticles();
}

function onParticleMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

function onParticleTouchMove(e) {
  if (!e.touches || !e.touches[0]) return;
  mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
}

function onParticleResize() {
  if (!particleRenderer || !particleCamera) return;
  particleCamera.aspect = window.innerWidth / window.innerHeight;
  particleCamera.updateProjectionMatrix();
  particleRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animateParticles() {
  if (!particleRenderer || !particlePoints) return;

  particlePoints.rotation.y += 0.0006;
  particlePoints.rotation.x += 0.0002;

  // gentle camera drift toward cursor — subtle, not jumpy
  particleCamera.position.x += (mouseX * 4 - particleCamera.position.x) * 0.02;
  particleCamera.position.y += (-mouseY * 4 - particleCamera.position.y) * 0.02;
  particleCamera.lookAt(particleScene.position);

  particleRenderer.render(particleScene, particleCamera);
  particleAnimId = requestAnimationFrame(animateParticles);
}

function destroyParticleBackground() {
  if (particleAnimId) cancelAnimationFrame(particleAnimId);
  window.removeEventListener('mousemove', onParticleMouseMove);
  window.removeEventListener('touchmove', onParticleTouchMove);
  window.removeEventListener('resize', onParticleResize);
  if (particleRenderer) {
    particleRenderer.dispose();
    particleRenderer = null;
  }
  particleScene = null;
  particleCamera = null;
  particlePoints = null;
}

// ── Enter Site ──
function enterSite() {
  const enterScreen = document.getElementById('enterScreen');
  const mainSite = document.getElementById('mainSite');
  enterScreen.style.opacity = '0';
  setTimeout(() => {
    enterScreen.style.display = 'none';
    destroyParticleBackground(); // free up GPU once we don't need it anymore
    mainSite.classList.remove('hidden');
    startMusic();
    createPetals();
    typewriterEffect('heroName', 'Akansha');
    initScrollAnimations();
    initCounters();
    initStars();
    initOpenWhen();
    initUniverse();
    initCake();
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

// ══════════════════════════════════════════
// ── Scroll Animations — now via GSAP ScrollTrigger ──
// Same reveal behavior as before (fade + rise on entry),
// just smoother and using the industry-standard tool
// instead of manual IntersectionObserver wiring.
// ══════════════════════════════════════════
function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const selector =
    '.letter-label, .letter-body,' +
    '.vault-label, .vault-sublabel, .admit-label, .admit-sublabel, .admit-drawer,' +
    '.openwhen-label, .openwhen-sublabel, .future-label, .future-envelope';

  ScrollTrigger.batch(selector, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.1
      });
    }
  });
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

  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: '#counterSection',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        animateCounter('daysTogether', days, 2000);
        animateCounter('thoughtCount', days, 2500);
      }
    });

    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '#counterSection',
        start: 'top 80%',
        once: true
      }
    });
  } else {
    // fallback (no GSAP/ScrollTrigger available)
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

  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: '#starsSection',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to('.stars-label, .stars-sublabel', {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.2
        });
        gsap.to('.star-btn', {
          opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1
        });
      }
    });
  } else {
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
}

// ── Universe ──
function initUniverse() {
  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: '#universeSection',
      start: 'top 60%',
      once: true,
      onEnter: () => {
        gsap.to('#uLine1, #uLine2, #uLine3', {
          opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', stagger: 0.7
        });
      }
    });
  } else {
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
}

// ══════════════════════════════════════════
// ── CAKE — fully rewritten ──
// ══════════════════════════════════════════
// Layer heights: sponge-1=54, cream-1=16  → layer-1 top = 63+54+16 = 133
//                sponge-2=50, cream-2=16  → layer-2 top = 133+50+16 = 199 → bottom=199
//                sponge-3=45              → layer-3 top = 199+45     = 244 → bottom=244? 
// We set:
//   cake-layer-1  bottom: 58px   (sits on plate which is bottom:43)
//   cake-layer-2  bottom: 128px  (58 + 54 sponge + 16 cream = 128)
//   cake-layer-3  bottom: 194px  (128 + 50 sponge + 16 cream = 194)
//   cake-glaze    bottom: 239px  (194 + 45 sponge = 239)
//   cherries/sprinkles/candle all relative to 239
// ══════════════════════════════════════════

let cakeBuilt = false;
let candleLit = false;
let cakeWishShown = false;

function initCake() {
  const section = document.getElementById('cakeSection');
  const candle = document.getElementById('cakeCandle');

  if (candle) {
    candle.addEventListener('click', blowCandle);
    candle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blowCandle(); }
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const label = document.querySelector('.cake-label');
        if (label) {
          gsap.to(label, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });
        }
      }
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (!cakeBuilt) {
          cakeBuilt = true;
          buildCakeTimeline();
        }
      }
    });
  } else {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const label = document.querySelector('.cake-label');
          if (label) {
            label.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
            label.style.opacity = '1'; label.style.transform = 'translateY(0)';
          }
        }
      });
    }, { threshold: 0.2 }).observe(section);

    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !cakeBuilt) {
          cakeBuilt = true;
          buildCakeTimeline();
        }
      });
    }, { threshold: 0.25 }).observe(section);
  }
}

function buildCakeTimeline() {
  const tapHint = document.getElementById('cakeTapHint');
  if (!window.gsap) return;
  const gsap = window.gsap;

  // ── reset all elements ──
  gsap.set([
    '.cake-shadow', '#cakePlate', '.cake-layer', '.cake-cream',
    '#pipingBag', '#chocolateStream', '#chocolateSplash', '#cakeGlaze',
    '.glaze-shine', '.glaze-drip', '.cherry', '.sprinkle',
    '#cakeHand', '#cakeCandle', '#candleFlame',
    '.cake-smoke span', '#cakeTapHint', '#wishText', '#wishHearts'
  ], { opacity: 0, clearProps: 'will-change' });

  gsap.set('#cakePlate',        { xPercent: -50, y: -120, scaleX: 0.7 });
  gsap.set('.cake-shadow',      { xPercent: -50, scaleX: 0.3 });
  gsap.set('.cake-layer',       { xPercent: -50, y: -80 });
  gsap.set('.cake-cream',       { scaleX: 0, transformOrigin: 'left center' });
  gsap.set('#pipingBag',        { x: -110, y: 200, rotation: -10, opacity: 0 });
  gsap.set('#chocolateStream',  { xPercent: -50, scaleY: 0, transformOrigin: 'top center' });
  gsap.set('#chocolateSplash',  { xPercent: -50, scale: 0.1 });
  gsap.set('#cakeGlaze',        { xPercent: -50, scaleX: 0.1, transformOrigin: 'center' });
  gsap.set('.glaze-drip',       { scaleY: 0, transformOrigin: 'top center' });
  gsap.set('.cherry',           { y: -80, scale: 0.7, rotation: -15 });
  gsap.set('.sprinkle',         { y: -50, opacity: 0 });
  gsap.set('#cakeHand',         { x: 175, opacity: 0 });
  gsap.set('#cakeCandle',       { xPercent: -50, y: -40, scale: 0.85 });
  gsap.set('#candleFlame',      { scale: 0, transformOrigin: '50% 90%' });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => {
      candleLit = true;
      if (tapHint) gsap.to(tapHint, { opacity: 1, y: 0, duration: 0.8 });
    }
  });

  // plate + shadow
  tl.to('.cake-shadow', { opacity: 1, scaleX: 1, duration: 0.5 }, 0)
    .to('#cakePlate', { opacity: 1, y: 0, scaleX: 1, duration: 0.7, ease: 'bounce.out' }, 0.1)
    .to({}, { duration: 0.2 });

  // layer drop helper
  const dropLayer = (layerSel, crumbsSel) => {
    tl.to(layerSel, { opacity: 1, y: 0, duration: 0.75, ease: 'bounce.out' })
      .fromTo(`${crumbsSel} span`,
        { opacity: 0, y: -4, scale: 0.3 },
        { opacity: 1, y: 12, scale: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out' }, '<0.22')
      .to(`${crumbsSel} span`, { opacity: 0, duration: 0.4, stagger: 0.03 }, '>-0.05')
      .to({}, { duration: 0.18 });
  };

  // cream pipe helper
  const pipeCream = (creamSel, bagY) => {
    tl.set('#pipingBag', { x: -110, y: bagY, rotation: -10, opacity: 0 })
      .to('#pipingBag', { opacity: 1, x: -52, duration: 0.38, ease: 'power2.out' })
      .to('#pipingBag', { x: 120, duration: 1.0, ease: 'sine.inOut' })
      .to(creamSel, { opacity: 1, scaleX: 1, duration: 1.0, ease: 'sine.inOut' }, '<0.04')
      .to('#pipingBag', { x: 215, opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to({}, { duration: 0.2 });
  };

  dropLayer('.cake-layer-1', '#crumbsOne');
  pipeCream('.cake-cream-1', 190);
  dropLayer('.cake-layer-2', '#crumbsTwo');
  pipeCream('.cake-cream-2', 135);
  dropLayer('.cake-layer-3', '#crumbsThree');

  // chocolate glaze pour
  tl.to('#chocolateStream', { opacity: 1, scaleY: 1, duration: 0.7, ease: 'power1.in' })
    .to('#chocolateSplash', { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, '<0.42')
    .to('#cakeGlaze', { opacity: 1, scaleX: 1, duration: 1.0, ease: 'power3.out' }, '<0.15')
    .to('.glaze-shine', { opacity: 1, duration: 0.5 }, '<0.3')
    .to('.glaze-drip', { opacity: 1, scaleY: 1, duration: 0.65, stagger: 0.07, ease: 'sine.out' }, '<0.5')
    .to('#chocolateStream', { opacity: 0, scaleY: 0.15, duration: 0.38, ease: 'power2.in' }, '>-0.18')
    .to('#chocolateSplash', { opacity: 0.6, scale: 0.7, duration: 0.3 }, '<')
    .to({}, { duration: 0.25 });

  // cherries bounce in one by one
  ['.cherry-1', '.cherry-2', '.cherry-3'].forEach((sel, idx) => {
    tl.to(sel, { opacity: 1, y: 0, rotation: 0, scale: 1.08, duration: 0.48, ease: 'power3.in' }, idx === 0 ? '>' : '>-0.1')
      .to(sel, { y: -5, scale: 0.95, duration: 0.15, ease: 'power2.out' })
      .to(sel, { y: 0, scale: 1, duration: 0.28, ease: 'elastic.out(1.2, 0.5)' });
  });
  tl.to({}, { duration: 0.22 });

  // sprinkles rain
  tl.to('.sprinkle', { opacity: 1, y: 0, duration: 0.6, stagger: 0.045, ease: 'bounce.out' })
    .to({}, { duration: 0.2 });

  // hand places candle
  tl.to('#cakeHand', { opacity: 1, x: 0, duration: 0.65, ease: 'power2.out' })
    .to('#cakeCandle', { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power2.out' }, '<0.22')
    .to('#cakeHand', { x: 185, opacity: 0, duration: 0.55, ease: 'power2.in' })
    .to({}, { duration: 0.18 });

  // flame ignites
  tl.to('#candleFlame', {
    opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)',
    onComplete: () => {
      const f = document.getElementById('candleFlame');
      if (f) f.classList.add('lit');
    }
  });
}

function blowCandle() {
  if (!candleLit || cakeWishShown || !window.gsap) return;
  candleLit = false;
  cakeWishShown = true;

  navigator.vibrate && navigator.vibrate([30, 20, 50]);

  const gsap = window.gsap;
  const flame = document.getElementById('candleFlame');
  const tapHint = document.getElementById('cakeTapHint');
  const wishText = document.getElementById('wishText');
  const wishHearts = document.getElementById('wishHearts');
  const section = document.getElementById('cakeSection');

  if (flame) flame.classList.remove('lit');
  if (wishText) wishText.textContent = '';
  if (section) section.classList.add('cake-night');

  gsap.timeline()
    .to(tapHint, { opacity: 0, y: -6, duration: 0.3 }, 0)
    .to(flame, { scale: 0.05, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0)
    .fromTo('.cake-smoke span',
      { opacity: 0, y: 0, x: 0, scale: 0.3 },
      { opacity: 0.7, y: -52, x: (i) => [-9, 9, -2][i], scale: 1.6,
        duration: 1.4, stagger: 0.14, ease: 'sine.out' }, 0.2)
    .to('.cake-smoke span', { opacity: 0, duration: 0.5, stagger: 0.1 }, 1.1)
    .add(() => {
      // typewriter wish
      const text = 'Happiest Birthday Darlingg ❣️';
      let i = 0;
      gsap.to(wishText, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.1 });
      function typeWish() {
        if (i < text.length) {
          wishText.textContent += text.charAt(i);
          i++;
          setTimeout(typeWish, 68);
        }
      }
      typeWish();
    }, 1.2)
    .fromTo(wishText,
      { opacity: 0, y: 20, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }, 1.2)
    .to(wishHearts, { opacity: 1, duration: 0.5 }, 1.8)
    .fromTo('.wish-heart',
      { opacity: 0, y: 18, scale: 0.5 },
      { opacity: 0.9, y: -30, scale: 1, duration: 2.2,
        stagger: 0.16, repeat: -1, repeatDelay: 0.3, ease: 'sine.inOut' }, 1.88);
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

    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(card, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.12, ease: 'power2.out' });
        }
      });
    } else {
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
    }
  });

  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: '#openWhenSection',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to('.openwhen-label, .openwhen-sublabel', {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.2
        });
      }
    });
  } else {
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

  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(intro, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.3 });
        setTimeout(() => { orbWrap.classList.add('visible'); }, 1200);
        gsap.to(hint, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 2.0 });
        gsap.to(tapHint, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 2.6 });
      }
    });
  } else {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            intro.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
            intro.style.opacity = '1'; intro.style.transform = 'translateY(0)';
          }, 300);
          setTimeout(() => { orbWrap.classList.add('visible'); }, 1200);
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
}

function handleOrbTap() {
  if (voicePlayed) return;
  voicePlayed = true;

  const orb = document.getElementById('voiceOrb');
  const waveform = document.getElementById('voiceWaveform');
  const tapHint = document.getElementById('voiceTapHint');
  const hint = document.getElementById('voiceHint');

  orb.style.transform = 'translate(-50%, -50%) scale(1.15)';
  setTimeout(() => { orb.style.transform = 'translate(-50%, -50%) scale(1)'; }, 200);

  tapHint.style.opacity = '0';
  hint.textContent = 'listen...';

  fadeVolume(bgMusic, bgMusic.volume, 0.015, 800);

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
  fadeVolume(bgMusic, bgMusic.volume, 0.07, 2000);
  ending.classList.add('visible');

  setTimeout(() => {
    line1.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
    line1.style.opacity = '1'; line1.style.transform = 'translateY(0)';
  }, 800);
  setTimeout(() => { divider.classList.add('drawn'); }, 2200);
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
        setTimeout(() => { typewriterEffect('lastNameEl', 'Akansha', 100); }, delays[4]);
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

// ── Boot particle background on the entry screen immediately ──
initParticleBackground();