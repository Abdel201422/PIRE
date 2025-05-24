import { BACKEND_URL } from '../config.js'
import { DOC_URL } from '../config.js'
import { mostrarComentarios, sendComentario } from './getComentarios.js'

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
    const comentarButton = document.getElementById('comentarButton')
    const textAreaComentar = document.getElementById('textAreaComentar')

    if (comentarButton) {
        comentarButton.addEventListener('click', () => {

            if (textAreaComentar) {
                sendComentario(textAreaComentar.value, documentoId)
            }
        })
    }

    let url = ''

    infoDocumento()
    downloadDocumento(documentoContainer, downloadDocument, url)

    // Agregar funcionalidad para puntuar documentos
    const stars = document.querySelectorAll('#star-rating .star')
    const starRatingButton = document.getElementById('submit-rating')
    let puntuacionStar = 0

    stars.forEach(star => {

        star.addEventListener('click', () => {

            puntuacionStar = star.getAttribute('data-value') // Obtener el valor de la estrella seleccionada
            //console.log('Puntuación seleccionada:', puntuacionStar)

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

})

// Descargar el documento
function downloadDocumento(documentoContainer, downloadDocument, url) {
    if (documentoContainer && downloadDocument) {
        /* fetch(`${BACKEND_URL}/api/documentos/download/${documentoId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        }) */
        // Primero obtenemos los datos del documento para obtener la ruta del archivo
        fetch(`${BACKEND_URL}/api/documentos/${documentoId}/data`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la información del documento.')
            }
            return response.json()
        })
        .then(data => {
            console.log(data)
            // Construimos la URL del documento usando DOC_URL
            const docUrl = `${DOC_URL}/${data.ruta}`
    
            // Mostramos el documento según su tipo
            let content = ''
            
            if (data.ruta.toLowerCase().endsWith('.pdf')) {
            
                content = `<embed src="${docUrl}#toolbar=0" type="application/pdf" width="100%" height="100%" class="rounded-2xl" />`
            } else if (data.ruta.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            
                content = `<div class="overflow-y-auto h-full">
                    <img src="${docUrl}" alt="Documento" class="w-full h-auto rounded shadow" />
                </div>`
            } else {
                content = `<p>El archivo no se puede previsualizar. <a href="${docUrl}" target="_blank" class="text-blue-500 underline">Descargar</a></p>`
            }

            documentoContainer.innerHTML = content

            // Configurar el botón de descarga
            downloadDocument.addEventListener('click', () => {
                window.open(docUrl, '_blank')
            }) 
        })
            /* .then(blob => {
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
            }) */
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
    }
}

// Cargar datos del documento para el frontend
function infoDocumento() {
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
            //console.log(data)

            // Datos del documento
            const idTituloDocumento = document.getElementById('idTituloDocumento')
            const descripcionDocumento = document.getElementById('descripcionDocumento')
            const nameAsignatura = document.getElementById('nameAsignatura')
            const nameCurso = document.getElementById('nameCurso')
            const nameCiclo = document.getElementById('nameCiclo')
            const ratingValue = document.getElementById('rating-value')

            idTituloDocumento.textContent = data.titulo
            descripcionDocumento.textContent = data.descripcion
            nameAsignatura.textContent = data.asignatura

            const cursoParte = data.curso.match(/\dº Curso/)
            //console.log(cursoParte)
            nameCurso.textContent = cursoParte
            nameCiclo.textContent = data.ciclo
            ratingValue.textContent = data.puntuacion

            // Datos del usuario del documento
            const nameUsuario = document.getElementById('nameUsuario')
            nameUsuario.textContent = data.usuario.nombre + ' ' + data.usuario.apellido

            const userAvatar = document.getElementById('avatarUsuario')
            if (userAvatar) {
                userAvatar.innerHTML = `<img src="${DOC_URL}/${data.usuario.avatar}" alt="Avatar">`
            }

            const ratingValueTop = document.getElementById('rating-value-top')
            ratingValueTop.innerHTML = `<span
                                    class="bg-[var(--color-orange-100)] px-4 py-2 rounded-full flex items-center gap-2">
                                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.50516 0.25C9.79025 0.250313 10.0508 0.412325 10.177 0.667969L12.6018 5.58105L18.0247 6.36914C18.3069 6.41044 18.542 6.60862 18.6302 6.87988C18.7072 7.11731 18.6597 7.37518 18.51 7.56934L18.4397 7.64844L14.5159 11.4727L15.4427 16.873C15.4909 17.1543 15.3746 17.4386 15.1438 17.6064C14.9131 17.774 14.6073 17.7965 14.3548 17.6641L9.50418 15.1133L4.65458 17.6641C4.40207 17.7966 4.0963 17.774 3.86551 17.6064C3.63455 17.4386 3.51843 17.1544 3.56668 16.873L4.49247 11.4727L0.569615 7.64844C0.365202 7.44918 0.291971 7.15138 0.380161 6.87988C0.468444 6.6085 0.703203 6.41018 0.98563 6.36914L6.40653 5.58105L8.83231 0.667969L8.88602 0.576172C9.02453 0.374098 9.25568 0.25 9.50516 0.25Z"
                                            fill="#FFA53C" />
                                    </svg>
                                    <span class="font-medium">${data.puntuacion}</span>
                                </span>`

            mostrarComentarios(documentoId)
        })
        .catch(error => {
            console.error('Error al cargar la información del documento:', error)
        })
}

// Función para puntuar el documento
function puntuarDocumento(documentoId, puntuacion) {

    const token = localStorage.getItem('jwt') // Asegúrate de que el usuario esté autenticado

    fetch(`${BACKEND_URL}/api/documentos/${documentoId}/puntuar`, {
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
                //console.log('Puntuación registrada:', data.nuevaPuntuacion)
                if (data.nuevaPuntuacion) {
                    const ratingValue = document.getElementById('rating-value')
                    ratingValue.textContent = data.nuevaPuntuacion
                }
            }
        })
        .catch(err => {
            console.error('Error al puntuar el documento:', err)
        })
}
