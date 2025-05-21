import { BACKEND_URL } from '/assets/js/config.js';

// Verificar autenticación
const token = localStorage.getItem('jwt');
if (!token) {
    window.location.href = '/login.html';
}

// Variables globales
let usuarios = [];
let usuarioActual = null;

// Cargar componentes dinámicamente
import { infoUser } from '/assets/js/api/dataDashboard.js';
document.addEventListener('DOMContentLoaded', () => {
    infoUser();
    // Cargar datos de usuarios
    cargarUsuarios();

    // Configurar eventos de los modales
    configurarEventosModales();
    
    // Configurar evento de búsqueda
    configurarBusqueda();
});

// Función para configurar la búsqueda
function configurarBusqueda() {
    const inputBusqueda = document.getElementById('busqueda-usuarios');
    
    inputBusqueda.addEventListener('input', () => {
        filtrarUsuarios(inputBusqueda.value.toLowerCase());
    });
}

// Función para filtrar usuarios según el texto de búsqueda
function filtrarUsuarios(textoBusqueda) {
    if (!Array.isArray(usuarios) || usuarios.length === 0) return;
    
    // Si no hay texto de búsqueda, mostrar todos los usuarios
    if (!textoBusqueda.trim()) {
        mostrarUsuarios(usuarios);
        return;
    }
    
    // Filtrar los usuarios que coinciden con el texto de búsqueda
    const usuariosFiltrados = usuarios.filter(user => {
        if (!user) return false;
        
        const nombre = (user.nombre || '').toLowerCase();
        const apellido = (user.apellido || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        
        return nombre.includes(textoBusqueda) || 
               apellido.includes(textoBusqueda) || 
               email.includes(textoBusqueda);
    });
    
    mostrarUsuarios(usuariosFiltrados);
}

// Cargar usuarios desde la API
function cargarUsuarios() {
    fetch(`${BACKEND_URL}/api/users`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => {
        // Verificar si la respuesta es JSON antes de intentar analizarla
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
                }).catch(e => {
                    // Si falla el parsing JSON del error, lanzar el error original
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                });
            }
            return response.json();
        } else {
            // Si no es JSON, manejar como texto
            throw new Error(`La respuesta no es JSON. Status: ${response.status}`);
        }
    })
    .then(data => {
        console.log('Datos de usuarios recibidos:', data);
        if (!Array.isArray(data)) {
            throw new Error(data.message || 'Error de autenticación: la respuesta no es un array');
        }
        usuarios = data;
        mostrarUsuarios(data);
    })
    .catch(error => {
        console.error('Error al cargar usuarios:', error);
        document.getElementById('tabla-usuarios').innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-red-500">
                    Error al cargar los usuarios: ${error.message}. Por favor, intenta de nuevo.
                </td>
            </tr>
        `;
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt');
            window.location.href = '/login.html';
        }
    });
}

// Renderizar la tabla de usuarios
function mostrarUsuarios(lista) {
    const tbody = document.getElementById('tabla-usuarios');
    if (!tbody) return;
    
    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No hay usuarios disponibles.
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    lista.forEach(user => {
        html += `
            <tr>
                <td class="px-6 py-4">${user.id}</td>
                <td class="px-6 py-4">${user.nombre || ''}</td>
                <td class="px-6 py-4">${user.apellido || ''}</td>
                <td class="px-6 py-4">${user.email}</td>
                <td class="px-6 py-4">${user.roles.join(', ')}</td>
                <td class="px-6 py-4 text-right">
                    <button class="text-blue-600 hover:text-blue-900 mr-3" data-accion="editar" data-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900" data-accion="eliminar" data-id="${user.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Configurar eventos para los botones de acción
    document.querySelectorAll('[data-accion="editar"]').forEach(btn => {
        btn.addEventListener('click', () => editarUsuario(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('[data-accion="eliminar"]').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarUsuario(parseInt(btn.dataset.id)));
    });
}

// Función para configurar eventos de los modales
function configurarEventosModales() {
    // Modal de nuevo usuario
    const btnNuevoUsuario = document.getElementById('btn-nuevo-usuario');
    const modalUsuario = document.getElementById('modal-usuario');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formUsuario = document.getElementById('form-usuario');
    
    btnNuevoUsuario.addEventListener('click', () => {
        document.getElementById('modal-titulo').textContent = 'Nuevo Usuario';
        document.getElementById('usuario-id').value = '';
        document.getElementById('usuario-nombre').value = '';
        document.getElementById('usuario-apellido').value = '';
        document.getElementById('usuario-email').value = '';
        document.getElementById('usuario-password').value = '';
        document.getElementById('usuario-roles').value = 'ROLE_USER';
        usuarioActual = null;
        modalUsuario.classList.remove('hidden');
    });
    
    btnCancelar.addEventListener('click', () => {
        modalUsuario.classList.add('hidden');
    });
    
    formUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarUsuario();
    });
    
    // Modal de confirmación para eliminar
    const modalConfirmar = document.getElementById('modal-confirmar');
    const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    
    btnCancelarEliminar.addEventListener('click', () => {
        modalConfirmar.classList.add('hidden');
    });
    
    btnConfirmarEliminar.addEventListener('click', () => {
        eliminarUsuario();
    });
}

// Función para editar un usuario
function editarUsuario(id) {
    const user = usuarios.find(u => u.id === id);
    if (!user) return;
    
    usuarioActual = user;
    
    document.getElementById('modal-titulo').textContent = 'Editar Usuario';
    document.getElementById('usuario-id').value = user.id;
    document.getElementById('usuario-nombre').value = user.nombre || '';
    document.getElementById('usuario-apellido').value = user.apellido || '';
    document.getElementById('usuario-email').value = user.email;
    document.getElementById('usuario-password').value = '';
    document.getElementById('usuario-roles').value = user.roles.join(',');
    
    document.getElementById('modal-usuario').classList.remove('hidden');
}

// Función para confirmar la eliminación de un usuario
function confirmarEliminarUsuario(id) {
    usuarioActual = usuarios.find(u => u.id === id);
    if (!usuarioActual) return;
    
    document.getElementById('modal-confirmar').classList.remove('hidden');
}

// Función para guardar un usuario (nuevo o editado)
function guardarUsuario() {
    const id = document.getElementById('usuario-id').value;
    const nombre = document.getElementById('usuario-nombre').value;
    const apellido = document.getElementById('usuario-apellido').value;
    const email = document.getElementById('usuario-email').value;
    const password = document.getElementById('usuario-password').value;
    const roles = document.getElementById('usuario-roles').value.split(',').map(r => r.trim());
    
    let datos;
    if (!id) {
        // Nuevo usuario: password es obligatorio
        if (!password) {
            alert('La contraseña es obligatoria para nuevos usuarios.');
            return;
        }
        datos = { email, roles, nombre, apellido, password };
    } else {
        // Edición: password solo si se proporciona
        datos = { email, roles, nombre, apellido };
        if (password) datos.password = password;
    }
    
    const url = id 
        ? `${BACKEND_URL}/api/users/${id}/edit` // Editar
        : `${BACKEND_URL}/api/users`; // Nuevo - ahora usa el mismo patrón que ciclos.js
    
    const method = id ? 'PUT' : 'POST';
    
    console.log('Enviando solicitud a:', url);
    console.log('Datos:', id ? datos : { ...datos, password: '***' });
    
    fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(id ? datos : { ...datos, password })
    })
    .then(response => {
        // Verificar si la respuesta es JSON antes de intentar analizarla
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
                }).catch(e => {
                    // Si falla el parsing JSON del error, lanzar el error original
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                });
            }
            return response.json();
        } else {
            // Si no es JSON, manejar como texto
            return response.text().then(text => {
                console.error('Respuesta no-JSON recibida:', text);
                throw new Error(`La respuesta no es JSON. Status: ${response.status}`);
            });
        }
    })
    .then(data => {
        console.log('Respuesta al guardar usuario:', data);
        document.getElementById('modal-usuario').classList.add('hidden');
        cargarUsuarios(); // Recargar la lista de usuarios
    })
    .catch(error => {
        console.error('Error al guardar usuario:', error);
        // Mostrar el mensaje de error específico
        alert(error.message || 'Error al guardar el usuario. Por favor, intenta de nuevo.');
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt');
            window.location.href = '/login.html';
        }
    });
}

// Función para eliminar un usuario
function eliminarUsuario() {
    if (!usuarioActual) return;
    
    fetch(`${BACKEND_URL}/api/users/${usuarioActual.id}/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        // Verificar si la respuesta es JSON antes de intentar analizarla
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
                }).catch(e => {
                    // Si falla el parsing JSON del error, lanzar el error original
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                });
            }
            return response.json();
        } else {
            // Si no es JSON, manejar como texto
            return response.text().then(text => {
                console.error('Respuesta no-JSON recibida:', text);
                throw new Error(`La respuesta no es JSON. Status: ${response.status}`);
            });
        }
    })
    .then(data => {
        document.getElementById('modal-confirmar').classList.add('hidden');
        cargarUsuarios(); // Recargar la lista de usuarios
        usuarioActual = null;
    })
    .catch(error => {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario. Por favor, intenta de nuevo: ' + error.message);
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt');
            window.location.href = '/login.html';
        }
    });
}

