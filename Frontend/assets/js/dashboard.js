// js/dashboard.js

import { infoDashboard } from './api/dashboard.js'
import { setupLogout } from './api/auth.js'

infoDashboard()
setupLogout()

// Carga dinámica del componente header
document.addEventListener('DOMContentLoaded', () => {

    // Cargar dinámicamente el Header
    const headerContainer = document.getElementById('header_dashboard');
    if (headerContainer) {
        fetch('/components/header_dashboard.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
            })
            .catch(error => console.error('Error al cargar el header:', error));
    }

    // Cargar dinámicamente el Sidebar
    const sidebarContainer = document.getElementById('sidebar');
    if (sidebarContainer) {
        fetch('/components/sidebar.html')
            .then(response => response.text())
            .then(html => {
                sidebarContainer.innerHTML = html;

                // 💡 Aquí ya existe el elemento en el DOM
                const logoutLink = document.getElementById('logoutLink');
                if (logoutLink) {
                    logoutLink.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.removeItem('jwt');
                        window.location.href = '/';
                    });
                }
            })
            .catch(error => console.error('Error al cargar el sidebar:', error));
    }
})