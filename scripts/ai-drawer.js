export function initAiDrawer() {
  const app          = document.querySelector('.app');
  const drawerBody   = document.getElementById('aiDrawerBody');
  const closeBtn     = document.getElementById('aiDrawerClose');
  const promptInput  = document.querySelector('.ai-prompt-input');
  const promptSend   = document.querySelector('.ap-send');
  const drawerInput  = document.getElementById('aiDrawerInput');
  const drawerSend   = document.getElementById('aiDrawerSend');
  const aiStarBtn    = document.getElementById('aiStarBtn');

  if (!app || !drawerBody) return;

  let greeted = false;

  function openDrawer() {
    app.classList.add('drawer-open');
    if (!greeted) {
      greeted = true;
      appendMsg('ai', 'Merhaba! Sana nasıl yardımcı olabilirim?');
    }
    setTimeout(() => drawerInput && drawerInput.focus(), 280);
  }

  function closeDrawer() {
    app.classList.remove('drawer-open');
  }

  function appendMsg(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'msg' + (role === 'user' ? ' user' : '');
    wrap.innerHTML =
      '<span class="av ' + (role === 'user' ? 'user' : 'ai') + '">' +
      (role === 'user' ? 'S' : 'AI') + '</span>' +
      '<div class="bubble">' + text.replace(/</g, '&lt;') + '</div>';
    drawerBody.appendChild(wrap);
    drawerBody.scrollTop = drawerBody.scrollHeight;
  }

  function appendTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg';
    wrap.id = 'aiTypingRow';
    wrap.innerHTML =
      '<span class="av ai">AI</span>' +
      '<div class="bubble"><span class="ai-typing-dots"><span></span><span></span><span></span></span></div>';
    drawerBody.appendChild(wrap);
    drawerBody.scrollTop = drawerBody.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('aiTypingRow');
    if (t) t.remove();
  }

  function sendMessage(text) {
    if (!text) return;
    openDrawer();
    appendMsg('user', text);
    appendTyping();
    setTimeout(() => {
      removeTyping();
      appendMsg('ai',
        'Anladım — "' + text.slice(0, 80) + '" konusunda sana yardımcı olabilirim. Devam etmemi ister misin?'
      );
    }, 900);
  }

  // Floating prompt → open drawer + send
  if (promptSend) {
    promptSend.addEventListener('click', () => {
      const text = promptInput.value.trim();
      if (!text) return;
      promptInput.value = '';
      sendMessage(text);
    });
  }
  if (promptInput) {
    promptInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = promptInput.value.trim();
        if (!text) return;
        promptInput.value = '';
        sendMessage(text);
      }
    });
  }

  // Drawer input → continue conversation
  if (drawerSend) {
    drawerSend.addEventListener('click', () => {
      const text = drawerInput.value.trim();
      if (!text) return;
      drawerInput.value = '';
      drawerInput.style.height = 'auto';
      sendMessage(text);
    });
  }
  if (drawerInput) {
    drawerInput.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        const text = drawerInput.value.trim();
        if (!text) return;
        drawerInput.value = '';
        drawerInput.style.height = 'auto';
        sendMessage(text);
      }
    });
    drawerInput.addEventListener('input', () => {
      drawerInput.style.height = 'auto';
      drawerInput.style.height = Math.min(drawerInput.scrollHeight, 120) + 'px';
    });
  }

  closeBtn && closeBtn.addEventListener('click', () => {
    closeDrawer();
    aiStarBtn && aiStarBtn.classList.remove('active');
  });

  // AI star button → toggle drawer + active state
  if (aiStarBtn) {
    aiStarBtn.addEventListener('click', () => {
      const isOpen = app.classList.contains('drawer-open');
      if (isOpen) {
        closeDrawer();
        aiStarBtn.classList.remove('active');
      } else {
        openDrawer();
        aiStarBtn.classList.add('active');
      }
    });
  }
}
