/**
 * Autenticación / desbloqueo por contraseña
 * F1: campo pequeño arriba del calendario
 */

let isEditMode = false;
let storedPassword = null;

async function loadPassword() {
  storedPassword = await fetchSettingsPassword();
  if (!storedPassword) {
    storedPassword = CONFIG.PASSWORD;
  }
}

function toggleEditMode(enable) {
  isEditMode = enable;
  const hint = document.getElementById('authHint');
  const fab = document.getElementById('fabWrite');
  const pwField = document.getElementById('passwordField');
  const unlockBtn = document.getElementById('unlockBtn');

  if (isEditMode) {
    hint.textContent = 'Modo escritura ✓';
    hint.style.color = 'var(--c-tertiary)';
    fab.classList.add('visible');
    pwField.placeholder = 'bloquear...';
    unlockBtn.textContent = '×';
    unlockBtn.setAttribute('aria-label', 'Bloquear');
  } else {
    hint.textContent = 'Modo lectura';
    hint.style.color = 'var(--c-secondary)';
    fab.classList.remove('visible');
    pwField.value = '';
    pwField.placeholder = 'escribe la clave...';
    unlockBtn.textContent = '→';
    unlockBtn.setAttribute('aria-label', 'Desbloquear');
  }

  // Actualizar visibilidad de botones de editar/borrar en páginas
  updatePageEditControls();
}

function handleAuth() {
  const field = document.getElementById('passwordField');
  const val = field.value.trim();

  if (isEditMode) {
    toggleEditMode(false);
    return;
  }

  if (val === storedPassword) {
    toggleEditMode(true);
    field.value = '';
  } else {
    const hint = document.getElementById('authHint');
    hint.textContent = 'la contraseña no coincide';
    hint.style.color = '#8B0000';
    setTimeout(() => {
      if (!isEditMode) {
        hint.textContent = 'Modo lectura';
        hint.style.color = 'var(--c-secondary)';
      }
    }, 2000);
  }
}

function initAuth() {
  loadPassword();
  document.getElementById('unlockBtn').addEventListener('click', handleAuth);
  document.getElementById('passwordField').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAuth();
  });
}
