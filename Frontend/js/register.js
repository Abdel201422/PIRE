const BACKEND_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', function() {
    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const nombre = document.getElementById('nombre').value;
            const password = document.getElementById('password').value;

            fetch(`${BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, nombre, password }),
            })
                .then((response) => response.json())
                .then((data) => {
                    const responseDiv = document.getElementById('response');
                    if (data.error) {
                        responseDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                    } else {
                        responseDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
                        // Redirige al login
                        setTimeout(() => {
                            window.location.href = '/login.html';
                        }, 2000); // Espera 2 segundos antes de redirigir
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    document.getElementById('response').innerHTML = `<p style="color: red;">Error al registrar el usuario.</p>`;
                });
        });
    }
    
    // Botón de login en el footer
    const loginFooterButton = document.getElementById('boton-login-footer');
    if (loginFooterButton) {
        loginFooterButton.addEventListener('click', function() {
            window.location.href = '/login.html';
        });
    }
    
    // Enlace "Inicia sesión"
    const loginLink = document.getElementById('enlace-login');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/login.html';
        });
    }
});