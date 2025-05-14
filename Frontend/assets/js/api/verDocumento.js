import { BACKEND_URL } from '../config.js'

const token = localStorage.getItem('jwt')

if (!token) {
    window.location.href = '/login.html'
}

// Obtener el parámetro "id" de la URL
const urlParams = new URLSearchParams(window.location.search)
const documentoId = urlParams.get('id')

if (!documentoId) {
    alert('No se ha especificado un documento válido.')
    window.location.href = '/education.html' // Redirigir si no hay ID
}

document.addEventListener('DOMContentLoaded', () => {
    const documentoContainer = document.getElementById('document-preview')
    const downloadDocument = document.getElementById('downloadDocument')

    let url = ''

    if (documentoContainer && downloadDocument) {
        fetch(`${BACKEND_URL}/api/documentos/download/${documentoId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo.')
                }
                return response.blob()
            })
            .then(blob => {
                console.log('Blob:', blob)
                url = URL.createObjectURL(blob)
                const mimeType = blob.type

                let content = ''
                if (mimeType === 'application/pdf') {
                    content = `<embed src="${url}#toolbar=0" type="application/pdf" width="100%" height="100%" class="rounded-2xl" />`
                } else if (mimeType.startsWith('image/')) {
                    content = `<div class="overflow-y-auto h-full">
                <img src="${url}" alt="Documento" class="w-full h-auto rounded shadow" />
            </div>`
                } else {
                    content = `<p>El archivo no se puede previsualizar. <a href="${url}" target="_blank" class="text-blue-500 underline">Descargar</a></p>`
                }

                documentoContainer.innerHTML = content
            })
            .catch(error => {
                console.error('Error al cargar el archivo:', error)
                documentoContainer.innerHTML = '<p>Error al cargar el documento.</p>'
            })

        downloadDocument.addEventListener('click', () => {

            const a = document.createElement('a')
            a.href = url
            a.download = ''
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        })

        // Cargar datos del documento para el frontend
        fetch(`${BACKEND_URL}/api/documentos/${documentoId}/data`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar la información del documento.')
                }
                return response.json()
            })
            .then(data => {
                // Aquí puedes manejar los datos del documento
                console.log(data)

                // Datos del documento
                const idTituloDocumento = document.getElementById('idTituloDocumento')
                const nameAsignatura = document.getElementById('nameAsignatura')
                const nameCurso = document.getElementById('nameCurso')
                const nameCiclo = document.getElementById('nameCiclo')
                const ratingValue = document.getElementById('rating-value')

                idTituloDocumento.textContent = data.titulo
                nameAsignatura.textContent = data.asignatura

                const cursoParte = data.curso.match(/\dº Curso/)
                console.log(cursoParte)
                nameCurso.textContent = cursoParte
                nameCiclo.textContent = data.ciclo
                ratingValue.textContent = data.puntuacion

                // Datos del usuario del documento
                const nameUsuario = document.getElementById('nameUsuario')
                nameUsuario.textContent = data.usuario.nombre + ' ' + data.usuario.apellido

                const userAvatar = document.getElementById('avatarUsuario')
                if (userAvatar) {
                    userAvatar.innerHTML = `<img src="${BACKEND_URL}/${data.usuario.avatar}" alt="Avatar">`
                }
            })
            .catch(error => {
                console.error('Error al cargar la información del documento:', error)
            })
    }
})

// Función para puntuar el documento
function puntuarDocumento(documentoId, puntuacion) {
    
    const token = localStorage.getItem('jwt') // Asegúrate de que el usuario esté autenticado

    fetch(`http://127.0.0.1:8000/api/documentos/${documentoId}/puntuar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ puntuacion })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`)
            } else {
                alert('Puntuación registrada exitosamente.')
                console.log('Puntuación registrada:', data.nuevaPuntuacion)
                if(data.nuevaPuntuacion) {
                    const ratingValue = document.getElementById('rating-value')
                    ratingValue.textContent = data.nuevaPuntuacion
                }
            }
        })
        .catch(err => {
            console.error('Error al puntuar el documento:', err)
        })
}

// Agregar funcionalidad para puntuar documentos
const stars = document.querySelectorAll('#star-rating .star')
const starRatingButton = document.getElementById('submit-rating')
let puntuacionStar = 0

stars.forEach(star => {

    star.addEventListener('click', () => {

        puntuacionStar = star.getAttribute('data-value') // Obtener el valor de la estrella seleccionada
        console.log('Puntuación seleccionada:', puntuacionStar)
        
        // Marcar las estrellas seleccionadas
        stars.forEach(s => {
            if (s.getAttribute('data-value') <= puntuacionStar) {
                s.classList.add('selected')
            } else {
                s.classList.remove('selected')
            }
            
        })
    })
})

starRatingButton.addEventListener('click', () => {
    if (puntuacionStar > 0) {
        puntuarDocumento(documentoId, puntuacionStar)
    }
})