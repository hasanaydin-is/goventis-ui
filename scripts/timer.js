export function initTimer() {
  const timerBtn   = document.getElementById('timerBtn');
  const timerPlay  = document.getElementById('timerPlay');
  const timerLbl   = document.getElementById('timerLbl');
  const timerClock = document.getElementById('timerClock');
  const timerPulse = document.getElementById('timerPulse');
  const timerPop   = document.getElementById('timerPop');
  const tpClock    = document.getElementById('tpClock');
  const tpStatus   = document.getElementById('tpStatus');
  const tpToggle   = document.getElementById('tpToggle');
  const tpReset    = document.getElementById('tpReset');
  const tpClockSub = document.getElementById('tpClockSub');

  let tStart = null, tElapsed = 0, tHandle = null;

  function fmt(ms) {
    const s = Math.floor(ms / 1000);
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return h + ':' + m + ':' + ss;
  }

  function tick() {
    const now = Date.now();
    const ms = tElapsed + (tStart ? (now - tStart) : 0);
    timerClock.textContent = fmt(ms);
    tpClock.textContent    = fmt(ms);
  }

  function startTimer() {
    if (tStart) return;
    tStart = Date.now();
    tHandle = setInterval(tick, 500);
    timerBtn.classList.add('running');
    timerBtn.setAttribute('aria-pressed', 'true');
    timerLbl.style.display = 'none';
    timerClock.style.display = '';
    timerPulse.style.display = '';
    timerPlay.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
    tpToggle.textContent = 'Pause';
    tpStatus.textContent = 'Çalışıyor';
    tpStatus.classList.add('running');
    tpClockSub.textContent = 'GOV-142 · KD Web · ' + new Date().toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'}) + ' başladı';
    tick();
  }

  function stopTimer() {
    if (!tStart) return;
    tElapsed += Date.now() - tStart;
    tStart = null;
    clearInterval(tHandle);
    timerBtn.classList.remove('running');
    timerBtn.setAttribute('aria-pressed', 'false');
    timerPlay.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
    tpToggle.textContent = 'Devam et';
    tpStatus.textContent = 'Duraklatıldı';
    tpStatus.classList.remove('running');
    tpClockSub.textContent = 'Bu oturumda ' + fmt(tElapsed) + ' kayıt edildi.';
    if (tElapsed > 0) {
      timerClock.textContent = fmt(tElapsed);
      tpClock.textContent    = fmt(tElapsed);
    }
  }

  function resetTimer() {
    stopTimer();
    tElapsed = 0;
    timerClock.textContent = '00:00:00';
    tpClock.textContent    = '00:00:00';
    timerLbl.style.display = '';
    timerClock.style.display = 'none';
    timerPulse.style.display = 'none';
    tpToggle.textContent = 'Start';
    tpStatus.textContent = 'Idle';
    tpStatus.classList.remove('running');
    tpClockSub.textContent = 'Bu oturumda hiç süre kaydedilmedi.';
  }

  timerPlay.addEventListener('click', e => {
    e.stopPropagation();
    tStart ? stopTimer() : startTimer();
  });
  timerBtn.addEventListener('click', e => {
    if (e.target.closest('.play')) return;
    e.stopPropagation();
    const r = timerBtn.getBoundingClientRect();
    timerPop.style.left = (r.right - 360) + 'px';
    timerPop.style.top  = (r.bottom + 6) + 'px';
    timerPop.classList.toggle('open');
  });
  tpToggle.addEventListener('click', () => tStart ? stopTimer() : startTimer());
  tpReset.addEventListener('click', resetTimer);

  document.addEventListener('click', e => {
    if (!e.target.closest('#timerPop') && !e.target.closest('#timerBtn')) {
      timerPop.classList.remove('open');
    }
  });
}
