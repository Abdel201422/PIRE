import { API_URL } from './config.js';
let usuarios = [];
console.log('usuarios.js cargado');

function cargarUsuarios() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('Debes iniciar sesión');
        window.location.href = '/login.html';
        return;
    }
    fetch(`${API_URL}/api/users`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log('Usuarios recibidos:', data);
        if (!Array.isArray(data)) {
            alert(data.message || 'Error de autenticación');
            return;
        }
        usuarios = data;
        mostrarUsuarios(data);
    });
}

function mostrarUsuarios(lista) {
    const tbody = document.getElementById('tabla-usuarios');
    if (!tbody) return;
    tbody.innerHTML = '';
    lista.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-2 px-4 border-b">${user.id}</td>
            <td class="py-2 px-4 border-b">${user.nombre || ''}</td>
            <td class="py-2 px-4 border-b">${user.apellido || ''}</td>
            <td class="py-2 px-4 border-b">${user.email}</td>
            <td class="py-2 px-4 border-b">${user.roles.join(', ')}</td>
            <td class="py-2 px-4 border-b">
                <button class="text-blue-600 hover:underline mr-2" onclick="abrirModalEditar(${user.id})">Editar</button>
                <button class="text-red-600 hover:underline" onclick="eliminarUsuario(${user.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalCrear() {
    document.getElementById('modal-titulo').textContent = 'Crear Usuario';
    document.getElementById('usuario-id').value = '';
    document.getElementById('usuario-nombre').value = '';
    document.getElementById('usuario-apellido').value = '';
    document.getElementById('usuario-email').value = '';
    document.getElementById('usuario-password').value = '';
    document.getElementById('usuario-roles').value = '';
    document.getElementById('modal-usuario').classList.remove('hidden');
}

function abrirModalEditar(id) {
    const user = usuarios.find(u => u.id === id);
    if (!user) return;
    document.getElementById('modal-titulo').textContent = 'Editar Usuario';
    document.getElementById('usuario-id').value = user.id;
    document.getElementById('usuario-nombre').value = user.nombre || '';
    document.getElementById('usuario-apellido').value = user.apellido || '';
    document.getElementById('usuario-email').value = user.email;
    document.getElementById('usuario-password').value = '';
    document.getElementById('usuario-roles').value = user.roles.join(',');
    document.getElementById('modal-usuario').classList.remove('hidden');
}

function eliminarUsuario(id) {
    const token = localStorage.getItem('jwt');
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    fetch(`${API_URL}/api/users/${id}/delete`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(() => cargarUsuarios());
}

(function() {
    if (!document.getElementById('tabla-usuarios')) return;

    cargarUsuarios();

    document.getElementById('filtro').addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        const filtrados = usuarios.filter(u =>
            (u.nombre && u.nombre.toLowerCase().includes(filtro)) ||
            (u.apellido && u.apellido.toLowerCase().includes(filtro)) ||
            (u.email && u.email.toLowerCase().includes(filtro))
        );
        mostrarUsuarios(filtrados);
    });

    document.getElementById('btn-crear').addEventListener('click', abrirModalCrear);

    document.getElementById('btn-cancelar').addEventListener('click', () => {
        document.getElementById('modal-usuario').classList.add('hidden');
    });

    document.getElementById('form-usuario').addEventListener('submit', function(e) {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        const id = document.getElementById('usuario-id').value;
        const nombre = document.getElementById('usuario-nombre').value;
        const apellido = document.getElementById('usuario-apellido').value;
        const email = document.getElementById('usuario-email').value;
        const password = document.getElementById('usuario-password').value;
        const roles = document.getElementById('usuario-roles').value.split(',').map(r => r.trim());

        const datos = { email, roles, nombre, apellido };
        if (password) datos.password = password;

        if (id) {
            // Editar usuario
            fetch(`${API_URL}/api/users/${id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(() => {
                cargarUsuarios();
                document.getElementById('modal-usuario').classList.add('hidden');
            });
        } else {
            // Crear usuario
            fetch(`${API_URL}/api/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ ...datos, password })
            })
            .then(res => res.json())
            .then(() => {
                cargarUsuarios();
                document.getElementById('modal-usuario').classList.add('hidden');
            });
        }
    });
})();