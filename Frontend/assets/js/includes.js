// /js/includes.js

// Carga dinámica del componente header
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('header');
    if (headerContainer) {
        fetch('/components/header.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html
            })
            .catch(error => console.error('Error al cargar el header:', error))
        }
})