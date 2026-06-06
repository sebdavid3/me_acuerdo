/* Shoutbox estilo Neocities */
(function() {
  'use strict';

  let shouts = [];
  const MAX_SHOUTS = 20;

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function trimMessage(msg) {
    return msg.length > 120 ? msg.slice(0, 120) + '…' : msg;
  }

  function renderShouts() {
    const container = document.getElementById('shoutList');
    if (!container) return;
    container.innerHTML = '';
    shouts.forEach(s => {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble';
      bubble.innerHTML = '<span class="chat-bubble-name">' + escapeHtml(s.name || 'anónimo') + '</span>' +
                         '<span class="chat-bubble-text">' + escapeHtml(trimMessage(s.message)) + '</span>';
      container.appendChild(bubble);
    });
    if (shouts.length === 0) {
      container.innerHTML = '<div class="chat-empty">Sé el primero en dejar un mensaje ✦</div>';
    }
    container.scrollTop = container.scrollHeight;
  }

  async function loadShouts() {
    shouts = await fetchShouts(MAX_SHOUTS);
    renderShouts();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('shoutName');
    const msgInput = document.getElementById('shoutMsg');
    const sendBtn = document.getElementById('shoutSend');
    const sendImg = document.getElementById('shoutSendImg');

    const name = (nameInput.value || '').trim().slice(0, 30) || 'anónimo';
    const message = (msgInput.value || '').trim().slice(0, 200);
    if (!message) return;

    sendBtn.disabled = true;
    sendImg.src = 'assets/buttons/Pixel Buttons/Next_Pushed.png';

    await insertShout(name, message);

    nameInput.value = '';
    msgInput.value = '';
    sendBtn.disabled = false;
    sendImg.src = 'assets/buttons/Pixel Buttons/Next_Idle.png';

    await loadShouts();
  }

  function initShoutbox() {
    const form = document.getElementById('shoutForm');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    const refreshBtn = document.getElementById('shoutRefresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', loadShouts);
    }

    if (CONFIG.SUPABASE_ANON_KEY === 'REEMPLAZAR_CON_ANON_KEY') {
      const container = document.getElementById('shoutList');
      if (container) {
        container.innerHTML = '<div class="chat-empty">Conecta Supabase para activar el chat ✦</div>';
      }
      return;
    }

    loadShouts();

    // Auto-refresh cada 30 segundos
    setInterval(loadShouts, 30000);
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShoutbox);
  } else {
    initShoutbox();
  }
})();
