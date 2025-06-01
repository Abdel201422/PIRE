// js/api/getComentarios.js

import { BACKEND_URL } from '../config.js'
import { DOC_URL } from '../config.js'

const token = localStorage.getItem('jwt')

export function mostrarComentarios(documentoId) {
    const comentariosContainer = document.getElementById('comentarios-container')
    
    fetch(`${BACKEND_URL}/api/comentario/documento/${documentoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .then(data => {
            //console.log(comentariosContainer)
            if (!comentariosContainer) return

            if (data.error) {
                comentariosContainer.innerHTML = `<p class="text-red-500">${data.error}</p>`
                return
            }

            if (data.length === 0) {
                comentariosContainer.innerHTML = '<p class="text-gray-500">No hay comentarios para este documento.</p>'
                return
            }

            comentariosContainer.innerHTML = ''

            data.forEach(comentario => {
                const fecha = new Date(comentario.fecha)
                const dias = Math.floor((Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24))

                const comentarioDiv = document.createElement('div')
                comentarioDiv.classList.add('bg-white', 'border-2', 'border-gray-300', 'p-5', 'rounded-3xl')

                comentarioDiv.innerHTML = `
                    <div class="flex items-start mb-3">
                        <div class="flex-shrink-0 mr-3">
                            <img class="h-10 w-10 rounded-full object-cover" src="${DOC_URL}/${comentario.user.avatar || 'img/default-avatar.png'}" alt="Avatar">
                        </div>
                        <div>
                            <p class="text-green-600 font-medium">${comentario.user.nombre}</p>
                            <p class="text-sm text-gray-500">${comentario.documento.titulo}</p>
                            <p class="text-xs text-gray-400 mb-2">Hace ${dias} día${dias !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <p>${comentario.comentario}</p>
                `

                comentariosContainer.appendChild(comentarioDiv)
            })
        })
        .catch(err => {
            //console.error('❌ Error al cargar comentarios:', err)
            if (comentariosContainer) {
                comentariosContainer.innerHTML = '<p class="text-red-500">Hubo un error al cargar los comentarios.</p>'
            }
        })
}

// Función para enviar a backend el comentario
export function sendComentario(comentario, documentoId) {

    if (comentario) {
        const userId = window.USER_INFO?.id

        fetch(`${BACKEND_URL}/api/comentario/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                comentario: comentario,
                documento_id: documentoId,
                user_id: userId
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al enviar el comentario')
                }
                return response.json()
            })
            .then(data => {
                //console.log('✅ Comentario enviado:', data)
                alert('Comentario enviado correctamente')

                // Opcional: limpiar el textarea
                mostrarComentarios(documentoId)
                document.getElementById('textAreaComentar').value = ''

            })
            .catch(error => {
                //console.error('❌ Error:', error)
                alert('Hubo un error al enviar el comentario')
            })
    } else {
        alert('escribe perro')
    }
}