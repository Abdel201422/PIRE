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
})

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
          alert('Imagen de perfil actualizada correctamente')
          rellenarPerfilUsuario()
          // Limpiar selección
          imageInput.value = ''
          selectedFile = null
          const fileNameSpan = document.getElementById('selected-file-name')
          if (fileNameSpan) fileNameSpan.textContent = 'Ningún archivo seleccionado'
        } else {
          alert('Error al actualizar imagen de perfil: ' + (data.error || ''))
        }
      })
      .catch(err => {
        alert('Error de red al subir la imagen')
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
      if (data.success) {
        alert('Perfil actualizado correctamente')
        rellenarPerfilUsuario() // refresca los datos
      } else {
        alert('Error al actualizar perfil: ' + (data.error || '')) 
      }
    })
    .catch(err => {
      alert('Error de red al actualizar el perfil')
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
    alert('Por favor, completa todos los campos de contraseña.')
    return
  }
  if (newPassword !== confirmPassword) {
    alert('La nueva contraseña y la confirmación no coinciden.')
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
      if (data.success) {
        alert('Contraseña cambiada correctamente')
        document.getElementById('current-password').value = ''
        document.getElementById('new-password').value = ''
        document.getElementById('confirm-password').value = ''
      } else {
        alert('Error al cambiar la contraseña: ' + (data.error || ''))
      }
    })
    .catch(err => {
      alert('Error de red al cambiar la contraseña')
      console.error(err)
    })
})
}


