import { BACKEND_URL } from '../config.js'

const token = localStorage.getItem('jwt')

if (!token) {
    window.location.href = '/login.html'
}

// Obtener el parámetro "id" de la URL
const urlParams = new URLSearchParams(window.location.search)
const documentoId = urlParams.get('id')
const comentariosContainer = document.getElementById('comentarios-container')

if (!documentoId) {
    alert('No se ha especificado un documento válido.')
    window.location.href = '/education.html' // Redirigir si no hay ID
}

document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('jwt') // Asegúrate de que el usuario esté autenticado

    fetch(`${BACKEND_URL}/api/comentario/documento/${documentoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`)
            } else {
                mostrarComentarios(data)
            }
        })
        .catch(err => {
            console.error('Error al puntuar el documento:', err)
        })
})

function mostrarComentarios(comentarios) {
    if(comentarios.length === 0) {
        comentariosContainer.innerHTML = '<p>No hay comentarios para este documento.</p>';
        return;
    }

    comentariosContainer.innerHTML = ''

    comentarios.forEach(comentario => {
    
        const fecha = new Date(comentario.fecha)
        const tiempoTranscurrido = Math.floor((Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24))

        const comentarioDiv = document.createElement('div')
        comentarioDiv.classList.add('bg-white', 'border', 'border-gray-300', 'border-2', 'p-5', 'rounded-3xl')
        
        comentarioDiv.innerHTML = `
        <div class="flex items-start mb-3">
            <div class="flex-shrink-0 mr-3">
                <img class="h-10 w-10 rounded-full object-cover" src="${BACKEND_URL}/${comentario.user.avatar || 'https://via.placeholder.com/40'}" alt="Avatar">
                </div>
            <div>
                <p class="text-green-600 font-medium">${comentario.user.nombre}</p>
                <p class="text-sm text-gray-500">${comentario.documento.titulo}</p>
                <p class="text-xs text-gray-400 mb-2">hace ${tiempoTranscurrido} días</p>
            </div>
        </div>
        <p>${comentario.comentario}</p>`

        comentariosContainer.append(comentarioDiv)
    })
}