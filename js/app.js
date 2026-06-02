/**
 * App principal — Me acuerdo de...
 * Paso 2 (armazón visual) + Paso 3 (StPageFlip) + parte del 4/5
 */

let pageFlip = null;
let allEntries = [];
let currentEntries = [];
let wasMobile = false;
let playFlipSound = () => {};

/* =============================================================
   1. SONIDO procedural (Web Audio API)
   ============================================================= */
function initSound() {
  try {
    playFlipSound = createFlipSound();
  } catch(e) {
    console.warn('Audio no disponible:', e);
  }
}

/* =============================================================
   2. RENDERIZADO DE PÁGINAS
   ============================================================= */
function createCoverPage() {
  const page = document.createElement('div');
  page.className = 'page page-cover';
  page.dataset.density = 'hard';
  page.innerHTML = `
    <div class="page-content" style="justify-content:center; align-items:center;">
      <h1 class="book-title">Me acuerdo<br>de…</h1>
      <p class="book-subtitle">un libro de recuerdos</p>
    </div>
  `;
  return page;
}

function createBackCoverPage() {
  const page = document.createElement('div');
  page.className = 'page page-cover';
  page.dataset.density = 'hard';
  page.innerHTML = `
    <div class="page-content" style="justify-content:center; align-items:center;">
      <p class="book-subtitle" style="font-size:1.5rem;">~ fin ~</p>
    </div>
  `;
  return page;
}

function createEntryPage(entry) {
  const page = document.createElement('div');
  page.className = 'page';
  page.dataset.entryId = entry.id;

  const dateObj = new Date(entry.entry_date + 'T00:00:00');
  const dateStr = dateObj.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const content = (entry.content || '').replace(/^Me acuerdo de\.\.\./i, '').trim();

  page.innerHTML = `
    <div class="page-content">
      <span class="entry-date">${dateStr}</span>
      <p class="entry-text"><span class="entry-prefix">Me acuerdo de…</span> ${escapeHtml(content)}</p>
      ${isEditMode ? `
        <div class="page-actions" style="margin-top:auto; padding-top:16px; display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn-secondary btn-edit" data-id="${entry.id}">Editar</button>
          <button class="btn-secondary btn-delete" data-id="${entry.id}" style="color:#8B0000; border-color:rgba(139,0,0,0.3);">Borrar</button>
        </div>
      ` : ''}
    </div>
  `;
  return page;
}

