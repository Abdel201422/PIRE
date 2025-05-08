import { BACKEND_URL } from '../config.js';
import { setupLogout } from './auth.js'

infoDashboard()
setupLogout()

export function infoDashboard() {

    const token = localStorage.getItem('jwt');

    // Si no hay token, volvemos al login
    if (!token) {
        window.location.href = '/login.html';
    } else {
        fetch(`${BACKEND_URL}/api/dashboard`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener la información del usuario');
                }
                return response.json();
            })
            .then(data => {
                const ui = document.getElementById('userInfo')
                const userName = document.getElementById('userName')
                const userNumDocumentos = document.getElementById('userNumDocumentos')
                if (data.error) {
                    ui.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                } else {
                    console.log(data)
                    if (userName) {
                        userName.textContent = data.user.nombre
                    }
                    
                    if (userNumDocumentos) {
                        userNumDocumentos.textContent = data.user.nDocumentos
                    }
                    
                   /*  ui.innerHTML = `
            <p><strong>ID:</strong> ${data.user.id}</p>
            <p><strong>Nombre:</strong> ${data.user.nombre}</p>
            <p><strong>Email:</strong> ${data.user.email}</p>
            <p><strong>Roles:</strong> ${data.user.roles.join(', ')}</p>
            <p><strong>Nº Documentos:</strong> ${data.user.nDocumentos}</p>`; */
                }
            })
            .catch(err => {
                console.error('Error:', err);
                document.getElementById('userInfo').innerHTML =
                    `<p style="color: red;">Error al cargar el dashboard.</p>`;
            });
    }
}