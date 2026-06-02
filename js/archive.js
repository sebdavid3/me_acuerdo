/**
 * Archivo por meses + Búsqueda (F6, F7)
 * Tres filtros coherentes del mismo libro
 */

let activeFilter = null; // null | {type:'month',...} | {type:'search', query}

function buildArchive(entries = []) {
  const list = document.getElementById('archiveList');
  list.innerHTML = '';

  const months = {};
  entries.forEach(e => {
    const d = new Date(e.entry_date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const label = d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    if (!months[key]) months[key] = { label, key, year: d.getFullYear(), month: d.getMonth()+1 };
  });

  const sorted = Object.values(months).sort((a, b) => a.key.localeCompare(b.key));

  sorted.forEach(item => {
    const li = document.createElement('li');
    li.className = 'archive-item';
    li.textContent = item.label.charAt(0).toUpperCase() + item.label.slice(1);
    li.dataset.filter = 'month';
    li.dataset.year = item.year;
    li.dataset.month = item.month;
    li.addEventListener('click', () => applyMonthFilter(item.year, item.month, li));
    list.appendChild(li);
  });
}

function applyMonthFilter(year, month, el) {
  // Resetear estilos
  document.querySelectorAll('.archive-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  activeFilter = { type: 'month', year, month };
  window.dispatchEvent(new CustomEvent('apply-filter', { detail: activeFilter }));
}

function applySearchFilter(query) {
  if (!query.trim()) {
    clearFilter();
    return;
  }
  activeFilter = { type: 'search', query: query.trim() };
  window.dispatchEvent(new CustomEvent('apply-filter', { detail: activeFilter }));
}

function clearFilter() {
  activeFilter = null;
  document.querySelectorAll('.archive-item').forEach(i => i.classList.remove('active'));
  document.getElementById('searchField').value = '';
  window.dispatchEvent(new CustomEvent('apply-filter', { detail: null }));
}

function initArchive() {
  document.getElementById('searchBtn').addEventListener('click', () => {
    applySearchFilter(document.getElementById('searchField').value);
  });
  document.getElementById('searchField').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applySearchFilter(e.target.value);
  });
  document.getElementById('clearFilter').addEventListener('click', clearFilter);
}
