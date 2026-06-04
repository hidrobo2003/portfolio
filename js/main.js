/* ===== TRADUCCIONES ===== */
const i18n = {
  en: {
    // Navbar
    nav_home:         'Home',
    nav_contact:      'Contact me',
    nav_projects:     'Projects',
    nav_riwi:         '🎓 Riwi',
    nav_professional: '💼 Professional',
    nav_personal:     '🌱 Personal',
    nav_options:      'Options',
    nav_language:     'Language',
    nav_theme:        'Theme',
    nav_light:        '☀️ Light',
    nav_dark:         '🌙 Dark',

    // Páginas
    page_home:           'Home',
    page_about:          'About',
    page_about_me:       'Me',
    page_bio:            'Software Developer with backend expertise in C#, .NET, and Laravel, alongside experience managing MySQL and PostgreSQL databases. Proficient in Git, Docker, and both developing and consuming REST APIs. Quick learner, strong problem solver, and a collaborative team player.',
    btn_contact:         'Contact',

    page_contact_title:  'Contact <span style="color:var(--accent)">Me</span>',

    page_projects:       'Projects',
    page_riwi:           'Riwi',
    page_professional:   'Professional',
    page_personal:       'Personal',
    page_module:         'Module',

    page_notice:         'Notice',
    msg_title:           'Link not available',
    msg_body:            'We apologize for the inconvenience, but the text you are trying to access does not have a link to view the issue in detail.',
    msg_back:            'Back to home',

    // Tabla
    col_activity:    'Activity',
    col_repository:  'Repository',
    col_deploy:      'Deploy',
    col_description: 'Description',

    // Estados
    loading: 'Loading projects...',
    error:   'Could not load projects from API.',
    empty:   'No projects found.',

    // Títulos de documento
    title_home:         'Portfolio — Home',
    title_contact:      'Portfolio — Contact',
    title_riwi:         'Portfolio — Riwi Projects',
    title_professional: 'Portfolio — Professional Projects',
    title_personal:     'Portfolio — Personal Projects',
    title_message:      'Portfolio — Link not available',
  },
  es: {
    nav_home:         'Inicio',
    nav_contact:      'Contáctame',
    nav_projects:     'Proyectos',
    nav_riwi:         '🎓 Riwi',
    nav_professional: '💼 Profesional',
    nav_personal:     '🌱 Personal',
    nav_options:      'Opciones',
    nav_language:     'Idioma',
    nav_theme:        'Tema',
    nav_light:        '☀️ Claro',
    nav_dark:         '🌙 Oscuro',

    page_home:           'Inicio',
    page_about:          'Sobre',
    page_about_me:       'Mí',
    page_bio:            'Desarrollador de software con experiencia en backend en C#, .NET y Laravel, junto con manejo de bases de datos MySQL y PostgreSQL. Competente en Git, Docker, y en el desarrollo y consumo de APIs REST. Aprendiz rápido, gran solucionador de problemas y excelente jugador de equipo.',
    btn_contact:         'Contacto',

    page_contact_title:  'Contáctame',

    page_projects:       'Proyectos',
    page_riwi:           'Riwi',
    page_professional:   'Profesional',
    page_personal:       'Personal',
    page_module:         'Módulo',

    page_notice:         'Aviso',
    msg_title:           'Enlace no disponible',
    msg_body:            'Siento las molestias, pero el texto al que intentas acceder no cuenta con un link para observar a detalle la problemática.',
    msg_back:            'Volver al inicio',

    col_activity:    'Actividad',
    col_repository:  'Repositorio',
    col_deploy:      'Deploy',
    col_description: 'Descripción',

    loading: 'Cargando proyectos...',
    error:   'No se pudieron cargar los proyectos desde la API.',
    empty:   'No se encontraron proyectos.',

    title_home:         'Portafolio — Inicio',
    title_contact:      'Portafolio — Contacto',
    title_riwi:         'Portafolio — Proyectos Riwi',
    title_professional: 'Portafolio — Proyectos Profesionales',
    title_personal:     'Portafolio — Proyectos Personales',
    title_message:      'Portafolio — Enlace no disponible',
  }
};

function t(key) {
  return (i18n[state.lang] || i18n.en)[key] || key;
}

