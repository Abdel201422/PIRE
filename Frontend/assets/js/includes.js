// /js/includes.js

// Carga dinámica del componente header
document.addEventListener('DOMContentLoaded', () => {
    
    const headerMainContainer = document.getElementById('header');
    if (headerMainContainer) {
        fetch('/components/header_main.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html
            })
            .catch(error => console.error('Error al cargar el header:', error))
    }

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
            })
            .catch(error => console.error('Error al cargar el sidebar:', error));
    }
})