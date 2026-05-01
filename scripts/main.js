import { loadPartials } from './partials.js';
import { initTabs }     from './tabs.js';
import { initTimer }    from './timer.js';
import { initCalendar } from './calendar.js';
import { initModal }    from './modal.js';
import { initChat }     from './chat.js';
import { initAiDrawer } from './ai-drawer.js';

const SVG = {
  sprint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
  issue:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 4 0h2"/></svg>`,
  people: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  user:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  cal:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
};

function statusLabel(s) {
  return s === 'todo' ? 'To Do' : s === 'prog' ? 'In Progress' : 'Done';
}

function populateProjModal(p) {
  document.getElementById('ppmBanner').style.background = p.bannerBg;
  const logo = document.getElementById('ppmLogo');
  logo.style.background = p.logoBg;
  logo.textContent = p.initials;

  document.getElementById('ppmName').textContent = p.name;
  document.getElementById('ppmType').textContent = p.type;

  document.getElementById('ppmChips').innerHTML = `
    <span class="pm-chip">${SVG.sprint} Sprint ${p.sprint}</span>
    <span class="pm-chip">${SVG.issue} ${p.issues} issue</span>
    <span class="pm-chip">${SVG.people} ${p.members.length} üye</span>
  `;

  document.getElementById('ppmMeta').innerHTML = `
    <div class="pm-meta-row">${SVG.user} Oluşturan: <strong>${p.createdBy}</strong></div>
    <div class="pm-meta-row">${SVG.cal} Tarih: <strong>${p.createdAt}</strong></div>
  `;

  document.getElementById('ppm-tab-overview').innerHTML = `
    <div class="pm-section">
      <div class="pm-section-title">Hakkında</div>
      <p style="font-size:13.5px;color:var(--fg-2);line-height:1.7;margin:0;">${p.desc}</p>
    </div>
    <div class="pm-section">
      <div class="pm-section-title">Sprint Durumu</div>
      <div class="pm-detail-grid">
        <div class="pm-detail-item"><div class="k">Aktif Sprint</div><div class="v">Sprint ${p.sprint}</div></div>
        <div class="pm-detail-item"><div class="k">Tamamlanan</div><div class="v">${p.issuesDone} / ${p.issues} issue</div></div>
      </div>
      <div class="pm-sprint-track">
        <div class="pm-sprint-label"><span>Sprint ilerlemesi</span><strong>${p.sprintPct}%</strong></div>
        <div class="pm-sprint-bar"><span style="width:${p.sprintPct}%"></span></div>
        <div class="pm-sprint-foot"><span>${p.issuesDone} tamamlandı</span><span>${p.issues - p.issuesDone} kaldı</span></div>
      </div>
    </div>
    <div class="pm-section">
      <div class="pm-section-title">Proje Bilgileri</div>
      <div class="pm-detail-grid">
        <div class="pm-detail-item"><div class="k">Oluşturan</div><div class="v soft">${p.createdBy}</div></div>
        <div class="pm-detail-item"><div class="k">Oluşturma Tarihi</div><div class="v soft">${p.createdAt}</div></div>
        <div class="pm-detail-item"><div class="k">Tür</div><div class="v soft">${p.type}</div></div>
        <div class="pm-detail-item"><div class="k">Ekip Büyüklüğü</div><div class="v soft">${p.members.length} kişi</div></div>
      </div>
    </div>
  `;

  document.getElementById('ppm-tab-issues').innerHTML = `
    <div class="pm-section">
      <div class="pm-section-title">Issues (${p.issues} toplam)</div>
      ${p.sampleIssues.map(i => `
        <div class="pm-issue-row">
          <span class="pm-issue-id">${i.id}</span>
          <span class="pm-issue-title">${i.title}</span>
          <span class="pm-issue-status ${i.status}">${statusLabel(i.status)}</span>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('ppm-tab-members').innerHTML = `
    <div class="pm-section">
      <div class="pm-section-title">Ekip (${p.members.length} üye)</div>
      ${p.members.map(m => `
        <div class="pm-member-row">
          <div class="pm-member-av" style="background:${m.color};">${m.initials}</div>
          <span class="pm-member-name">${m.name}</span>
          <span class="pm-member-role">${m.role}</span>
        </div>
      `).join('')}
    </div>
  `;

  /* Reset to first tab */
  document.querySelectorAll('#parentProjModal .pm-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === 'overview');
  });
  document.querySelectorAll('#parentProjModal .pm-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'ppm-tab-overview');
  });
}

