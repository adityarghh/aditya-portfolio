const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'close −' : 'menu +';
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'menu +';
}));
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
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


// Editorial accordion: keep the case study compact while letting readers choose what to open.
const caseSections = [...document.querySelectorAll('main .case-section')];
caseSections.forEach((section, index) => {
  const marker = section.querySelector(':scope > .section-marker');
  const prose = section.querySelector(':scope > .case-prose');
  const heading = prose?.querySelector('h2');
  if (!marker || !prose || !heading) return;

  const details = document.createElement('details');
  details.className = 'case-accordion';
  details.open = index === 0;

  const summary = document.createElement('summary');
  summary.className = 'case-accordion-summary';
  const markerClone = marker.cloneNode(true);
  const title = heading.cloneNode(true);
  title.className = 'case-accordion-title';
  const titleWrap = document.createElement('div');
  titleWrap.className = 'case-accordion-heading';
  titleWrap.append(title, Object.assign(document.createElement('span'), { className: 'case-accordion-hint', textContent: 'OPEN SECTION' }));
  const chevron = document.createElement('span');
  chevron.className = 'case-accordion-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '+';
  summary.append(markerClone, titleWrap, chevron);

  const content = document.createElement('div');
  content.className = 'case-accordion-content';
  [...section.children].forEach(child => {
    if (child === marker) return;
    if (child === prose) {
      const body = prose.cloneNode(true);
      body.querySelector('h2')?.remove();
      content.append(body);
    } else {
      content.append(child.cloneNode(true));
    }
  });
  details.append(summary, content);
  section.replaceChildren(details);
  section.classList.add('case-accordion-section');
});

// Only one section stays open at a time.
document.querySelectorAll('.case-accordion').forEach(current => {
  current.addEventListener('toggle', () => {
    if (!current.open) return;
    document.querySelectorAll('.case-accordion[open]').forEach(other => {
      if (other !== current) other.open = false;
    });
  });
});

/* Scroll reveals for the dedicated case-study page. */
const caseReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const caseRevealTargets = document.querySelectorAll('.case-hero, .case-section, .case-end, .case-footer');
if (caseRevealTargets.length && !caseReduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  caseRevealTargets.forEach(el => el.classList.add('reveal-on-scroll'));
  const caseRevealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); caseRevealObserver.unobserve(entry.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  caseRevealTargets.forEach(el => caseRevealObserver.observe(el));
}
function updateCaseClock() {
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
  document.querySelectorAll('.live-clock').forEach(el => { el.textContent = time; });
}
updateCaseClock();
window.setInterval(updateCaseClock, 1000);
