// js/api/dataConfiguracion_perfil.js

import { BACKEND_URL } from '../config.js'
import { DOC_URL } from '../config.js'

function rellenarPerfilUsuario() {
  const token = localStorage.getItem('jwt')
  if (!token) {
    window.location.href = '/login.html'
    return
  }
  fetch(`${BACKEND_URL}/api/dashboard`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  })
    .then(response => {
      if (!response.ok) throw new Error('No se pudo obtener la información del usuario')
      return response.json()
    })
    .then(data => {
      if (data && data.user) {
        
        // Inputs
        const inputNombre = document.getElementById('first-name')
        const inputApellidos = document.getElementById('last-name')
        const inputEmail = document.getElementById('email')

        const inputNombreCompleto = document.getElementById('userNameComplete')

        if (inputNombre) inputNombre.value = data.user.nombre
        if (inputApellidos) inputApellidos.value = data.user.apellido
        if (inputEmail) inputEmail.value = data.user.email

        if (inputNombreCompleto) inputNombreCompleto.textContent = data.user.nombreCompleto
        
        // Cabecera
        const profileName = document.getElementById('profile-name')
        const profileEmail = document.getElementById('profile-email')
        
        if (profileName) profileName.textContent = data.user.nombreCompleto
        if (profileEmail) profileEmail.textContent = data.user.email
        
        // Imagen de perfil
        const avatarDivs = document.querySelectorAll('#profile-image-container, #profile-image-preview')
        
        if (avatarDivs.length > 0) {
          let avatarUrl = data.user.avatar ? `${DOC_URL}/${data.user.avatar}` : ''
          if (avatarUrl) {
            avatarDivs.forEach(div => {
              div.innerHTML = `<img src="${avatarUrl}" alt="Avatar" class="object-cover w-full h-full" />`
            })

            const userAvatar = document.getElementById('user-avatar')
            userAvatar.innerHTML = `<img src="${avatarUrl}" alt="Avatar">`
            
          } else {
            avatarDivs.forEach(div => {
              div.innerHTML = `<span class='text-gray-400 flex items-center justify-center w-full h-full'>Sin foto</span>`
            })
          }
        }
      }
    })
    .catch(err => {
      console.error('Error al cargar el perfil:', err)
    })
}
document.addEventListener('DOMContentLoaded', function() {
  rellenarPerfilUsuario()
  modificarPerfil()
  modificarPassword()
  configurarEliminarCuenta()
})

// Función para configurar la eliminación de cuenta con modal de confirmación
function configurarEliminarCuenta() {
  const deleteBtn = document.getElementById('delete-account-btn');
  const modalConfirmar = document.getElementById('modal-confirmar-eliminar');
  const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
  const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
  
  if (deleteBtn) {
    // Mostrar modal al hacer clic en el botón de eliminar
    deleteBtn.addEventListener('click', function() {
      modalConfirmar.classList.remove('hidden');
    });
  }
  
  if (btnCancelarEliminar) {
    // Ocultar modal al hacer clic en cancelar
    btnCancelarEliminar.addEventListener('click', function() {
      modalConfirmar.classList.add('hidden');
    });
  }
  
  if (btnConfirmarEliminar) {
    // Eliminar cuenta al confirmar
    btnConfirmarEliminar.addEventListener('click', function() {
      eliminarCuenta();
    });
  }
}

// Función para eliminar la cuenta del usuario
function eliminarCuenta() {
  const token = localStorage.getItem('jwt');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  fetch(`${BACKEND_URL}/api/user/delete`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Ocultar el modal
      document.getElementById('modal-confirmar-eliminar').classList.add('hidden');
      
      // Mostrar mensaje de éxito
      const responseDiv = document.getElementById('response');
      responseDiv.innerHTML = `<div class='p-3 bg-green-100 text-green-700 rounded-lg'>Cuenta eliminada correctamente. Redirigiendo...</div>`;
      
      // Redireccionar después de un breve retraso
      setTimeout(() => {
        localStorage.removeItem('jwt');
        window.location.href = '/login.html';
      }, 1500);
    } else {
      // Mostrar mensaje de error
      const responseDiv = document.getElementById('response');
      responseDiv.innerHTML = `<div class='p-3 bg-red-100 text-red-700 rounded-lg'>Error al eliminar la cuenta: ${(data.error || '')}</div>`;
      setTimeout(() => { responseDiv.innerHTML = ''; }, 2500);
      
      // Ocultar el modal
      document.getElementById('modal-confirmar-eliminar').classList.add('hidden');
    }
  })
  .catch(err => {
    // Mostrar mensaje de error
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = `<div class='p-3 bg-red-100 text-red-700 rounded-lg'>Error de red al intentar eliminar la cuenta.</div>`;
    setTimeout(() => { responseDiv.innerHTML = ''; }, 2500);
    
    // Ocultar el modal
    document.getElementById('modal-confirmar-eliminar').classList.add('hidden');
    
    console.error(err);
  });
}

