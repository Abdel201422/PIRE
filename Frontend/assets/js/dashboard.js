// js/dashboard.js
import { infoUser} from './api/dataDashboard.js';
import { loadBestDocuments } from './api/dataDashboard.js';

// Carga dinámica del componente header
document.addEventListener('DOMContentLoaded', () => {

    infoUser()
    loadBestDocuments()

    // Cargar dinámicamente el Header
    const headerContainer = document.getElementById('header_dashboard');
    if (headerContainer) {
        fetch('/components/header_dashboard.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;

                // Funcionalidad para alternar el menú desplegable del usuario
                const userAvatar = document.getElementById('user-avatar');
                const userInfo = document.getElementById('user-info');
                const dropdown = document.getElementById('user-dropdown');
                
                if (userAvatar && dropdown) {
                    userAvatar.addEventListener('click', function(e) {
                        e.stopPropagation();
                        dropdown.classList.toggle('hidden');
                    });
                    
                    // También permite hacer clic en toda el área de información del usuario
                    userInfo.addEventListener('click', function(e) {
                        e.stopPropagation();
                        dropdown.classList.toggle('hidden');
                    });
                    
                    // Manejar el botón de cierre de sesión
                    const logoutButton = document.getElementById('logout-button');
                    if (logoutButton) {
                        logoutButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            localStorage.removeItem('jwt');
                            window.location.href = '/';
                        });
                    }
                    
                    // Cierra el menú desplegable al hacer clic fuera de él
                    document.addEventListener('click', function() {
                        if (!dropdown.classList.contains('hidden')) {
                            dropdown.classList.add('hidden');
                        }
                    });
                    
                    // Evita que el menú desplegable se cierre al hacer clic dentro de él
                    dropdown.addEventListener('click', function(e) {
                        e.stopPropagation();
                    });
                }
            })
            .catch(error => console.error('Error al cargar el header:', error));
    }

    // Cargar dinámicamente el Sidebar
    const sidebarContainer = document.getElementById('sidebar');
    if (sidebarContainer) {
        fetch('/components/sidebar.html')
            .then(response => response.text())
            .then(html => {
                sidebarContainer.innerHTML = html;

                // 💡 En este punto el elemento ya existe en el DOM
                const logoutLink = document.getElementById('logoutLink');
                if (logoutLink) {
                    logoutLink.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.removeItem('jwt');
                        window.location.href = '/';
                    });
                }

                // Asignar el evento de clic al enlace "Mis Recursos"
                const enlaceMisRecursos = document.getElementById('enlace-recursos');
                if (enlaceMisRecursos) {
                    enlaceMisRecursos.addEventListener('click', function (e) {
                        e.preventDefault(); // Evita el comportamiento predeterminado del enlace
                        cargarMisRecursos(); // Llama a la función para cargar los ciclos
                    });
                }
            })
            .catch(error => console.error('Error al cargar el sidebar:', error));
    }

    // Manejar la puntuación con estrellas
    document.querySelectorAll('.rating').forEach(rating => {
        rating.addEventListener('click', function (e) {
            if (e.target.classList.contains('star')) {
                const documentoId = this.closest('.documento').id.split('-')[1]; // Obtener el ID del documento
                const puntuacion = e.target.getAttribute('data-value'); // Obtener el valor de la estrella seleccionada

                // Marcar las estrellas seleccionadas
                this.querySelectorAll('.star').forEach(star => {
                    star.classList.remove('selected');
                });
                e.target.classList.add('selected');
                e.target.nextElementSibling?.classList.add('selected');
                e.target.previousElementSibling?.classList.add('selected');

                // Enviar la puntuación al backend
                puntuarDocumento(documentoId, puntuacion);
            }
        });
    });


    // MIS RECURSOS
    
    fetch('http://127.0.0.1:8000/api/documentos')
        .then(response => response.json())
        .then(data => {
            renderDocumentos(data);
        })
        .catch(err => {
            console.error('Error al cargar los documentos:', err);
        });

    const enlaceAdministrar = document.getElementById('enlace-administrar');

    // Verificar si el usuario es administrador
    fetch('/api/users/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(user => {
        // Check for 'roles' array (plural) instead of 'role'
        if (user.roles && user.roles.includes('ROLE_ADMIN')) {
            enlaceAdministrar.classList.remove('hidden');
        }
    })
    .catch(error => console.error('Error al verificar el rol del usuario:', error));
    

});

