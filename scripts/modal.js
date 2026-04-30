export function initModal() {
  const scrim = document.getElementById('scrim');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');

  function applyIssue(it) {
    document.getElementById('modalId').innerHTML =
      it.id + ' <span class="crumb-sep">/</span> KD Web <span class="crumb-sep">/</span> Sprint ' + it.sprint;
    document.getElementById('mEyebrow').textContent =
      it.id + ' · ' + (it.labelTop || 'TASK').toUpperCase() + ' · KD WEB';
    document.getElementById('mTitle').textContent    = it.title;
    document.getElementById('mStatus').textContent   = it.statusName;
    document.getElementById('mPriority').textContent = it.priority;
    document.getElementById('mAssignee').textContent = it.assignee;
    document.getElementById('mReporter').textContent = it.reporter;
    document.getElementById('mSprint').textContent   = it.sprint;
    document.getElementById('mPoints').textContent   = it.points;
    document.getElementById('mAi').textContent       = it.ai + '%';
  }

  function openModal(issue) {
    if (issue) applyIssue(issue);
    // close any open popovers so they don't sit on top of the modal
    document.getElementById('calPop')?.classList.remove('open');
    document.getElementById('timerPop')?.classList.remove('open');
    document.getElementById('addPop')?.classList.remove('open');
    // reset to first tab
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'overview'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'overview'));
    document.getElementById('modalBody').scrollTop = 0;
    scrim.classList.add('open');
    modal.classList.add('open');
  }

  function closeModal() {
    scrim.classList.remove('open');
    modal.classList.remove('open');
  }

  scrim.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'openIssue') openModal(e.data.issue);
    if (e.data.type === 'closeIssue') closeModal();
  });

  // Modal-internal tabs
  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.panel === t.dataset.tab);
      });
    });
  });
}
