/* Design moderne: switch de thème, apparition fluide, panneau latéral */
(() => {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;
  const prefersDark = matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(mode) {
    root.classList.remove('theme-light', 'theme-dark');
    if (mode === 'dark') root.classList.add('theme-dark');
    if (mode === 'light') root.classList.add('theme-light');
    updateToggleLabel();
  }

  function currentMode() {
    if (root.classList.contains('theme-dark')) return 'dark';
    if (root.classList.contains('theme-light')) return 'light';
    return prefersDark.matches ? 'dark' : 'light';
  }

  function updateToggleLabel() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const mode = currentMode();
    btn.textContent = mode === 'dark' ? '☀️ Clair' : '🌙 Sombre';
    btn.setAttribute('aria-label', mode === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
    btn.setAttribute('aria-pressed', String(mode === 'dark'));
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    applyTheme(saved || (prefersDark.matches ? 'dark' : 'light'));
    prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
    });

    let btn = document.getElementById('theme-toggle');
    if (!btn) {
      // fallback si le bouton n'est pas dans le HTML
      const header = document.querySelector('.site-header') || document.body;
      btn = document.createElement('button');
      btn.id = 'theme-toggle';
      btn.className = 'theme-toggle';
      header.appendChild(btn);
    }
    btn.addEventListener('click', () => {
      const next = currentMode() === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
    updateToggleLabel();
  }

  function reveal() {
    const ls = document.getElementById('loading-screen');
    if (ls) setTimeout(() => ls.remove(), 250);

    document.querySelectorAll('.hidden').forEach((el, i) => {
      setTimeout(() => {
        el.classList.remove('hidden');
        el.classList.add('reveal');
      }, 120 + i * 80);
    });
  }

  function initPanel() {
    const toggle = document.getElementById('toggle-panel');
    const close = document.getElementById('close-panel');
    const panel = document.getElementById('side-panel');
    const backdrop = document.getElementById('backdrop');
    if (!toggle || !panel || !backdrop) return;

    const open = () => {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('open'));
      toggle.setAttribute('aria-expanded', 'true');
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add('show'));
    };
    const closePanel = () => {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('show');
      setTimeout(() => { panel.hidden = true; backdrop.hidden = true; }, 250);
    };

    toggle.addEventListener('click', open);
    close?.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initPanel();
      reveal();
    });
  } else {
    initTheme();
    initPanel();
    reveal();
  }
})();