function cargarMisRecursos() {
    const mainContent = document.querySelector('main'); // Contenedor principal del dashboard
    mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Cargando recursos...</h2>';

    // Obtener los ciclos desde el backend
    fetch('http://127.0.0.1:8000/api/ciclos/completos')
        .then(response => response.json())
        .then(data => {
            mainContent.innerHTML = ''; // Limpia el contenido
            data.forEach(ciclo => {
                const cicloDiv = document.createElement('div');
                cicloDiv.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'mb-4');
                cicloDiv.innerHTML = `
                    <h3 class="text-lg font-semibold mb-2">${ciclo.nombre}</h3>
                    <p class="text-sm text-gray-600 mb-4">${ciclo.descripcion || ''}</p>
                    <button class="text-pire-green hover:text-pire-green-dark font-semibold" data-cod-ciclo="${ciclo.cod_ciclo}">
                        Ver asignaturas
                    </button>
                    <div id="asignaturas-${ciclo.cod_ciclo}" class="mt-4 hidden">
                        <!-- Aquí se cargarán las asignaturas -->
                    </div>
                `;

                mainContent.appendChild(cicloDiv);

                // Evento para cargar asignaturas al hacer clic en "Ver asignaturas"
                const verAsignaturasBtn = cicloDiv.querySelector('button');
                verAsignaturasBtn.addEventListener('click', function () {
                    const asignaturasContainer = document.getElementById(`asignaturas-${ciclo.cod_ciclo}`);
                    if (asignaturasContainer.classList.contains('hidden')) {
                        asignaturasContainer.classList.remove('hidden');
                        cargarAsignaturas(ciclo.cod_ciclo, asignaturasContainer);
                    } else {
                        asignaturasContainer.classList.add('hidden');
                    }
                });
            });
        })
        .catch(err => {
            console.error('Error al cargar los ciclos:', err);
            mainContent.innerHTML = '<p class="text-red-500">Error al cargar los recursos.</p>';
        });
}

function cargarAsignaturas(codCiclo, container) {
    container.innerHTML = '<p class="text-gray-500">Cargando asignaturas...</p>';

    fetch(`http://127.0.0.1:8000/api/ciclos/completos`)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = '';
            const ciclo = data.find(c => c.cod_ciclo === codCiclo);
            ciclo.cursos.forEach(curso => {
                const cursoDiv = document.createElement('div');
                cursoDiv.classList.add('mb-4');
                cursoDiv.innerHTML = `
                    <h4 class="text-md font-semibold mb-2">${curso.nombre}</h4>
                    <ul class="space-y-2">
                        ${curso.asignaturas.map(asignatura => `
                            <li class="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                <span>${asignatura.nombre} (${asignatura.curso})</span>
                            </li>
                        `).join('')}
                    </ul>
                `;
                container.appendChild(cursoDiv);
            });
        })
        .catch(err => {
            console.error('Error al cargar asignaturas:', err);
            container.innerHTML = '<p class="text-red-500">Error al cargar las asignaturas.</p>';
        });
}

function puntuarDocumento(documentoId, puntuacion) {
    const token = localStorage.getItem('jwt'); // Asegúrate de que el usuario esté autenticado

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
            alert(`Error: ${data.error}`);
        } else {
            alert('Puntuación registrada exitosamente.');
        }
    })
    .catch(err => {
        console.error('Error al puntuar el documento:', err);
    });
}

function renderDocumentos(documentos) {
    const container = document.getElementById('grid-recursos');
    container.innerHTML = ''; // Limpia el contenedor antes de agregar nuevos documentos

    documentos.forEach(documento => {
        const documentoDiv = document.createElement('div');
        documentoDiv.id = `documento-${documento.id}`;
        documentoDiv.classList.add('bg-white', 'rounded-xl', 'p-5', 'border', 'border-gray-300', 'hover:bg-green-100', 'hover:border-pire-green', 'transition-all', 'duration-200');
        documentoDiv.innerHTML = `
            <div class="mb-2 text-xs text-green-600">${documento.asignatura}</div>
            <h3 class="font-medium mb-2">${documento.titulo}</h3>
            <div class="flex items-center mt-4">
                <div class="rating flex">
                    <span class="star" data-value="5">&#9733;</span>
                    <span class="star" data-value="4">&#9733;</span>
                    <span class="star" data-value="3">&#9733;</span>
                    <span class="star" data-value="2">&#9733;</span>
                    <span class="star" data-value="1">&#9733;</span>
                </div>
                <span class="ml-2 text-sm font-medium">${documento.puntuacion || 'Sin puntuación'}</span>
            </div>
        `;
        container.appendChild(documentoDiv);
    });

    // Agregar funcionalidad para puntuar documentos
    document.querySelectorAll('.rating').forEach(rating => {
        rating.addEventListener('click', function (e) {
            if (e.target.classList.contains('star')) {
                const documentoId = this.closest('.bg-white').id.split('-')[1]; // Obtener el ID del documento
                const puntuacion = e.target.getAttribute('data-value'); // Obtener el valor de la estrella seleccionada

                // Marcar las estrellas seleccionadas
                this.querySelectorAll('.star').forEach(star => {
                    star.classList.remove('selected');
                });
                e.target.classList.add('selected');
                e.target.nextElementSibling?.classList.add('selected');
                e.target.previousElementSibling?.classList.add('selected');

                // Enviar la puntuación al backend
                puntuarDocumento(documentoId, puntuacion);
            }
        });
    });
}

