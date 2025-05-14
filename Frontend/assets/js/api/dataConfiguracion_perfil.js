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
document.addEventListener('DOMContentLoaded', rellenarPerfilUsuario);

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
    method: 'PUT',
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