/* ===== GLOBAL STATE ===== */
const state = {
  theme: localStorage.getItem('theme') || 'light',
  lang:  localStorage.getItem('lang')  || 'en',
};

const API_BASE = 'https://service-portfolio-mpu8.onrender.com';

/* ===== THEME ===== */
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  localStorage.setItem('theme', theme);
  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.themeBtn === theme);
  });
}

/* ===== LANGUAGE ===== */
function applyLang(lang) {
  state.lang = lang;
  localStorage.setItem('lang', lang);

  // Actualizar atributo html lang
  document.documentElement.lang = lang;

  // Actualizar botones de idioma en la navbar
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.langBtn === lang);
  });

  // Traducir todos los elementos con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });

  // Traducir data-i18n-html (permite HTML interno)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (key) el.innerHTML = t(key);
  });

  // Actualizar título del documento
  const titleKey = document.body.dataset.titleKey;
  if (titleKey) document.title = t(titleKey);

  // Reconstruir navbar con el nuevo idioma
  const activePage = document.body.dataset.activePage;
  if (activePage) buildNav(activePage);

  // Disparar recarga de proyectos si la página lo soporta
  if (typeof onLangChange === 'function') onLangChange(lang);
}

/* ===== NAVBAR BUILDER ===== */
function buildNav(activePage) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const depth = activePage === 'home' ? 0 : activePage === 'contact' ? 1 : 2;

  const pathMap = {
    0: {
      home:                 'index.html',
      contact:              'pages/contact.html',
      projects_riwi:        'pages/portfolio/riwi/portfolio.html',
      projects_professional:'pages/portfolio/professional/portfolio.html',
      projects_personal:    'pages/portfolio/personal/portfolio.html',
    },
    1: {
      home:                 '../index.html',
      contact:              'contact.html',
      projects_riwi:        'portfolio/riwi/portfolio.html',
      projects_professional:'portfolio/professional/portfolio.html',
      projects_personal:    'portfolio/personal/portfolio.html',
    },
    2: {
      home:                 '../../../index.html',
      contact:              '../../contact.html',
      projects_riwi:        '../riwi/portfolio.html',
      projects_professional:'../professional/portfolio.html',
      projects_personal:    '../personal/portfolio.html',
    },
  };

  function path(key) { return pathMap[depth][key]; }

  const isProjectActive = ['projects_riwi','projects_professional','projects_personal'].includes(activePage);

  // Preservar estado open del mobile nav
  const wasOpen = nav.classList.contains('nav-open');

  nav.innerHTML = `
    <button class="nav-hamburger${wasOpen ? ' open' : ''}" id="nav-hamburger" aria-label="Menú" onclick="toggleMobileNav()">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-left">
      <a href="${path('home')}" class="nav-btn ${activePage === 'home' ? 'active' : ''}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
        ${t('nav_home')}
      </a>
      <a href="${path('contact')}" class="nav-btn ${activePage === 'contact' ? 'active' : ''}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
        ${t('nav_contact')}
      </a>
      <div class="dropdown" id="projects-dropdown">
        <button class="nav-btn ${isProjectActive ? 'active' : ''}" onclick="toggleDropdown('projects-dropdown')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          ${t('nav_projects')}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="dropdown-menu">
          <a href="${path('projects_riwi')}" class="dropdown-item ${activePage === 'projects_riwi' ? 'active' : ''}">${t('nav_riwi')}</a>
          <a href="${path('projects_professional')}" class="dropdown-item ${activePage === 'projects_professional' ? 'active' : ''}">${t('nav_professional')}</a>
          <a href="${path('projects_personal')}" class="dropdown-item ${activePage === 'projects_personal' ? 'active' : ''}">${t('nav_personal')}</a>
        </div>
      </div>
    </div>
    <div class="nav-right">
      <div class="options-wrapper" id="options-wrapper">
        <button class="nav-btn" onclick="toggleOptions()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
          ${t('nav_options')}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="options-menu" id="options-menu">
          <div class="options-section">${t('nav_language')}</div>
          <button class="option-btn ${state.lang === 'en' ? 'selected' : ''}" data-lang-btn="en" onclick="applyLang('en')">
            <span class="check"></span> English
          </button>
          <button class="option-btn ${state.lang === 'es' ? 'selected' : ''}" data-lang-btn="es" onclick="applyLang('es')">
            <span class="check"></span> Español
          </button>
          <div class="options-divider"></div>
          <div class="options-section">${t('nav_theme')}</div>
          <button class="option-btn ${state.theme === 'light' ? 'selected' : ''}" data-theme-btn="light" onclick="applyTheme('light')">
            <span class="check"></span> ${t('nav_light')}
          </button>
          <button class="option-btn ${state.theme === 'dark' ? 'selected' : ''}" data-theme-btn="dark" onclick="applyTheme('dark')">
            <span class="check"></span> ${t('nav_dark')}
          </button>
        </div>
      </div>
    </div>
  `;

  if (wasOpen) nav.classList.add('nav-open');
}