function cargarAdministrar() {
    const mainContent = document.querySelector('main'); // Contenedor principal del dashboard
    mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Cargando opciones de administración...</h2>';

    // Opciones de administración
    const adminOptions = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-xl p-6 border border-gray-300 hover:bg-green-100 hover:border-pire-green transition-all duration-200">
                <h3 class="text-lg font-semibold mb-2">Usuarios</h3>
                <p class="text-sm text-gray-500 mb-4">Gestiona los usuarios del sistema.</p>
                <button id="admin-usuarios" class="text-pire-green font-semibold">Gestionar Usuarios</button>
            </div>
            <div class="bg-white rounded-xl p-6 border border-gray-300 hover:bg-green-100 hover:border-pire-green transition-all duration-200">
                <h3 class="text-lg font-semibold mb-2">Asignaturas</h3>
                <p class="text-sm text-gray-500 mb-4">Gestiona las asignaturas disponibles.</p>
                <button id="admin-asignaturas" class="text-pire-green font-semibold">Gestionar Asignaturas</button>
            </div>
            <div class="bg-white rounded-xl p-6 border border-gray-300 hover:bg-green-100 hover:border-pire-green transition-all duration-200">
                <h3 class="text-lg font-semibold mb-2">Ciclos</h3>
                <p class="text-sm text-gray-500 mb-4">Gestiona los ciclos formativos.</p>
                <button id="admin-ciclos" class="text-pire-green font-semibold">Gestionar Ciclos</button>
            </div>
        </div>
    `;

    mainContent.innerHTML = adminOptions;

    // Agregar eventos a los botones
    document.getElementById('admin-usuarios').addEventListener('click', cargarUsuarios);
    document.getElementById('admin-asignaturas').addEventListener('click', cargarAsignaturasPorNombre);
    document.getElementById('admin-ciclos').addEventListener('click', cargarCiclosPorNombre);
}

function cargarUsuarios() {
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Cargando usuarios...</h2>';

    fetch('/api/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
    })
        .then(response => response.json())
        .then(users => {
            mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Usuarios</h2>';
            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.classList.add('p-4', 'border', 'rounded-lg', 'shadow-md', 'mb-4');
                userDiv.innerHTML = `
                    <h3 class="text-lg font-bold">${user.nombre} (${user.email})</h3>
                    <p class="text-sm text-gray-500">Rol: ${user.role}</p>
                `;
                mainContent.appendChild(userDiv);
            });
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
            mainContent.innerHTML = '<p class="text-red-500">Error al cargar los usuarios.</p>';
        });
}

function cargarAsignaturasPorNombre() {
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Cargando asignaturas...</h2>';

    fetch('/api/asignaturas', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
    })
        .then(response => response.json())
        .then(asignaturas => {
            mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Asignaturas</h2>';
            asignaturas.forEach(asignatura => {
                const asignaturaDiv = document.createElement('div');
                asignaturaDiv.classList.add('p-4', 'border', 'rounded-lg', 'shadow-md', 'mb-4');
                asignaturaDiv.innerHTML = `
                    <h3 class="text-lg font-bold">${asignatura.nombre}</h3>
                    <p class="text-sm text-gray-500">Código: ${asignatura.codigo}</p>
                `;
                mainContent.appendChild(asignaturaDiv);
            });
        })
        .catch(error => {
            console.error('Error al cargar asignaturas:', error);
            mainContent.innerHTML = '<p class="text-red-500">Error al cargar las asignaturas.</p>';
        });
}

function cargarCiclosPorNombre() {
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Cargando ciclos...</h2>';

    fetch('/api/ciclos', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
    })
        .then(response => response.json())
        .then(ciclos => {
            mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Ciclos</h2>';
            ciclos.forEach(ciclo => {
                const cicloDiv = document.createElement('div');
                cicloDiv.classList.add('p-4', 'border', 'rounded-lg', 'shadow-md', 'mb-4');
                cicloDiv.innerHTML = `
                    <h3 class="text-lg font-bold">${ciclo.nombre}</h3>
                    <p class="text-sm text-gray-500">Código: ${ciclo.cod_ciclo}</p>
                `;
                mainContent.appendChild(cicloDiv);
            });
        })
        .catch(error => {
            console.error('Error al cargar ciclos:', error);
            mainContent.innerHTML = '<p class="text-red-500">Error al cargar los ciclos.</p>';
        });
}