const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'close −' : 'menu +';
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = 'menu +';
}));
document.querySelector('#year').textContent = new Date().getFullYear();


// Project index interactions: hover previews the project, click opens the detail sheet.
const projectData = {
  mic: {
    index: '01', category: 'AI / SPEECH', title: 'Baby Steps to the Mic',
    description: 'An AI-powered public speaking coach for impromptu practice: generate a topic, speak with live transcription, and receive structured feedback on strengths and ways to improve.',
    tags: ['Vanilla JavaScript', 'Web Speech API', 'Claude API', 'Vercel'],
    repo: 'https://github.com/adityarghh/Baby-steps-to-the-mic',
    live: 'https://baby-steps-to-the-mic-adityarghhs-projects.vercel.app/',
    preview: 'preview-mic'
  },
  paperbrain: {
    index: '02', category: 'PRODUCTIVITY', title: 'Paperbrain',
    description: 'A focus and discipline tracker with a mechanical flip-clock timer, planning vs. actual work tracking, focus analytics, and a contribution-style activity heatmap.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
    repo: 'https://github.com/adityarghh/Paperbrain',
    live: 'https://paperbrain.vercel.app/',
    preview: 'preview-paperbrain'
  },
  more: {
    index: '03', category: 'AI / LEARNING', title: 'The More I Know, The Better',
    description: 'A visual learning roadmap builder that uses AI to organize a subject into a dependency-aware path, with study guides and curated learning resources.',
    tags: ['AI', 'React', 'Learning roadmaps'],
    repo: 'https://github.com/adityarghh/The-More-I-Know-The-Better',
    live: 'https://themoreiknowthebetter.ai.studio/',
    preview: 'preview-roadmap'
  }
};
const rows = document.querySelectorAll('.project-row');
const hoverPreview = document.querySelector('.project-hover-preview');
const previewNumber = document.querySelector('.preview-number');
const previewToggle = document.querySelector('#preview-toggle-input');
let previewsEnabled = previewToggle ? previewToggle.checked : true;
hoverPreview?.classList.toggle('previews-disabled', !previewsEnabled);
previewToggle?.addEventListener('change', () => {
  previewsEnabled = previewToggle.checked;
  hoverPreview?.classList.toggle('previews-disabled', !previewsEnabled);
  if (!previewsEnabled) hoverPreview?.classList.remove('is-visible');
});
const dialog = document.querySelector('.project-dialog');
const closeDialog = document.querySelector('.dialog-close');

let pointerX = window.innerWidth * 0.72;
let pointerY = window.innerHeight * 0.5;
let targetX = pointerX;
let targetY = pointerY;
let frameRequested = false;

function placePreview(x, y) {
  if (!hoverPreview) return;
  const bounds = hoverPreview.getBoundingClientRect();
  const margin = 18;
  const gap = 16;
  // Keep the cursor near the preview's bottom-left corner, flipping only when an edge requires it.
  let left = x + gap;
  let top = y - bounds.height - gap;
  if (left + bounds.width > window.innerWidth - margin) left = x - bounds.width - gap;
  if (top < margin) top = y + gap;
  targetX = Math.max(margin, Math.min(window.innerWidth - bounds.width - margin, left));
  targetY = Math.max(margin, Math.min(window.innerHeight - bounds.height - margin, top));
  if (!frameRequested) {
    frameRequested = true;
    requestAnimationFrame(animatePreview);
  }
}
function animatePreview() {
  frameRequested = false;
  // Lower interpolation makes the preview glide behind the cursor instead of snapping to it.
  pointerX += (targetX - pointerX) * 0.10;
  pointerY += (targetY - pointerY) * 0.10;
  if (hoverPreview) {
    hoverPreview.style.left = `${pointerX}px`;
    hoverPreview.style.top = `${pointerY}px`;
  }
  if (Math.abs(targetX - pointerX) > 0.35 || Math.abs(targetY - pointerY) > 0.35) {
    frameRequested = true;
    requestAnimationFrame(animatePreview);
  }
}
function activatePreview(key, event) {
  if (!previewsEnabled) return;
  const item = projectData[key];
  if (!item || !hoverPreview) return;
  hoverPreview.querySelectorAll('.preview-art').forEach(el => el.classList.toggle('is-active', el.classList.contains(item.preview)));
  if (previewNumber) previewNumber.textContent = `${item.index} / 03`;
  hoverPreview.classList.add('is-visible');
  if (event && typeof event.clientX === 'number') {
    placePreview(event.clientX, event.clientY);
  }
}
function openProject(key) {
  const item = projectData[key];
  if (!item || !dialog) return;
  dialog.querySelector('.dialog-index').textContent = `PROJECT / ${item.index}`;
  dialog.querySelector('.dialog-category').textContent = item.category;
  dialog.querySelector('#dialog-title').textContent = item.title;
  dialog.querySelector('.dialog-description').textContent = item.description;
  dialog.querySelector('.dialog-tags').innerHTML = item.tags.map(tag => `<span>${tag}</span>`).join('');
  const visual = dialog.querySelector('.dialog-visual');
  visual.innerHTML = '';
  const sourcePreview = hoverPreview.querySelector(`.${item.preview}`);
  if (sourcePreview) {
    const clone = sourcePreview.cloneNode(true);
    clone.classList.add('is-active');
    visual.appendChild(clone);
  }
  const links = [];
  if (item.live) links.push(`<a href="${item.live}" target="_blank" rel="noreferrer">OPEN LIVE SITE ↗</a>`);
  if (item.repo) links.push(`<a href="${item.repo}" target="_blank" rel="noreferrer">GITHUB REPOSITORY ↗</a>`);
  dialog.querySelector('.dialog-links').innerHTML = links.join('');
  hoverPreview.classList.remove('is-visible');
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
rows.forEach(row => {
  row.addEventListener('pointerenter', event => activatePreview(row.dataset.project, event));
  row.addEventListener('pointermove', event => {
    if (!previewsEnabled || event.pointerType === 'touch') return;
    placePreview(event.clientX, event.clientY);
  });
  row.addEventListener('focus', () => activatePreview(row.dataset.project));
  row.addEventListener('pointerleave', () => {
    if (!document.querySelector('.project-row:focus')) hoverPreview?.classList.remove('is-visible');
  });
  row.addEventListener('click', () => {
    if (row.dataset.project === 'mic') {
      window.location.href = 'baby-steps-case-study.html';
      return;
    }
    openProject(row.dataset.project);
  });
});
closeDialog?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hoverPreview?.classList.remove('is-visible');
});


