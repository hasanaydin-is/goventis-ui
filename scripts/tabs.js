const PAGE_ICONS = {
  'deck':      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  'inbox':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></svg>',
  'my-issues': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  'projects':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>',
  'workflows': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/><rect x="16" y="16" width="5" height="5" rx="1"/><path d="M8 5.5h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8"/><path d="M16 18.5H12"/></svg>',
  'skills':    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  'calendar':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  'capabilities': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  'add-ons':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>'
};

export function initTabs() {
  const frame    = document.getElementById('contentFrame');
  const crumb    = document.getElementById('crumbPage');
  const navItems = document.querySelectorAll('.sidebar .nav-item[data-page]');
  const stripEl  = document.getElementById('tabsStrip');
  const addBtn   = document.getElementById('tabAdd');
  const addPop   = document.getElementById('addPop');

  let tabs = [
    { id: 'deck', page: 'deck', label: 'Deck', crumb: 'Home / Deck', icon: PAGE_ICONS['deck'] }
  ];
  let activeId = 'deck';

  function renderTabs() {
    if (!stripEl) return;
    stripEl.innerHTML = '';
    tabs.forEach(t => {
      const el = document.createElement('button');
      el.className = 'wtab' + (t.id === activeId ? ' active' : '');
      el.dataset.id = t.id;
      el.setAttribute('role', 'tab');
      el.innerHTML =
        '<span class="ico">' + (t.icon || '') + '</span>' +
        '<span class="label">' + t.label + '</span>' +
        '<span class="x" title="Close" aria-label="Close tab">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</span>';
      el.addEventListener('click', e => {
        if (e.target.closest('.x')) { closeTab(t.id); return; }
        activate(t.id);
      });
      stripEl.appendChild(el);
    });
  }

  function syncCrumbAndSidebar(t) {
    if (crumb) {
      const [cat, name] = (t.crumb || '').split(' / ');
      crumb.innerHTML =
        '<span class="crumb-muted">' + (cat || '') + '</span>' +
        '<span class="crumb-sep">/</span>' + (name || t.label);
    }
    navItems.forEach(n => n.classList.toggle('active', n.dataset.page === t.page));
  }

  function activate(id) {
    const t = tabs.find(x => x.id === id);
    if (!t) return;
    activeId = id;
    frame.src = 'pages/' + t.page + '.html';
    syncCrumbAndSidebar(t);
    renderTabs();
  }

  function openTab(opts) {
    const existing = tabs.find(t => t.id === opts.id);
    if (existing) { activate(opts.id); return; }
    tabs.push(opts);
    activate(opts.id);
  }

  function closeTab(id) {
    const i = tabs.findIndex(t => t.id === id);
    if (i === -1) return;
    tabs.splice(i, 1);
    if (tabs.length === 0) {
      tabs.push({ id: 'my-issues', page: 'my-issues', label: 'My Issues', crumb: 'Tasks / My Issues', icon: PAGE_ICONS['my-issues'] });
      activate('my-issues');
      return;
    }
    if (activeId === id) {
      const next = tabs[Math.min(i, tabs.length - 1)];
      activate(next.id);
    } else {
      renderTabs();
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      const lbl  = item.dataset.label;
      const name = lbl.split(' / ')[1] || page;
      openTab({ id: page, page, label: name, crumb: lbl, icon: PAGE_ICONS[page] || '' });
    });
  });

  // Favori Markalar — sidebar
  document.querySelectorAll('.sidebar .fav-brand-item[data-brand]').forEach(item => {
    item.addEventListener('click', () => {
      const brand = item.dataset.brand;
      const page  = item.dataset.page;
      const lbl   = item.dataset.label;
      const name  = lbl.split(' / ')[1] || brand;
      openTab({ id: 'brand-' + brand, page, label: name, crumb: lbl, icon: '' });
    });
  });

  if (addBtn) {
    addBtn.addEventListener('click', e => {
      e.stopPropagation();
      const r = addBtn.getBoundingClientRect();
      addPop.style.left = (r.right - 220) + 'px';
      addPop.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('#addPop') && !e.target.closest('#tabAdd')) {
        addPop.classList.remove('open');
      }
    });
  }
  addPop.querySelectorAll('.ap-item').forEach(b => {
    b.addEventListener('click', () => {
      const page = b.dataset.page, lbl = b.dataset.label;
      const name = lbl.split(' / ')[1] || page;
      openTab({ id: page, page, label: name, crumb: lbl, icon: PAGE_ICONS[page] || '' });
      addPop.classList.remove('open');
    });
  });

  renderTabs();
  syncCrumbAndSidebar(tabs[0]);
}