function createEmptyStatePage() {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div class="page-content" style="justify-content:center; align-items:center;">
      <div class="empty-state">
        <p class="empty-title">Todavía no hay recuerdos</p>
        <p>Escribe el primero para empezar el libro.</p>
      </div>
    </div>
  `;
  return page;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* =============================================================
   3. STPAGEFLIP
   ============================================================= */
function buildPageElements() {
  const pages = [];
  pages.push(createCoverPage());

  if (currentEntries.length === 0) {
    pages.push(createEmptyStatePage());
  } else {
    currentEntries.forEach(entry => pages.push(createEntryPage(entry)));
  }

  pages.push(createBackCoverPage());
  return pages;
}

function getBookDims() {
  const isMobile = window.innerWidth <= 1024;
  return {
    isMobile,
    pageWidth: isMobile ? 340 : 400,
    pageHeight: isMobile ? 480 : 520,
  };
}

function initBook() {
  const container = document.getElementById('book');
  if (!container) return;

  const dims = getBookDims();
  wasMobile = dims.isMobile;

  // Limpiar contenedor
  container.innerHTML = '';

  // Inyectar páginas
  const pages = buildPageElements();
  pages.forEach(p => container.appendChild(p));

  // Destruir instancia previa si existe
  if (pageFlip) {
    try { pageFlip.destroy(); } catch(e) {}
    pageFlip = null;
  }

  // Ajustar tamaño del contenedor según orientación
  if (dims.isMobile) {
    container.style.width = dims.pageWidth + 'px';
    container.style.height = dims.pageHeight + 'px';
  } else {
    container.style.width = (dims.pageWidth * 2) + 'px';
    container.style.height = dims.pageHeight + 'px';
  }

  try {
    pageFlip = new St.PageFlip(container, {
      width: dims.pageWidth,
      height: dims.pageHeight,
      size: 'fixed',
      maxShadowOpacity: 0.35,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: dims.isMobile,
      drawShadow: true,
      flippingTime: 650,
      startPage: 0,
      autoSize: true,
    });
  } catch (err) {
    console.error('Error inicializando StPageFlip:', err);
    return;
  }

  // Esperar a que PageFlip esté listo antes de cargar páginas
  pageFlip.on('init', () => {
    pageFlip.loadFromHTML(container.querySelectorAll('.page'));
  });

  // Sonido al voltear
  pageFlip.on('flip', () => playFlipSound());

  updateSpineShadow();
}

function refreshBook() {
  // Si la orientación cambió, reinicializar completamente
  const dims = getBookDims();
  if (dims.isMobile !== wasMobile) {
    initBook();
    return;
  }

  // Misma orientación: usar updateFromHTML para conservar estado
  const container = document.getElementById('book');
  if (!container || !pageFlip) return;

  container.innerHTML = '';
  const pages = buildPageElements();
  pages.forEach(p => container.appendChild(p));

  try {
    if (typeof pageFlip.updateFromHTML === 'function') {
      pageFlip.updateFromHTML(container.querySelectorAll('.page'));
    } else if (typeof pageFlip.updateFromHtml === 'function') {
      pageFlip.updateFromHtml(container.querySelectorAll('.page'));
    } else {
      initBook();
    }
  } catch (e) {
    console.warn('updateFromHTML falló, reinicializando:', e);
    initBook();
  }
}

function updateSpineShadow() {
  const spine = document.querySelector('.spine-shadow');
  if (!spine) return;
  spine.style.display = window.innerWidth <= 1024 ? 'none' : 'block';
}

/* =============================================================
   4. NAVEGACIÓN
   ============================================================= */
function prevPage() {
  if (pageFlip && typeof pageFlip.flipPrev === 'function') pageFlip.flipPrev();
}
function nextPage() {
  if (pageFlip && typeof pageFlip.flipNext === 'function') pageFlip.flipNext();
}
function jumpToPage(index) {
  if (!pageFlip) return;
  const target = index + 1;
  const total = typeof pageFlip.getPageCount === 'function' ? pageFlip.getPageCount() : 999;
  if (target >= 0 && target < total && typeof pageFlip.turnToPage === 'function') {
    pageFlip.turnToPage(target);
  }
}

/* =============================================================
   5. FILTROS (coherentes entre sí)
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
  refreshBook();
}

/* =============================================================
   6. PANEL LATERAL (cajón en móvil)
   ============================================================= */
function initSidePanel() {
  const toggle = document.getElementById('ribbonToggle');
  const panel = document.getElementById('sidePanel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => panel.classList.toggle('open'));

  document.addEventListener('click', (e) => {
    if (window.innerWidth > 1024) return;
    if (!panel.contains(e.target) && !toggle.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

/* =============================================================
   7. MODO EDICIÓN — controles en páginas
   ============================================================= */
function updatePageEditControls() {
  refreshBook();
}

/* =============================================================
   8. FORMULARIO DE ESCRITURA
   ============================================================= */
function initWriteForm() {
  const dialog = document.getElementById('writeDialog');
  const fab = document.getElementById('fabWrite');
  const saveBtn = document.getElementById('saveEntry');
  const cancelBtn = document.getElementById('cancelWrite');
  const dateInput = document.getElementById('entryDate');
  const contentInput = document.getElementById('entryContent');
  if (!dialog || !fab) return;

  dateInput.valueAsDate = new Date();

  fab.addEventListener('click', () => {
    dialog.showModal();
    contentInput.focus();
  });

  cancelBtn.addEventListener('click', () => dialog.close());

  saveBtn.addEventListener('click', async () => {
    const content = contentInput.value.trim();
    const date = dateInput.value;
    if (!content || !date) return;

    const fullContent = content.startsWith('Me acuerdo de...')
      ? content
      : `Me acuerdo de... ${content}`;

    await insertEntry(fullContent, date);
    dialog.close();
    contentInput.value = '';
    await loadEntries();
  });
}

/* =============================================================
   9. CARGA INICIAL
   ============================================================= */
async function loadEntries() {
  allEntries = await fetchEntries();
  currentEntries = [...allEntries];
  buildArchive(allEntries);
  renderCalendar(allEntries);
  initBook();
}

/* =============================================================
   10. EVENT LISTENERS GLOBALES
   ============================================================= */
function initEvents() {
  document.getElementById('prevPage').addEventListener('click', prevPage);
  document.getElementById('nextPage').addEventListener('click', nextPage);

  window.addEventListener('refresh-calendar', () => renderCalendar(allEntries));
  window.addEventListener('jump-to-date', (e) => {
    const idx = currentEntries.findIndex(en => en.entry_date === e.detail);
    if (idx !== -1) jumpToPage(idx);
  });
  window.addEventListener('apply-filter', (e) => applyFilter(e.detail));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const dims = getBookDims();
      if (dims.isMobile !== wasMobile) {
        initBook();
      }
      updateSpineShadow();
    }, 250);
  });
}

/* =============================================================
   11. ARRANQUE
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  initAuth();
  initCalendar();
  initArchive();
  initSidePanel();
  initWriteForm();
  initEvents();
  initSound();

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
  initBook();
}
