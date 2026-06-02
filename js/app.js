/**
 * App principal — Me acuerdo de... (Blog / Scroll infinito)
 */

let allEntries = [];
let currentEntries = [];
let playFlipSound = () => {};

/* =============================================================
   1. SONIDO (Web Audio API)
   ============================================================= */
function initSound() {
  try { playFlipSound = createFlipSound(); } catch(e) {}
}

/* =============================================================
   2. RENDERIZADO DE ENTRADAS (tarjetas en feed)
   ============================================================= */
function createEntryCard(entry) {
  const card = document.createElement('article');
  card.className = 'entry-card';
  card.dataset.entryId = entry.id;

  const dateObj = new Date(entry.entry_date + 'T00:00:00');
  const dateStr = dateObj.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const content = (entry.content || '').replace(/^Me acuerdo de\.\.\./i, '').trim();

  card.innerHTML = `
    <div class="entry-card-content">
      <span class="entry-date">${dateStr}</span>
      <p class="entry-text"><span class="entry-prefix">Me acuerdo de…</span> ${escapeHtml(content)}</p>
      <div class="entry-actions ${isEditMode ? 'visible' : ''}">
        <button class="btn-secondary btn-edit" data-id="${entry.id}">Editar</button>
        <button class="btn-secondary btn-delete" data-id="${entry.id}" style="color:#8B0000; border-color:rgba(139,0,0,0.3);">Borrar</button>
      </div>
    </div>
  `;

  // Animación de entrada suave
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  });

  // Delegar clicks de editar/borrar
  const actions = card.querySelector('.entry-actions');
  if (actions) {
    actions.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-edit')) {
        e.stopPropagation();
        openEditDialog(entry);
      }
      if (e.target.classList.contains('btn-delete')) {
        e.stopPropagation();
        handleDelete(entry.id);
      }
    });
  }

  return card;
}