function modificarPerfil() {
  // --- Imagen de perfil ---
  const imageInput = document.getElementById('profile-image-upload')
  const saveImageBtn = document.getElementById('save-profile-image-btn')
  const previewDiv = document.getElementById('profile-image-preview')
  let selectedFile = null

  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      selectedFile = e.target.files[0]
      const fileNameSpan = document.getElementById('selected-file-name')
      if (fileNameSpan) fileNameSpan.textContent = selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'
      if (selectedFile && previewDiv) {
        const reader = new FileReader()
        reader.onload = function(e) {
          previewDiv.innerHTML = `<img src="${e.target.result}" alt="Avatar" class="object-cover w-full h-full" />`
        }
        reader.readAsDataURL(selectedFile)
      }
    })
  }

  if (saveImageBtn) {
    saveImageBtn.addEventListener('click', function() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        window.location.href = '/login.html'
        return
      }
      if (!selectedFile) {
        alert('Selecciona una imagen para subir.')
        return
      }
      const formData = new FormData()
      formData.append('image', selectedFile)
      fetch(`${BACKEND_URL}/api/user/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const responseDiv = document.getElementById('image-response')
          responseDiv.innerHTML = `<div class='p-3 bg-green-100 text-green-700 rounded-lg'>Imagen de perfil actualizada correctamente</div>`
          setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
          rellenarPerfilUsuario()
          // Limpiar selección
          imageInput.value = ''
          selectedFile = null
          const fileNameSpan = document.getElementById('selected-file-name')
          if (fileNameSpan) fileNameSpan.textContent = 'Ningún archivo seleccionado'
        } else {
          const responseDiv = document.getElementById('image-response')
          responseDiv.innerHTML = `<div class='p-3 bg-red-100 text-red-700 rounded-lg'>Error al actualizar imagen de perfil: ${(data.error || '')}</div>`
          setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
        }
      })
      .catch(err => {
        const responseDiv = document.getElementById('image-response')
        responseDiv.innerHTML = `<div class='p-3 bg-red-100 text-red-700 rounded-lg'>Error de red al subir la imagen</div>`
        setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
        console.error(err)
      })
    })
  }


document.getElementById('save-personal-info-btn')?.addEventListener('click', function() {
  const token = localStorage.getItem('jwt')
  if (!token) {
    window.location.href = '/login.html'
    return
  }
  const nombre = document.getElementById('first-name')?.value
  const apellido = document.getElementById('last-name')?.value
  const email = document.getElementById('email')?.value

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
      const responseDiv = document.getElementById('response');
      if (data.success) {
        responseDiv.innerHTML = `<div class="p-3 bg-green-100 text-green-700 rounded-lg">Perfil actualizado correctamente</div>`;
        setTimeout(() => { responseDiv.innerHTML = ''; }, 2500);
        rellenarPerfilUsuario() // refresca los datos
      } else {
        responseDiv.innerHTML = `<div class="p-3 bg-red-100 text-red-700 rounded-lg">Error al actualizar perfil: ${(data.error || '')}</div>`;
        setTimeout(() => { responseDiv.innerHTML = ''; }, 2500);
      }
    })
    .catch(err => {
      const responseDiv = document.getElementById('response')
      responseDiv.innerHTML = `<div class="p-3 bg-red-100 text-red-700 rounded-lg">Error de red al actualizar el perfil</div>`
      setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
      console.error(err)
    })
})
}
function modificarPassword() {
document.getElementById('save-password-btn')?.addEventListener('click', function() {
  const token = localStorage.getItem('jwt')
  if (!token) {
    window.location.href = '/login.html'
    return
  }
  const currentPassword = document.getElementById('current-password')?.value
  const newPassword = document.getElementById('new-password')?.value
  const confirmPassword = document.getElementById('confirm-password')?.value

  if (!currentPassword || !newPassword || !confirmPassword) {
    const responseDiv = document.getElementById('password-response')
    responseDiv.innerHTML = `<div class='p-3 bg-red-100 text-red-700 rounded-lg'>Por favor, completa todos los campos de contraseña.</div>`
    setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
    return
  }
  if (newPassword !== confirmPassword) {
    const responseDiv = document.getElementById('password-response')
    responseDiv.innerHTML = `<div class='p-3 bg-red-100 text-red-700 rounded-lg'>La nueva contraseña y la confirmación no coinciden.</div>`
    setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
    return
  }
  if (newPassword.length < 6) {
    alert('La nueva contraseña debe tener al menos 6 caracteres.')
    return
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
      const responseDiv = document.getElementById('password-response')
      if (data.success) {
        responseDiv.innerHTML = `<div class='p-3 bg-green-100 text-green-700 rounded-lg'>Contraseña cambiada correctamente</div>`
        setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
        document.getElementById('current-password').value = ''
        document.getElementById('new-password').value = ''
        document.getElementById('confirm-password').value = ''
      } else {
        responseDiv.innerHTML = `<div class='p-3 bg-red-100 text-red-700 rounded-lg'>Error al cambiar la contraseña: ${(data.error || '')}</div>`
        setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
      }
    })
    .catch(err => {
      const responseDiv = document.getElementById('password-response')
      responseDiv.innerHTML = `<div class='p-3 bg-red-100 text-red-700 rounded-lg'>Error de red al cambiar la contraseña</div>`
      setTimeout(() => { responseDiv.innerHTML = ''; }, 2500)
      console.error(err)
    })
})
}


