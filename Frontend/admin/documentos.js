import { BACKEND_URL } from '/assets/js/config.js'

document.addEventListener('DOMContentLoaded', function () {
    let documentos = []
    let documentoActual = null

    // Cargar documentos desde la API
    function cargarDocumentos() {
        const token = localStorage.getItem('jwt')
        if (!token) {
            alert('Debes iniciar sesión')
            window.location.href = '/login.html'
            return
        }
        fetch(`${BACKEND_URL}/api/documentos/mejores`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                documentos = data
                mostrarDocumentos(data)
            })
    }

    // Renderizar la tabla de documentos
    function mostrarDocumentos(lista) {
        const tbody = document.getElementById('tabla-documentos')
        if (!tbody) return
        tbody.innerHTML = ''
        if (lista.length === 0) {
            const tr = document.createElement('tr')
            tr.innerHTML = `<td colspan="5" class="px-6 py-4 text-center text-gray-500">No hay documentos.</td>`
            tbody.appendChild(tr)
            return
        }
        lista.forEach(doc => {
            const tr = document.createElement('tr')
            tr.className = `transition-colors ${lista.indexOf(doc) % 2 === 0 ? 'bg-white' : 'bg-pire-background/50'} hover:bg-pire-green/10`
            tr.innerHTML = `
                <td class="px-6 py-4">${doc.id}</td>
                <td class="px-6 py-4">${doc.titulo}</td>
                <td class="px-6 py-4">${doc.ruta || ''}</td>
                <td class="px-6 py-4">${doc.asignatura || ''}</td>
                <td class="px-6 py-4 text-right">
                    <button class="btn-eliminar-documento px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 transition-colors text-sm font-semibold shadow-sm" data-id="${doc.id}">
                        <i class="fas fa-trash-alt mr-1"></i>Eliminar
                    </button>
                </td>
            `
            tbody.appendChild(tr)
        })
    }

    // Delegación de evento para eliminar documento
    document.getElementById('tabla-documentos').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-eliminar-documento')) {
            const id = parseInt(e.target.getAttribute('data-id'))
            documentoActual = documentos.find(d => d.id === id)
            if (!documentoActual) return
            document.getElementById('modal-confirmar').classList.remove('hidden')
        }
    })

    // Cancelar eliminación
    document.getElementById('btn-cancelar-eliminar').addEventListener('click', function () {
        document.getElementById('modal-confirmar').classList.add('hidden')
        documentoActual = null
    })

    // Confirmar eliminación
    document.getElementById('btn-confirmar-eliminar').addEventListener('click', function () {
        if (!documentoActual) return
        const token = localStorage.getItem('jwt')
        fetch(`${BACKEND_URL}/api/documentos/delete/${documentoActual.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar documento')
                return res.json()
            })
            .then(() => {
                cargarDocumentos()
                document.getElementById('modal-confirmar').classList.add('hidden')
                documentoActual = null
            })
            .catch(error => {
                alert(error.message || 'Error al eliminar documento')
                if (error.message.includes('401')) {
                    localStorage.removeItem('jwt')
                    window.location.href = '/login.html'
                }
            })
    })

    // Filtro de búsqueda
    document.getElementById('busqueda-documentos').addEventListener('input', function () {
        const filtro = this.value.toLowerCase()
        const filtrados = documentos.filter(d =>
            (d.titulo && d.titulo.toLowerCase().includes(filtro))
        )
        mostrarDocumentos(filtrados)
    })

    // Inicialización
    cargarDocumentos()
})
