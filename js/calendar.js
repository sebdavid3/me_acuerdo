/**
 * Calendario lateral (F5)
 * Muestra mes actual, días con recuerdos marcados en violeta
 */

let currentCalYear = new Date().getFullYear();
let currentCalMonth = new Date().getMonth() + 1; // 1-12

function renderCalendar(entries = []) {
  const grid = document.getElementById('calendarGrid');
  const nameEl = document.getElementById('calMonthName');
  grid.innerHTML = '';

  const monthNames = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];
  nameEl.textContent = `${monthNames[currentCalMonth - 1]} ${currentCalYear}`;

  const firstDay = new Date(currentCalYear, currentCalMonth - 1, 1).getDay(); // 0=Dom
  const daysInMonth = new Date(currentCalYear, currentCalMonth, 0).getDate();
  const daysInPrev = new Date(currentCalYear, currentCalMonth - 1, 0).getDate();

  // Cabeceras
  const headers = ['D','L','M','X','J','V','S'];
  headers.forEach(h => {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = h;
    el.style.fontWeight = '700';
    grid.appendChild(el);
  });

  // Días previos
  for (let i = firstDay - 1; i >= 0; i--) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = daysInPrev - i;
    grid.appendChild(el);
  }

  // Días del mes
  const markedDates = new Set(
    entries
      .filter(e => {
        const d = new Date(e.entry_date);
        return d.getFullYear() === currentCalYear && d.getMonth() + 1 === currentCalMonth;
      })
      .map(e => new Date(e.entry_date).getDate())
  );

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day current-month';
    el.textContent = d;
    if (markedDates.has(d)) {
      el.classList.add('marked');
      el.addEventListener('click', () => jumpToDate(currentCalYear, currentCalMonth, d));
    }
    grid.appendChild(el);
  }

  // Días siguientes para completar la cuadrícula
  const totalCells = firstDay + daysInMonth;
  const remainder = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remainder; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = i;
    grid.appendChild(el);
  }
}

function jumpToDate(year, month, day) {
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  window.dispatchEvent(new CustomEvent('jump-to-date', { detail: dateStr }));
}

function initCalendar() {
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentCalMonth--;
    if (currentCalMonth < 1) { currentCalMonth = 12; currentCalYear--; }
    window.dispatchEvent(new CustomEvent('refresh-calendar'));
  });
  document.getElementById('nextMonth').addEventListener('click', () => {
    currentCalMonth++;
    if (currentCalMonth > 12) { currentCalMonth = 1; currentCalYear++; }
    window.dispatchEvent(new CustomEvent('refresh-calendar'));
  });
}
