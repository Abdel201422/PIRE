let comentarios = [];

function cargarComentarios() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('Debes iniciar sesión');
        window.location.href = '/login.html';
        return;
    }
    fetch('http://127.0.0.1:8000/api/comentario/listar', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(data => {
        comentarios = data;
        mostrarComentarios(data);
    });
}

function mostrarComentarios(lista) {
    const tbody = document.getElementById('tabla-comentarios');
    if (!tbody) return;
    tbody.innerHTML = '';
    lista.forEach(com => {
        tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-2 px-4 border-b">${com.id}</td>
            <td class="py-2 px-4 border-b">${com.comentario}</td>
            <td class="py-2 px-4 border-b">${com.fecha || ''}</td>
            <td class="py-2 px-4 border-b">${com.documento || ''}</td>
            <td class="py-2 px-4 border-b">${com.user_email || ''}</td>
            <td class="py-2 px-4 border-b">
                <button class="text-red-600 hover:underline" onclick="eliminarComentario(${com.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarComentario(id) {
    const token = localStorage.getItem('jwt');
    if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;
    fetch(`http://127.0.0.1:8000/api/comentario/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(() => cargarComentarios());
}

// Inicialización directa (sin DOMContentLoaded)
(function() {
    if (!document.getElementById('tabla-comentarios')) return;
    cargarComentarios();

    // Filtro por email de usuario
    document.getElementById('filtro-comentarios').addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        const filtrados = comentarios.filter(c =>
            (c.user_email && c.user_email.toLowerCase().includes(filtro))
        );
        mostrarComentarios(filtrados);
    });
})();