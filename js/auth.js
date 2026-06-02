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
  const fab = document.getElementById('fabWrite');
  const pwField = document.getElementById('passwordField');
  const unlockBtn = document.getElementById('unlockBtn');
  const unlockImg = unlockBtn.querySelector('img');

  if (isEditMode) {
    fab.classList.add('visible');
    pwField.placeholder = 'bloquear...';
    if (unlockImg) unlockImg.src = 'assets/buttons/Pixel Buttons/Cross_Idle.png';
    unlockBtn.setAttribute('aria-label', 'Bloquear');
  } else {
    fab.classList.remove('visible');
    pwField.value = '';
    pwField.placeholder = '';
    if (unlockImg) unlockImg.src = 'assets/buttons/arrow_right.gif';
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
  }
}

function initAuth() {
  loadPassword();
  document.getElementById('unlockBtn').addEventListener('click', handleAuth);
  document.getElementById('passwordField').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAuth();
  });
}
