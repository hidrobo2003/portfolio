/* ===== GLOBAL STATE ===== */
const state = {
  theme: localStorage.getItem('theme') || 'light',
  lang: localStorage.getItem('lang') || 'en',
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
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.langBtn === lang);
  });
  // Trigger re-fetch on project pages
  if (typeof onLangChange === 'function') onLangChange(lang);
}

/* ===== NAVBAR BUILDER ===== */
function buildNav(activePage) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  // Paths relative to each page location:
  // depth 0 → root/                          (index.html)
  // depth 1 → root/pages/                    (contact.html)
  // depth 2 → root/pages/portfolio/riwi|professional|personal/  (portfolio.html)
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

  function path(key) {
    return pathMap[depth][key];
  }

  const isProjectActive = ['projects_riwi','projects_professional','projects_personal'].includes(activePage);

  nav.innerHTML = `
    <div class="nav-left">
      <a href="${path('home')}" class="nav-btn ${activePage === 'home' ? 'active' : ''}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
        Home
      </a>
      <a href="${path('contact')}" class="nav-btn ${activePage === 'contact' ? 'active' : ''}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
        Contact me
      </a>
      <div class="dropdown" id="projects-dropdown">
        <button class="nav-btn ${isProjectActive ? 'active' : ''}" onclick="toggleDropdown('projects-dropdown')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Projects
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="dropdown-menu">
          <a href="${path('projects_riwi')}" class="dropdown-item ${activePage === 'projects_riwi' ? 'active' : ''}">🎓 Riwi</a>
          <a href="${path('projects_professional')}" class="dropdown-item ${activePage === 'projects_professional' ? 'active' : ''}">💼 Professional</a>
          <a href="${path('projects_personal')}" class="dropdown-item ${activePage === 'projects_personal' ? 'active' : ''}">🌱 Personal</a>
        </div>
      </div>
    </div>
    <div class="nav-right">
      <div class="options-wrapper" id="options-wrapper">
        <button class="nav-btn" onclick="toggleOptions()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
          Options
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="options-menu" id="options-menu">
          <div class="options-section">Language</div>
          <button class="option-btn ${state.lang === 'en' ? 'selected' : ''}" data-lang-btn="en" onclick="applyLang('en')">
            <span class="check"></span> English
          </button>
          <button class="option-btn ${state.lang === 'es' ? 'selected' : ''}" data-lang-btn="es" onclick="applyLang('es')">
            <span class="check"></span> Español
          </button>
          <div class="options-divider"></div>
          <div class="options-section">Theme</div>
          <button class="option-btn ${state.theme === 'light' ? 'selected' : ''}" data-theme-btn="light" onclick="applyTheme('light')">
            <span class="check"></span> ☀️ Light
          </button>
          <button class="option-btn ${state.theme === 'dark' ? 'selected' : ''}" data-theme-btn="dark" onclick="applyTheme('dark')">
            <span class="check"></span> 🌙 Dark
          </button>
        </div>
      </div>
    </div>
  `;
}

function toggleDropdown(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
  // Close options if open
  document.getElementById('options-wrapper')?.classList.remove('open');
}
function toggleOptions() {
  const el = document.getElementById('options-wrapper');
  el.classList.toggle('open');
  // Close projects dropdown if open
  document.getElementById('projects-dropdown')?.classList.remove('open');
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('#projects-dropdown')) {
    document.getElementById('projects-dropdown')?.classList.remove('open');
  }
  if (!e.target.closest('#options-wrapper')) {
    document.getElementById('options-wrapper')?.classList.remove('open');
  }
});

/* ===== API HELPERS ===== */

// The API uses 'sp' for Spanish, 'en' for English
function apiLang(lang) {
  return lang === 'es' ? 'sp' : 'en';
}

// Fetch projects filtered by type: 'riwi' | 'professional' | 'personal'
async function fetchProjectsByType(lang, type) {
  const url = `${API_BASE}/api/projects/${apiLang(lang)}/type?type=${encodeURIComponent(type)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data || json.projects || []);
}

// Fetch projects filtered by module number (1-based)
async function fetchProjectsByModule(lang, module) {
  const url = `${API_BASE}/api/projects/${apiLang(lang)}/module?module=${module}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data || json.projects || []);
}

// Fetch ALL riwi projects collecting modules 1-10 until one comes back empty
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

// Legacy wrapper kept for compatibility
async function fetchProjects(lang, type) {
  return fetchProjectsByType(lang, type);
}

/* ===== RENDER HELPERS ===== */
function renderLoading(container) {
  container.innerHTML = `<div class="state-box"><div class="loader"></div><br>Loading projects...</div>`;
}
function renderError(container, msg) {
  container.innerHTML = `<div class="state-box">⚠️ ${msg || 'Could not load projects.'}</div>`;
}
function renderEmpty(container) {
  container.innerHTML = `<div class="state-box">No projects found.</div>`;
}

function renderTable(container, projects) {
  if (!projects || projects.length === 0) { renderEmpty(container); return; }

  const rows = projects.map(p => {
    const repo = p.repository || p.repo || '';
    const deploy = p.deploy || p.url || '';
    const desc = p.description || p.descripcion || '';
    const problem = p.problem || p.problema || '';
    const title = p.title || p.titulo || 'Activity';

    return `<tr>
      <td class="link-cell">${problem ? `<a href="${escHtml(problem)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        ${escHtml(title)}
      </a>` : '<span style="color:var(--text3)">—</span>'}</td>
      <td class="link-cell">${repo ? `<a href="${escHtml(repo)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        Repo
      </a>` : '<span style="color:var(--text3)">—</span>'}</td>
      <td class="link-cell">${deploy ? `<a href="${escHtml(deploy)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Deploy
      </a>` : '<span style="color:var(--text3)">—</span>'}</td>
      <td>${escHtml(desc)}</td>
    </tr>`;
  }).join('');

  container.innerHTML = `
    <div class="projects-table-wrap">
      <table class="projects-table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Repository</th>
            <th>Deploy</th>
            <th>Description</th>
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