function toggleMobileNav() {
  const nav = document.querySelector('nav');
  const btn = document.getElementById('nav-hamburger');
  nav.classList.toggle('nav-open');
  btn.classList.toggle('open');
}

function toggleDropdown(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
  document.getElementById('options-wrapper')?.classList.remove('open');
}
function toggleOptions() {
  const el = document.getElementById('options-wrapper');
  el.classList.toggle('open');
  document.getElementById('projects-dropdown')?.classList.remove('open');
}

// Cerrar dropdowns al click externo
document.addEventListener('click', (e) => {
  if (!e.target.closest('#projects-dropdown')) {
    document.getElementById('projects-dropdown')?.classList.remove('open');
  }
  if (!e.target.closest('#options-wrapper')) {
    document.getElementById('options-wrapper')?.classList.remove('open');
  }
});

/* ===== API HELPERS ===== */
function apiLang(lang) { return lang === 'es' ? 'sp' : 'en'; }

async function fetchProjectsByType(lang, type) {
  const url = `${API_BASE}/api/projects/${apiLang(lang)}/type?type=${encodeURIComponent(type)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data || json.projects || []);
}

async function fetchProjectsByModule(lang, module) {
  const url = `${API_BASE}/api/projects/${apiLang(lang)}/module?module=${module}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data || json.projects || []);
}

async function fetchAllRiwiProjects(lang) {
  const results = [];
  for (let m = 1; m <= 10; m++) {
    const projects = await fetchProjectsByModule(lang, m);
    if (!projects || projects.length === 0) break;
    projects.forEach(p => { p._module = m; });
    results.push(...projects);
  }
  return results;
}

async function fetchProjects(lang, type) {
  return fetchProjectsByType(lang, type);
}

/* ===== RENDER HELPERS ===== */
function renderLoading(container) {
  container.innerHTML = `<div class="state-box"><div class="loader"></div><br>${t('loading')}</div>`;
}
function renderError(container, msg) {
  container.innerHTML = `<div class="state-box">⚠️ ${msg || t('error')}</div>`;
}
function renderEmpty(container) {
  container.innerHTML = `<div class="state-box">${t('empty')}</div>`;
}

function renderTable(container, projects) {
  if (!projects || projects.length === 0) { renderEmpty(container); return; }

  const rows = projects.map(p => {
    const repo    = p.repository || p.repo || '';
    const deploy  = p.deploy || p.url || '';
    const desc    = p.description || p.descripcion || '';
    const problem = p.problem || p.problema || '';
    const title   = p.title || p.titulo || t('col_activity');

    return `<tr>
      <td class="link-cell" data-label="${t('col_activity')}">${problem
        ? `<a href="${escHtml(problem)}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            ${escHtml(title)}
          </a>`
        : '<span style="color:var(--text3)">—</span>'}</td>
      <td class="link-cell" data-label="${t('col_repository')}">${repo
        ? `<a href="${escHtml(repo)}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            Repo
          </a>`
        : '<span style="color:var(--text3)">—</span>'}</td>
      <td class="link-cell" data-label="${t('col_deploy')}">${deploy
        ? `<a href="${escHtml(deploy)}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Deploy
          </a>`
        : '<span style="color:var(--text3)">—</span>'}</td>
      <td data-label="${t('col_description')}">${escHtml(desc)}</td>
    </tr>`;
  }).join('');

  container.innerHTML = `
    <div class="projects-table-wrap">
      <table class="projects-table">
        <thead>
          <tr>
            <th>${t('col_activity')}</th>
            <th>${t('col_repository')}</th>
            <th>${t('col_deploy')}</th>
            <th>${t('col_description')}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  applyLang(state.lang);
});
