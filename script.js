const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== NAVIGATION TOGGLE =====
const bar = document.querySelector('.bar');
const barToggle = document.querySelector('.bar-toggle');
const barMenu = document.querySelector('.bar-menu');

function closeMenu() {
    barToggle.setAttribute('aria-expanded', 'false');
    barMenu.classList.remove('is-open');
}

barToggle.addEventListener('click', () => {
    const isOpen = barMenu.classList.toggle('is-open');
    barToggle.setAttribute('aria-expanded', String(isOpen));
});

barMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
});

document.addEventListener('click', (e) => {
    if (!bar.contains(e.target)) closeMenu();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

// ===== THE MONDAY CALENDAR =====
// The blocks of the CEO's Monday in assets/project1.jpg, in minutes since midnight.
const DAY_START = 360;
const DAY_END = 1020;

const mondayBlocks = [
    { start: 360, end: 390, title: 'Morning Workout', project: 'p-calendar' },
    { start: 390, end: 420, title: 'Breakfast & Industry News', project: 'p-calendar' },
    { start: 420, end: 450, title: 'Review Emails & Daily Priorities', project: 'p-email' },
    { start: 450, end: 480, title: 'Executive Leadership Stand-up', project: 'p-meetings' },
    { start: 480, end: 540, title: 'Product Strategy Meeting', project: 'p-launch' },
    { start: 540, end: 555, title: 'Buffer Break', buffer: true },
    { start: 555, end: 600, title: 'Investor Update Call' },
    { start: 600, end: 660, title: 'Budget Review Meeting', project: 'p-data' },
    { start: 660, end: 675, title: 'Buffer Time', buffer: true },
    { start: 675, end: 720, title: 'Recruitment Interview' },
    { start: 720, end: 780, title: 'Lunch Meeting' },
    { start: 780, end: 840, title: 'Client Presentation', project: 'p-clients' },
    { start: 840, end: 855, title: 'Break', buffer: true },
    { start: 855, end: 900, title: 'Marketing Strategy Meeting' },
    { start: 900, end: 960, title: 'Board Meeting Preparation', project: 'p-research' },
    { start: 960, end: 1020, title: 'Review Reports & Approvals', project: 'p-files' }
];

function formatTime(minutes, withPeriod = true) {
    const hours24 = Math.floor(minutes / 60);
    const hours = hours24 > 12 ? hours24 - 12 : hours24;
    const mins = String(minutes % 60).padStart(2, '0');
    if (!withPeriod) return `${hours}:${mins}`;
    return `${hours}:${mins} ${hours24 >= 12 ? 'pm' : 'am'}`;
}

function dayPercent(minutes) {
    return ((minutes - DAY_START) / (DAY_END - DAY_START)) * 100;
}

function renderDay(root) {
    const head = document.createElement('div');
    head.className = 'day-head';
    head.innerHTML = '<span class="day-title">Monday 20</span><span class="day-now"></span>';

    const grid = document.createElement('div');
    grid.className = 'day-grid';

    for (let minutes = DAY_START; minutes < DAY_END; minutes += 60) {
        const hour = document.createElement('div');
        hour.className = 'day-hour';
        hour.style.top = `${dayPercent(minutes)}%`;
        hour.innerHTML = `<span>${formatTime(minutes).replace(':00 ', '')}</span>`;
        grid.appendChild(hour);
    }

    mondayBlocks.forEach((block) => {
        const el = document.createElement(block.project ? 'a' : 'div');
        el.className = block.buffer ? 'day-block is-buffer' : 'day-block';
        el.style.top = `calc(${dayPercent(block.start)}% + 1px)`;
        el.style.height = `calc(${dayPercent(block.end) - dayPercent(block.start)}% - 2px)`;
        el.textContent = block.title;
        if (block.project) el.href = `#${block.project}`;
        grid.appendChild(el);
    });

    const line = document.createElement('div');
    line.className = 'day-line';
    grid.appendChild(line);

    root.setAttribute('data-ui', '');
    root.dataset.tone = 'white';
    root.append(head, grid);
}

const days = Array.from(document.querySelectorAll('[data-day]'));
days.forEach(renderDay);

function setClock(minutes) {
    const active = mondayBlocks.findIndex(b => minutes >= b.start && minutes < b.end);
    const current = mondayBlocks[active === -1 ? mondayBlocks.length - 1 : active];

    days.forEach((day) => {
        day.querySelector('.day-line').style.top = `${dayPercent(minutes)}%`;
        day.querySelector('.day-now').textContent = formatTime(Math.round(minutes));
        day.querySelectorAll('.day-block').forEach((el, i) => {
            el.classList.toggle('is-now', mondayBlocks[i] === current);
        });
    });
}

// ===== SCROLL: CLOCK, NAME AND PORTRAIT =====
const projects = Array.from(document.querySelectorAll('.project[data-time]'));
const servicesEnd = document.querySelector('#services');
const heroName = document.querySelector('.name');
const portrait = document.querySelector('[data-layer="portrait"]');

function clockFromScroll() {
    const anchor = window.innerHeight * 0.5;
    const stops = projects.map(p => ({ y: p.getBoundingClientRect().top, time: Number(p.dataset.time) }));
    stops.push({ y: servicesEnd.getBoundingClientRect().top, time: 1000 });
    stops.push({ y: servicesEnd.getBoundingClientRect().bottom, time: DAY_END - 1 });

    if (anchor <= stops[0].y) return DAY_START;
    for (let i = 0; i < stops.length - 1; i += 1) {
        const a = stops[i];
        const b = stops[i + 1];
        if (anchor < b.y) return a.time + ((anchor - a.y) / (b.y - a.y)) * (b.time - a.time);
    }
    return DAY_END - 1;
}

let ticking = false;

function onScroll() {
    ticking = false;
    setClock(clockFromScroll());
    if (reduceMotion) return;
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    heroName.style.setProperty('--shrink', (1 - progress * 0.06).toFixed(4));
    portrait.style.setProperty('--drift', (1 + progress * 0.04).toFixed(4));
}

window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
}, { passive: true });