/* About dialog */
const aboutDialog = document.querySelector('.about-dialog');
const aboutTrigger = document.querySelector('.about-more');
let aboutScrollY = 0;

aboutTrigger?.addEventListener('click', () => {
  if (!aboutDialog) return;
  // Keep the current page position and open the panel without jumping the document.
  aboutScrollY = window.scrollY;
  aboutDialog.showModal();
  document.body.classList.add('about-dialog-open');
});
document.querySelector('.about-dialog-close')?.addEventListener('click', () => aboutDialog?.close());
aboutDialog?.addEventListener('click', event => {
  if (event.target === aboutDialog) aboutDialog.close();
});
aboutDialog?.addEventListener('close', () => {
  document.body.classList.remove('about-dialog-open');
  // Restore scroll after the browser finishes the native dialog close cycle.
  requestAnimationFrame(() => window.scrollTo({ top: aboutScrollY, behavior: 'auto' }));
});


/* Contact form overlay + Formspree submission */
const contactDialog = document.querySelector('.contact-dialog');
const contactOpen = document.querySelector('.contact-open');
const contactForm = document.querySelector('.contact-form');
const contactStatus = document.querySelector('.contact-form-status');
const contactSubmit = document.querySelector('.contact-submit');
let contactScrollY = 0;

contactOpen?.addEventListener('click', () => {
  if (!contactDialog) return;
  contactScrollY = window.scrollY;
  contactDialog.showModal();
  document.body.classList.add('contact-dialog-open');
});
document.querySelector('.contact-dialog-close')?.addEventListener('click', () => contactDialog?.close());
contactDialog?.addEventListener('click', event => {
  if (event.target === contactDialog) contactDialog.close();
});
contactDialog?.addEventListener('close', () => {
  document.body.classList.remove('contact-dialog-open');
  requestAnimationFrame(() => window.scrollTo({ top: contactScrollY, behavior: 'auto' }));
});

contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const endpoint = contactForm.getAttribute('action') || '';
  if (endpoint.includes('YOUR_FORM_ID')) {
    contactStatus.textContent = 'Almost ready — connect your Formspree form ID to enable sending. The form layout is in place.';
    contactStatus.classList.add('is-error');
    return;
  }
  if (contactForm.elements.namedItem('_gotcha')?.value) return;
  contactSubmit.disabled = true;
  contactSubmit.innerHTML = 'Sending… <span>↗</span>';
  contactStatus.classList.remove('is-error','is-success');
  contactStatus.textContent = 'Sending your message…';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Submission failed');
    contactForm.reset();
    contactStatus.textContent = 'Message sent. Thanks for reaching out — I’ll get back to you.';
    contactStatus.classList.add('is-success');
  } catch (error) {
    contactStatus.textContent = 'That didn’t go through. Please try again, or use the direct Gmail link below.';
    contactStatus.classList.add('is-error');
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.innerHTML = 'Send message <span>↗</span>';
  }
});


