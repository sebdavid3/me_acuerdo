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
    const list = document.getElementById('shoutList');
    if (!list) return;
    list.innerHTML = '';
    shouts.forEach(s => {
      const li = document.createElement('li');
      li.className = 'shout-item';
      li.innerHTML = '<span class="shout-name">' + escapeHtml(s.name || 'anónimo') + ':</span> ' +
                     '<span class="shout-msg">' + escapeHtml(trimMessage(s.message)) + '</span>';
      list.appendChild(li);
    });
    if (shouts.length === 0) {
      list.innerHTML = '<li class="shout-empty">Sé el primero en dejar un mensaje ✦</li>';
    }
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

    const name = (nameInput.value || '').trim().slice(0, 30) || 'anónimo';
    const message = (msgInput.value || '').trim().slice(0, 200);
    if (!message) return;

    sendBtn.disabled = true;
    sendBtn.textContent = '...';

    await insertShout(name, message);

    nameInput.value = '';
    msgInput.value = '';
    sendBtn.disabled = false;
    sendBtn.textContent = '✦ Enviar';

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
      const list = document.getElementById('shoutList');
      if (list) {
        list.innerHTML = '<li class="shout-empty">Conecta Supabase para activar el chat ✦</li>';
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
