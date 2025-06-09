// js/api/register.js

import { BACKEND_URL } from '../config.js'

export function setupRegisterForm() {

    const form = document.getElementById('registerForm')
    const responseDiv = document.getElementById('response')

    if (!form) {
        console.warn('No se encontró el formulario de registro')
        return
    }

    form.addEventListener('submit', function (e) {
        
        e.preventDefault()

        const email = document.getElementById('email').value
        const nombre = document.getElementById('nombre').value
        const apellido = document.getElementById('apellido').value
        const password = document.getElementById('password').value

        fetch(`${BACKEND_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, nombre, apellido, password }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                responseDiv.innerHTML = `<p style="color: red">Error: ${data.error}</p>`
            } else {
                responseDiv.innerHTML = `<p style="color: green">${data.message}</p>`
                setTimeout(() => {
                    window.location.href = '/login.html'
                }, 2000)
            }
        })
        .catch((error) => {
            console.error('Error:', error)
            responseDiv.innerHTML = `<p style="color: red">Error al registrar el usuario.</p>`
        })
    })
}