onScroll();

// ===== STAGE: THE FIXED HALF FOLLOWS THE SECTIONS =====
const layers = document.querySelectorAll('.stage-layer');
const split = document.querySelector('.split');
const navLinks = barMenu.querySelectorAll('a');

const stageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const name = entry.target.dataset.stage;
        const current = `#${entry.target.dataset.nav || entry.target.id}`;
        navLinks.forEach((link) => {
            if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
        bar.classList.toggle('is-wide', name === 'none');
        if (name === 'none') return;
        split.dataset.tone = entry.target.dataset.tone;
        layers.forEach(layer => layer.classList.toggle('is-on', layer.dataset.layer === name));
    });
}, { rootMargin: '-50% 0px -50% 0px' });

document.querySelectorAll('[data-stage]').forEach(el => stageObserver.observe(el));

// ===== ENTRANCES =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
    });
}, { rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('[data-reveal], .block > h2, .skills > h2, .project').forEach(el => revealObserver.observe(el));

// ===== YOUR MONDAY =====
const PLAN_START = 540;
const PLAN_BLOCK = 45;
const PLAN_BUFFER = 15;

const contactForm = document.getElementById('contact-form');
const picks = Array.from(contactForm.querySelectorAll('input[name="services"]'));
const planList = document.querySelector('.plan-list');
const planEmpty = document.querySelector('.plan-empty');
const formNote = document.getElementById('form-note');
let chosen = [];

function buildPlan(services) {
    const rows = [];
    let minutes = PLAN_START;
    services.forEach((title, i) => {
        rows.push({ time: minutes, title });
        minutes += PLAN_BLOCK;
        if ((i + 1) % 2 === 0) {
            rows.push({ time: minutes, title: 'Buffer', buffer: true });
            minutes += PLAN_BUFFER;
        }
    });
    return rows;
}

function renderPlan() {
    const existing = new Map(Array.from(planList.children).map(li => [li.dataset.key, li]));
    planList.textContent = '';

    buildPlan(chosen).forEach((row, i) => {
        const key = row.buffer ? `buffer-${i}` : row.title;
        const li = existing.get(key) || document.createElement('li');
        li.dataset.key = key;
        li.className = row.buffer ? 'is-buffer' : '';
        li.innerHTML = '';
        const time = document.createElement('time');
        time.textContent = formatTime(row.time, false);
        li.append(time, row.title);
        planList.appendChild(li);
    });

    planEmpty.hidden = chosen.length > 0;
}

picks.forEach((pick) => {
    pick.addEventListener('change', () => {
        chosen = pick.checked ? [...chosen, pick.value] : chosen.filter(v => v !== pick.value);
        renderPlan();
    });
});

// ===== FORM HANDLING =====
function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name || !data.name.trim()) return false;
    if (!data.email || !emailRegex.test(data.email)) return false;
    if (!data.message || !data.message.trim()) return false;

    return true;
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(contactForm));

    if (!validateForm(data)) {
        formNote.textContent = 'Please add your name, a valid email and a short message.';
        return;
    }

    const recipient = 'chisomjil40@gmail.com';
    const plan = buildPlan(chosen).map(row => `${formatTime(row.time, false)}  ${row.title}`);
    const subject = `Portfolio Inquiry: ${chosen.length ? chosen.join(', ') : data.name.trim()}`;
    const body = [
        `Name: ${data.name.trim()}`,
        `Email: ${data.email.trim()}`,
        '',
        ...(plan.length ? ['My Monday:', ...plan, ''] : []),
        `Message: ${data.message.trim()}`
    ].join('\n');

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formNote.textContent = 'Your email app should now be open. If not, write to chisomjil40@gmail.com.';
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let gallery = [];
let galleryIndex = 0;

function showImage(index) {
    galleryIndex = (index + gallery.length) % gallery.length;
    const link = gallery[galleryIndex];
    const image = link.querySelector('img');
    lightboxImage.src = link.getAttribute('href');
    lightboxImage.alt = image.alt;
}

document.querySelectorAll('[data-gallery]').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        gallery = Array.from(document.querySelectorAll(`[data-gallery="${link.dataset.gallery}"]`));
        lightboxPrev.hidden = gallery.length < 2;
        lightboxNext.hidden = gallery.length < 2;
        showImage(gallery.indexOf(link));
        lightbox.showModal();
    });
});

lightboxPrev.addEventListener('click', () => showImage(galleryIndex - 1));
lightboxNext.addEventListener('click', () => showImage(galleryIndex + 1));
document.getElementById('lightbox-close').addEventListener('click', () => lightbox.close());

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
});

lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showImage(galleryIndex - 1);
    if (e.key === 'ArrowRight') showImage(galleryIndex + 1);
});
