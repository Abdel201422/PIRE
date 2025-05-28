// js/index.js

// Configurar los botones cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  setupIndexButtons()
})

function setupIndexButtons() {
  // Botón principal "¡Empezar ya!"
  const botonEmpezar = document.getElementById('botonEmpezar')
  if (botonEmpezar) {
    botonEmpezar.addEventListener('click', function() {
      window.location.href = '/register.html'
    })
  }

  // Botón secundario "Comenzar Ahora"
  const botonComenzar = document.getElementById('botonComenzar')
  if (botonComenzar) {
    botonComenzar.addEventListener('click', function() {
      window.location.href = '/register.html'
    })
  }

  // Botón "Iniciar sesión" en el pie de página
  const botonIniciarSesion = document.getElementById('botonIniciarSesion')
  if (botonIniciarSesion) {
    botonIniciarSesion.addEventListener('click', function() {
      window.location.href = '/login.html'
    })
  }
}