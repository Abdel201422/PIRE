import { BACKEND_URL } from '../config.js';

function rellenarPerfilUsuario() {
  const token = localStorage.getItem('jwt');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  fetch(`${BACKEND_URL}/api/dashboard`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  })
    .then(response => {
      if (!response.ok) throw new Error('No se pudo obtener la información del usuario');
      return response.json();
    })
    .then(data => {
      if (data && data.user) {
        
        // Inputs
        const inputNombre = document.getElementById('first-name');
        const inputApellidos = document.getElementById('last-name');
        const inputEmail = document.getElementById('email');
        if (inputNombre) inputNombre.value = data.user.nombre;
        if (inputApellidos) inputApellidos.value = data.user.apellido;
        if (inputEmail) inputEmail.value = data.user.email;
        // Cabecera
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        if (profileName) profileName.textContent = data.user.nombreCompleto;
        if (profileEmail) profileEmail.textContent = data.user.email;
        // Imagen de perfil
        // const avatarDivs = document.querySelectorAll('.w-32.h-32.rounded-full.overflow-hidden.border-2.border-gray-300.mb-4');
        // if (avatarDivs.length > 0 && data.user.avatarUrl) {
        //   avatarDivs.forEach(div => {
        //     div.innerHTML = `<img src="${data.user.avatarUrl}" alt="Avatar" class="object-cover w-full h-full" />`;
        //   });
        // }
      }
    })
    .catch(err => {
      console.error('Error al cargar el perfil:', err);
    });
}
document.addEventListener('DOMContentLoaded', function() {
  rellenarPerfilUsuario();
  modificarPerfil();
  modificarPassword();
});

function modificarPerfil() {

document.getElementById('save-personal-info-btn')?.addEventListener('click', function() {
  const token = localStorage.getItem('jwt');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  const nombre = document.getElementById('first-name')?.value;
  const apellido = document.getElementById('last-name')?.value;
  const email = document.getElementById('email')?.value;

  fetch(`${BACKEND_URL}/api/user/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ nombre, apellido, email })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Perfil actualizado correctamente');
        rellenarPerfilUsuario(); // refresca los datos
      } else {
        alert('Error al actualizar perfil: ' + (data.error || '')); 
      }
    })
    .catch(err => {
      alert('Error de red al actualizar el perfil');
      console.error(err);
    });
});
}
function modificarPassword() {
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
    alert('Por favor, completa todos los campos de contraseña.');
    return;
  }
  if (newPassword !== confirmPassword) {
    alert('La nueva contraseña y la confirmación no coinciden.');
    return;
  }
  if (newPassword.length < 6) {
    alert('La nueva contraseña debe tener al menos 6 caracteres.');
    return;
  }

  fetch(`${BACKEND_URL}/api/user/change-password`, {
    method: 'POST',
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
}


