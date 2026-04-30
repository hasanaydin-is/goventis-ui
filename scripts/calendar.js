export function initCalendar() {
  const calBtn   = document.getElementById('calBtn');
  const calPop   = document.getElementById('calPop');
  const calGrid  = document.getElementById('calGrid');
  const calMonth = document.getElementById('calMonth');
  const calPrev  = document.getElementById('calPrev');
  const calNext  = document.getElementById('calNext');
  const calToday = document.getElementById('calToday');

  // Today fixed at Apr 29 2026 to match brief
  const TODAY = { y: 2026, m: 3, d: 29 }; // m is 0-indexed
  const EVENT_DAYS = new Set([29, 30, 5, 8, 12, 22]);
  let viewY = TODAY.y, viewM = TODAY.m;

  function renderCal() {
    const monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'][viewM];
    calMonth.textContent = monthName + ' ' + viewY;
    calGrid.innerHTML = '';

    ['M','T','W','T','F','S','S'].forEach(d => {
      const el = document.createElement('div'); el.className = 'dow'; el.textContent = d;
      calGrid.appendChild(el);
    });

    const first = new Date(viewY, viewM, 1);
    // Make Monday-first
    const startDow = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
    const daysInPrev  = new Date(viewY, viewM, 0).getDate();

    for (let i = startDow - 1; i >= 0; i--) {
      const el = document.createElement('div');
      el.className = 'day-cell muted';
      el.textContent = daysInPrev - i;
      calGrid.appendChild(el);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      let cls = 'day-cell';
      if (viewY === TODAY.y && viewM === TODAY.m && d === TODAY.d) cls += ' today';
      if (viewY === TODAY.y && viewM === TODAY.m && EVENT_DAYS.has(d)) cls += ' has-event';
      el.className = cls;
      el.textContent = d;
      calGrid.appendChild(el);
    }
    const filled = startDow + daysInMonth;
    const trail = (7 - (filled % 7)) % 7;
    for (let d = 1; d <= trail; d++) {
      const el = document.createElement('div');
      el.className = 'day-cell muted';
      el.textContent = d;
      calGrid.appendChild(el);
    }
  }

  calBtn.addEventListener('click', e => {
    e.stopPropagation();
    const r = calBtn.getBoundingClientRect();
    calPop.style.left = (r.right - 380) + 'px';
    calPop.style.top  = (r.bottom + 6) + 'px';
    calPop.classList.toggle('open');
  });
  calPrev.addEventListener('click', () => { viewM--; if (viewM < 0) { viewM = 11; viewY--; } renderCal(); });
  calNext.addEventListener('click', () => { viewM++; if (viewM > 11) { viewM = 0;  viewY++; } renderCal(); });
  calToday.addEventListener('click', () => { viewY = TODAY.y; viewM = TODAY.m; renderCal(); });

  document.addEventListener('click', e => {
    if (!e.target.closest('#calPop') && !e.target.closest('#calBtn')) {
      calPop.classList.remove('open');
    }
  });

  renderCal();
}