/* Theme switch: preserves the original header layout and remembers the selected theme. */
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-toggle-icon');
const themeText = document.querySelector('.theme-toggle-text');
const themeColorMeta = document.querySelector('#theme-color-meta');
function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
  if (themeText) themeText.textContent = isDark ? 'LIGHT' : 'DARK';
  if (themeColorMeta) themeColorMeta.setAttribute('content', isDark ? '#171916' : '#eeeae2');
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('aditya-portfolio-theme') || 'light'; } catch (_) {}
applyTheme(savedTheme);
themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  try { localStorage.setItem('aditya-portfolio-theme', nextTheme); } catch (_) {}
});

/* Tiny interactive details — no dependency, and no motion when reduced motion is preferred. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('.hero-kicker, .hero h1, .hero-aside, .hero-bottom, .section-heading, .project-row, .about-grid, .now-card, .contact-grid, footer, .case-hero, .case-section, .case-end');
if (revealTargets.length && !reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  revealTargets.forEach((el, i) => { el.classList.add('reveal-on-scroll'); if (el.classList.contains('project-row')) el.style.transitionDelay = `${Math.min(i % 3, 2) * 70}ms`; });
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
}

// Live local clock: a tiny changing detail rather than a large status widget.
function updatePortfolioClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  document.querySelectorAll('.live-clock').forEach(el => { el.textContent = time; });
}
updatePortfolioClock();
window.setInterval(updatePortfolioClock, 1000);

// The star has one small hidden note. Click again to cycle through it.
const surpriseTrigger = document.querySelector('.surprise-trigger');
const surpriseToast = document.querySelector('.surprise-toast');
const surpriseNotes = ['Curiosity is a perfectly valid reason to open another tab.', 'This star has no roadmap. It is just vibing.', 'You found the tiny unnecessary thing. Excellent.'];
let surpriseIndex = 0;
function revealSurprise() {
  if (!surpriseToast || !surpriseTrigger) return;
  surpriseToast.textContent = surpriseNotes[surpriseIndex % surpriseNotes.length];
  surpriseToast.hidden = false;
  surpriseIndex += 1;
}
surpriseTrigger?.addEventListener('click', revealSurprise);
surpriseTrigger?.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); revealSurprise(); } });

// One small music easter egg, deliberately tucked into the existing listening card.
const musicMark = document.querySelector('.music-mark');
function toggleMusicWhisper() {
  if (!musicMark) return;
  const card = musicMark.closest('.now-card');
  if (!card) return;
  let whisper = card.querySelector('.music-whisper');
  if (whisper) { whisper.remove(); musicMark.classList.remove('is-revealed'); return; }
  whisper = document.createElement('span');
  whisper.className = 'music-whisper';
  whisper.textContent = 'There, there. You found it. ↗';
  card.append(whisper);
  musicMark.classList.add('is-revealed');
}
musicMark?.addEventListener('click', toggleMusicWhisper);
musicMark?.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleMusicWhisper(); } });


// Gentle pointer response for existing content — no custom cursor or constant animation.
const tiltTargets = document.querySelectorAll('.project-row, .now-card');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (finePointer && !reduceMotion) {
  tiltTargets.forEach(el => {
    el.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-dy * 1.15).toFixed(2)}deg) rotateY(${(dx * 1.35).toFixed(2)}deg) translateY(-1px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    el.addEventListener('blur', () => { el.style.transform = ''; }, true);
  });
}

// Make hidden annotations usable on touch screens as well as hover/focus.
document.querySelectorAll('.curious-word[data-note]').forEach(word => {
  word.setAttribute('aria-label', `${word.textContent.trim()}. Additional note: ${word.dataset.note}`);
  word.addEventListener('click', event => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    event.stopPropagation();
    const wasOpen = word.classList.contains('is-note-open');
    document.querySelectorAll('.curious-word.is-note-open').forEach(item => item.classList.remove('is-note-open'));
    if (!wasOpen) word.classList.add('is-note-open');
  });
  word.addEventListener('keydown', event => {
    if (event.key === 'Escape') word.classList.remove('is-note-open');
  });
});
document.addEventListener('click', event => {
  if (!event.target.closest('.curious-word')) document.querySelectorAll('.curious-word.is-note-open').forEach(item => item.classList.remove('is-note-open'));
});

// Dismiss the tiny star note on outside click or Escape.
document.addEventListener('click', event => {
  if (surpriseToast && !surpriseToast.hidden && !event.target.closest('.surprise-trigger') && !event.target.closest('.surprise-toast')) {
    surpriseToast.hidden = true;
  }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && surpriseToast) surpriseToast.hidden = true; });
