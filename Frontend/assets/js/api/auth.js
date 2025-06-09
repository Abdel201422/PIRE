// js/api/auth.js

import { BACKEND_URL } from '../config.js'

export function setupLoginForm() {
  const form = document.getElementById('loginForm')
  if (!form) return

  form.addEventListener('submit', async function (e) {
    e.preventDefault()

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      const responseDiv = document.getElementById('response')

      if (!res.ok) {
        responseDiv.innerHTML = `<p style="color: red">Error: ${data.message || data.error}</p>`
        return
      }

      localStorage.setItem('jwt', data.token)
      window.location.href = '/dashboard.html'

    } catch (error) {
      document.getElementById('response').innerHTML =
        `<p style="color: red">Error al iniciar sesión.</p>`
    }
  })
}

export function setupLogout() {
  const logoutLink = document.getElementById('logoutLink')

  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      // Prevenir la acción predeterminada del enlace (que sería navegar a otra página)
      e.preventDefault()

      // Eliminar el token de localStorage
      localStorage.removeItem('jwt')

      // Redirigir a la página de inicio
      window.location.href = '/index.html'
    })
  }
}

