import { BACKEND_URL } from '/assets/js/config.js'

document.addEventListener('DOMContentLoaded', function () {
    let comentarios = []
    let comentarioActual = null

    // Cargar comentarios desde la API
    function cargarComentarios() {
        const token = localStorage.getItem('jwt')
        if (!token) {
            alert('Debes iniciar sesión')
            window.location.href = '/login.html'
            return
        }
        fetch(`${BACKEND_URL}/api/comentario/listar`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
                comentarios = data
                mostrarComentarios(data)
            })
    }

    // Renderizar la tabla de comentarios
    function mostrarComentarios(lista) {
        const tbody = document.getElementById('tabla-comentarios')
        if (!tbody) return
        tbody.innerHTML = ''
        if (lista.length === 0) {
            const tr = document.createElement('tr')
            tr.innerHTML = `<td colspan="6" class="px-6 py-4 text-center text-gray-500">No hay comentarios.</td>`
            tbody.appendChild(tr)
            return
        }
        lista.forEach(com => {
            const tr = document.createElement('tr')
            tr.className = `transition-colors ${lista.indexOf(com) % 2 === 0 ? 'bg-white' : 'bg-pire-background/50'} hover:bg-pire-green/10`
            tr.innerHTML = `
                <td class="px-6 py-4">${com.id}</td>
                <td class="px-6 py-4">${com.comentario}</td>
                <td class="px-6 py-4">${com.fecha || ''}</td>
                <td class="px-6 py-4">${com.documento || ''}</td>
                <td class="px-6 py-4">${com.user_email || ''}</td>
                <td class="px-6 py-4 text-right">
                    <button class="btn-eliminar-comentario px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 transition-colors text-sm font-semibold shadow-sm" data-id="${com.id}">
                        <i class="fas fa-trash-alt mr-1"></i>Eliminar
                    </button>
                </td>
            `
            tbody.appendChild(tr)
        })
    }

    // Delegación de evento para eliminar comentario
    document.getElementById('tabla-comentarios').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-eliminar-comentario')) {
            const id = parseInt(e.target.getAttribute('data-id'))
            comentarioActual = comentarios.find(c => c.id === id)
            if (!comentarioActual) return
            document.getElementById('modal-confirmar').classList.remove('hidden')
        }
    })

    // Cancelar eliminación
    document.getElementById('btn-cancelar-eliminar').addEventListener('click', function () {
        document.getElementById('modal-confirmar').classList.add('hidden')
        comentarioActual = null
    })

    // Confirmar eliminación
    document.getElementById('btn-confirmar-eliminar').addEventListener('click', function () {
        if (!comentarioActual) return
        const token = localStorage.getItem('jwt')
        fetch(`http://127.0.0.1:8000/api/comentario/delete/${comentarioActual.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar comentario')
                return res.json()
            })
            .then(() => {
                cargarComentarios()
                document.getElementById('modal-confirmar').classList.add('hidden')
                comentarioActual = null
            })
            .catch(error => {
                alert(error.message || 'Error al eliminar comentario')
                if (error.message.includes('401')) {
                    localStorage.removeItem('jwt')
                    window.location.href = '/login.html'
                }
            })
    })

    // Filtro de búsqueda
    document.getElementById('busqueda-comentarios').addEventListener('input', function () {
        const filtro = this.value.toLowerCase()
        const filtrados = comentarios.filter(c =>
            (c.user_email && c.user_email.toLowerCase().includes(filtro))
        )
        mostrarComentarios(filtrados)
    })

    // Inicialización
    cargarComentarios()
})