(async function bootstrap() {
  await loadPartials([
    ['[data-partial="tabbar"]',           'partials/tabbar.html'],
    ['[data-partial="sidebar"]',          'partials/sidebar.html'],
    ['[data-partial="topbar"]',           'partials/topbar.html'],
    ['[data-partial="timer-popover"]',    'partials/timer-popover.html'],
    ['[data-partial="calendar-popover"]', 'partials/calendar-popover.html'],
    ['[data-partial="modal"]',            'partials/modal.html'],
    ['[data-partial="ai-prompt"]',        'partials/ai-prompt.html'],
    ['[data-partial="ai-drawer"]',        'partials/ai-drawer.html'],
    ['[data-partial="proj-modal"]',       'partials/proj-modal.html'],
  ]);

  initTabs();
  initTimer();
  initCalendar();

  // Org switcher dropdown
  const orgBtn      = document.getElementById('orgSwitchBtn');
  const orgDropdown = document.getElementById('orgDropdown');
  const orgLogo     = document.getElementById('orgLogo');
  const orgName     = document.getElementById('orgName');

  if (orgDropdown) document.body.appendChild(orgDropdown);

  function positionOrgDropdown() {
    const rect = orgBtn.getBoundingClientRect();
    orgDropdown.style.top  = (rect.bottom + 6) + 'px';
    orgDropdown.style.left = rect.left + 'px';
  }

  function closeOrgDropdown() {
    orgDropdown.classList.remove('open');
    orgBtn.classList.remove('open');
    orgBtn.setAttribute('aria-expanded', 'false');
  }

  if (orgBtn && orgDropdown) {
    orgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !orgDropdown.classList.contains('open');
      if (willOpen) positionOrgDropdown();
      orgDropdown.classList.toggle('open', willOpen);
      orgBtn.classList.toggle('open', willOpen);
      orgBtn.setAttribute('aria-expanded', String(willOpen));
    });

    orgDropdown.querySelectorAll('.org-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        orgDropdown.querySelectorAll('.org-dropdown-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        orgLogo.textContent = item.dataset.initial;
        orgLogo.style.background = item.dataset.logoBg;
        orgName.textContent = item.querySelector('.org-item-name').textContent;
        closeOrgDropdown();
      });
    });

    document.addEventListener('click', (e) => {
      if (!orgBtn.contains(e.target) && !orgDropdown.contains(e.target)) {
        closeOrgDropdown();
      }
    });

    window.addEventListener('resize', () => {
      if (orgDropdown.classList.contains('open')) positionOrgDropdown();
    });
  }

  // Favori Markalar toggle
  const favToggle  = document.getElementById('favBrandsToggle');
  const favList    = document.getElementById('favBrandsList');
  const favSection = document.getElementById('favBrandsSection');
  if (favToggle && favList && favSection) {
    favToggle.addEventListener('click', () => {
      const open = favList.classList.toggle('open');
      favSection.classList.toggle('open', open);
    });
  }
  initModal();
  initChat();
  initAiDrawer();

  const globalScrim = document.getElementById('globalScrim');
  const contentFrame = document.getElementById('contentFrame');

  function showGlobalScrim(onClick) {
    globalScrim.style.opacity = '1';
    globalScrim.style.pointerEvents = 'auto';
    globalScrim.onclick = onClick;
  }

  function hideGlobalScrim() {
    globalScrim.style.opacity = '0';
    globalScrim.style.pointerEvents = 'none';
    globalScrim.onclick = null;
  }

  function openIframeModalOverlay() {
    document.body.classList.add('modal-open');
    contentFrame.classList.add('modal-host');
    showGlobalScrim(() => {
      contentFrame.contentWindow?.postMessage({ type: 'closeModal' }, '*');
    });
  }

  function closeIframeModalOverlay() {
    contentFrame.classList.remove('modal-host');
    document.body.classList.remove('modal-open');
    hideGlobalScrim();
  }

  function openProjModal(p) {
    populateProjModal(p);
    document.body.classList.add('modal-open');
    document.getElementById('parentProjModal').classList.add('open');
    showGlobalScrim(closeProjModal);
  }

  function closeProjModal() {
    document.getElementById('parentProjModal').classList.remove('open');
    document.body.classList.remove('modal-open');
    hideGlobalScrim();
  }

  /* Tab switching inside the parent modal */
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('#parentProjModal .pm-tab');
    if (!tab) return;
    const name = tab.dataset.tab;
    document.querySelectorAll('#parentProjModal .pm-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === name);
    });
    document.querySelectorAll('#parentProjModal .pm-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'ppm-tab-' + name);
    });
  });

  /* Close button */
  document.addEventListener('click', (e) => {
    if (e.target.closest('#ppmClose')) closeProjModal();
  });

  /* ESC key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('parentProjModal')?.classList.contains('open')) {
      closeProjModal();
    }
  });

  /* postMessage from iframe */
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;

    if (e.data.type === 'projModalOpen' && e.data.project) {
      openProjModal(e.data.project);
    }

    if (e.data.type === 'projModalClose') {
      closeProjModal();
    }

    if (e.data.type === 'modalState') {
      if (e.data.open) openIframeModalOverlay();
      else closeIframeModalOverlay();
    }
  });
})();