function createEmptyState() {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `
    <p class="empty-title">Todavía no hay recuerdos</p>
    <p>Escribe el primero para empezar el diario.</p>
  `;
  return div;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* =============================================================
   3. RENDERIZADO DEL FEED
   ============================================================= */
function renderFeed() {
  const feedInner = document.getElementById('feedInner');
  const feedEnd = document.getElementById('feedEnd');
  if (!feedInner) return;

  feedInner.innerHTML = '';

  if (currentEntries.length === 0) {
    feedInner.appendChild(createEmptyState());
    feedEnd.style.display = 'none';
    return;
  }

  currentEntries.forEach((entry) => {
    feedInner.appendChild(createEntryCard(entry));
  });

  feedEnd.style.display = 'flex';
}

/* =============================================================
   4. SCROLL INFINITO (placeholder para carga progresiva)
   ============================================================= */
function initInfiniteScroll() {
  // Por ahora todas las entries se cargan de golpe.
  // Si en el futuro hay miles, implementar carga por lotes aquí.
}

/* =============================================================
   5. FILTROS
   ============================================================= */
async function applyFilter(filter) {
  if (!filter) {
    currentEntries = [...allEntries];
  } else if (filter.type === 'month') {
    currentEntries = await fetchEntriesByMonth(filter.year, filter.month);
  } else if (filter.type === 'search') {
    currentEntries = await searchEntries(filter.query);
  } else if (filter.type === 'date') {
    const d = filter.date;
    currentEntries = allEntries.filter(e => e.entry_date === d);
  }
  renderFeed();
}

/* =============================================================
   6. MODO EDICIÓN — sincronizar UI de tarjetas
   ============================================================= */
function updatePageEditControls() {
  // Mostrar/ocultar botones de editar en tarjetas existentes
  document.querySelectorAll('.entry-actions').forEach(el => {
    el.classList.toggle('visible', isEditMode);
  });
}

/* =============================================================
   8. FORMULARIO DE ESCRITURA
   ============================================================= */
function openNewEntryDialog() {
  const dialog = document.getElementById('writeDialog');
  const dateInput = document.getElementById('entryDate');
  const contentInput = document.getElementById('entryContent');
  dialog.dataset.mode = 'create';
  dialog.dataset.editId = '';
  document.querySelector('.write-title').textContent = 'Nuevo recuerdo';
  dateInput.valueAsDate = new Date();
  contentInput.value = '';
  dialog.showModal();
  contentInput.focus();
}

function initWriteForm() {
  const dialog = document.getElementById('writeDialog');
  const saveBtn = document.getElementById('saveEntry');
  const cancelBtn = document.getElementById('cancelWrite');
  const dateInput = document.getElementById('entryDate');
  const contentInput = document.getElementById('entryContent');
  if (!dialog) return;

  dateInput.valueAsDate = new Date();

  document.getElementById('writeLink').addEventListener('click', openNewEntryDialog);
  document.getElementById('feedWriteBtn').addEventListener('click', openNewEntryDialog);

  cancelBtn.addEventListener('click', () => dialog.close());

  saveBtn.addEventListener('click', async () => {
    const content = contentInput.value.trim();
    const date = dateInput.value;
    if (!content || !date) return;

    const fullContent = content.startsWith('Me acuerdo de...')
      ? content
      : `Me acuerdo de... ${content}`;

    const mode = dialog.dataset.mode;
    if (mode === 'edit' && dialog.dataset.editId) {
      await updateEntry(dialog.dataset.editId, { content: fullContent, entry_date: date });
    } else {
      await insertEntry(fullContent, date);
    }

    dialog.close();
    contentInput.value = '';
    await loadEntries();
  });
}

function openEditDialog(entry) {
  const dialog = document.getElementById('writeDialog');
  const dateInput = document.getElementById('entryDate');
  const contentInput = document.getElementById('entryContent');

  dialog.dataset.mode = 'edit';
  dialog.dataset.editId = entry.id;
  document.querySelector('.write-title').textContent = 'Editar recuerdo';
  dateInput.value = entry.entry_date;
  contentInput.value = entry.content;
  dialog.showModal();
  contentInput.focus();
}

async function handleDelete(id) {
  if (!confirm('¿Borrar este recuerdo?')) return;
  await deleteEntry(id);
  await loadEntries();
}

/* =============================================================
   9. CARGA INICIAL
   ============================================================= */
async function loadEntries() {
  allEntries = await fetchEntries();
  currentEntries = [...allEntries];
  buildArchive(allEntries);
  renderCalendar(allEntries);
  renderFeed();
}

/* =============================================================
   10. EVENT LISTENERS GLOBALES
   ============================================================= */
function initEvents() {
  window.addEventListener('refresh-calendar', () => renderCalendar(allEntries));
  window.addEventListener('jump-to-date', (e) => {
    // Scroll al recuerdo de esa fecha
    const el = document.querySelector(`[data-entry-id]`);
    // Para un blog, saltar a fecha = filtrar por esa fecha
    applyFilter({ type: 'date', date: e.detail });
  });
  window.addEventListener('apply-filter', (e) => applyFilter(e.detail));
}

/* =============================================================
   11. ARRANQUE
   ============================================================= */
async function initVisitorCount() {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  if (CONFIG.SUPABASE_ANON_KEY === 'REEMPLAZAR_CON_ANON_KEY') {
    el.textContent = '0000';
    return;
  }
  const count = await incrementVisitorCount();
  el.textContent = String(count).padStart(4, '0');
}

document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  initAuth();
  initCalendar();
  initArchive();
  initWriteForm();
  initEvents();
  initSound();
  initInfiniteScroll();
  initVisitorCount();

  if (CONFIG.SUPABASE_ANON_KEY === 'REEMPLAZAR_CON_ANON_KEY') {
    loadDemoData();
  } else {
    loadEntries();
  }
});

/* =============================================================
   12. DATOS DE DEMOSTRACIÓN
   ============================================================= */
function loadDemoData() {
  const demo = [
    {
      id: 'demo-1',
      content: 'Me acuerdo de... la primera vez que te vi. Llevabas una camiseta blanca demasiado grande y reías con la boca abierta.',
      entry_date: '2018-06-14',
      created_at: '2018-06-14T00:00:00'
    },
    {
      id: 'demo-2',
      content: 'Me acuerdo de... cuando nos perdimos en Madrid a las tres de la mañana y terminamos desayunando churros bajo la lluvia.',
      entry_date: '2019-03-22',
      created_at: '2019-03-22T00:00:00'
    },
    {
      id: 'demo-3',
      content: 'Me acuerdo de... tu cara al abrir el regalo de cumpleaños. Dijiste "no puede ser" cinco veces seguidas.',
      entry_date: '2020-11-07',
      created_at: '2020-11-07T00:00:00'
    },
    {
      id: 'demo-4',
      content: 'Me acuerdo de... la canción que sonaba en el coche cuando cruzamos el puente. Aún la escucho algunos domingos.',
      entry_date: '2022-08-30',
      created_at: '2022-08-30T00:00:00'
    },
    {
      id: 'demo-5',
      content: 'Me acuerdo de... cómo me tomaste la mano sin pedir permiso. Como si fuera lo más natural del mundo.',
      entry_date: '2024-02-14',
      created_at: '2024-02-14T00:00:00'
    }
  ];
  allEntries = demo;
  currentEntries = [...demo];
  buildArchive(demo);
  renderCalendar(demo);
  renderFeed();
}
