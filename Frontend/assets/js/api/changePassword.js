import { BACKEND_URL } from '../config.js';

document.getElementById('save-password-btn')?.addEventListener('click', function() {
  const token = localStorage.getItem('jwt');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  const currentPassword = document.getElementById('current-password')?.value;
  const newPassword = document.getElementById('new-password')?.value;
  const confirmPassword = document.getElementById('confirm-password')?.value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert('Por favor, rellena todos los campos de contraseña.');
    return;
  }
  if (newPassword !== confirmPassword) {
    alert('La nueva contraseña y la confirmación no coinciden.');
    return;
  }

  fetch(`${BACKEND_URL}/api/user/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Contraseña cambiada correctamente');
        // Limpiar inputs
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
      } else {
        alert('Error al cambiar la contraseña: ' + (data.error || ''));
      }
    })
    .catch(err => {
      alert('Error de red al cambiar la contraseña');
      console.error(err);
    });
});
