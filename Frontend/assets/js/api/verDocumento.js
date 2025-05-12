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

            idTituloDocumento.textContent = data.titulo
            nameAsignatura.textContent = data.asignatura
            nameCurso.textContent = data.curso
            nameCiclo.textContent = data.ciclo

            // Datos del usuario del documento
            const nameUsuario = document.getElementById('nameUsuario')
            nameUsuario.textContent = data.usuario.nombre + ' ' + data.usuario.apellido
        })
        .catch(error => {
            console.error('Error al cargar la información del documento:', error)
        })
    }
})