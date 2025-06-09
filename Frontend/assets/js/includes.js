// /js/includes.js

// Carga dinámica del componente header
document.addEventListener('DOMContentLoaded', () => {
    
    const headerMainContainer = document.getElementById('header_main')
    if (headerMainContainer) {
        fetch('/components/header_main.html')
            .then(response => response.text())
            .then(html => {
                headerMainContainer.innerHTML = html
            })
            .catch(error => console.error('Error al cargar el header:', error))
    }
})