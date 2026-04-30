export function initChat() {
  const chatBody  = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend  = document.getElementById('chatSend');

  function appendMsg(role, html) {
    const wrap = document.createElement('div');
    wrap.className = 'msg ' + (role === 'user' ? 'user' : '');
    wrap.innerHTML = '<span class="av ' + (role === 'user' ? 'user' : 'ai') + '">'
      + (role === 'user' ? 'HA' : 'AI') + '</span>'
      + '<div class="bubble">' + html + '</div>';
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function send() {
    const v = chatInput.value.trim();
    if (!v) return;
    appendMsg('user', v.replace(/</g, '&lt;'));
    chatInput.value = '';
    chatInput.style.height = 'auto';
    setTimeout(() => {
      appendMsg('ai',
        'Anladım. <strong>"' + v.replace(/</g, '&lt;').slice(0, 60) +
        '"</strong> üzerine çalışmaya başlıyorum — sonucu burada özetleyip Jira\'ya da yorum atacağım.');
    }, 600);
  }

  chatSend.addEventListener('click', send);
  chatInput.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); send(); }
  });
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
  });

  document.querySelectorAll('.quick-actions .qa').forEach(b => {
    b.addEventListener('click', () => {
      chatInput.value = b.textContent.replace(/^\+\s*/, '');
      chatInput.focus();
    });
  });
}
