
const BACKEND_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', function() {
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const res = await fetch(`${BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                const data = await res.json();
                
                const responseDiv = document.getElementById('response');
                if (!res.ok) {
                    responseDiv.innerHTML = `<p style="color: red;">Error: ${data.message || data.error}</p>`;
                    return;
                }
                
                // Guarda el token y redirige a la página HTML del dashboard
                localStorage.setItem('jwt', data.token);
                window.location.href = '/dashboard.html';
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('response').innerHTML =
                    `<p style="color: red;">Error al iniciar sesión.</p>`;
            }
        });
    }
    
    // Botón de login en el footer
    const loginFooterButton = document.getElementById('boton-login-footer');
    if (loginFooterButton) {
        loginFooterButton.addEventListener('click', function() {
            window.location.href = '/login.html';
        });
    }
});