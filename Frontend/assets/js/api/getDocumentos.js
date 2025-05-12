import { BACKEND_URL } from '../config.js'

const token = localStorage.getItem('jwt')

if (!token) {
    window.location.href = '/login.html'
}

// Obtener el parámetro "codigo" de la URL
const urlParams = new URLSearchParams(window.location.search)
const codigoAsignatura = urlParams.get('codigo')

if (!codigoAsignatura) {
    alert('No se ha especificado una asignatura válida.')
    window.location.href = '/education.html' // Redirigir si no hay código
}

document.addEventListener('DOMContentLoaded', () => {
    const documentosContainer = document.getElementById('documentosContainer')

    fetch(`${BACKEND_URL}/asignatura/${codigoAsignatura}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    })
        .then(response => response.json())
        .then(data => {
            documentosContainer.innerHTML = '' // Limpiar contenedor
            
            if (data.length === 0) {
                documentosContainer.innerHTML = '<p>No hay documentos disponibles para esta asignatura.</p>'
                return
            }

            data.forEach(documento => {
                const docDiv = document.createElement('div')
                docDiv.classList.add('documento-card', 'p-4', 'border', 'rounded-lg', 'shadow-md')
                docDiv.innerHTML = `
                    <h3 class="text-lg font-bold">${documento.nombre}</h3>
                    <p class="text-sm text-gray-500">${documento.descripcion}</p>`
                
                // Evento para redirigir a la página de visualización
                docDiv.addEventListener('click', () => {
                    window.location.href = `/documento.html?id=${documento.id}`
                })

                documentosContainer.appendChild(docDiv)
            }) 
        })
        .catch(error => {
            console.error('Error al cargar documentos:', error)
            documentosContainer.innerHTML = '<p>Error al cargar los documentos.</p>'
        })
})