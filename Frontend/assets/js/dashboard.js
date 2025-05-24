// js/dashboard.js
import { infoUser } from './api/dataDashboard.js';
import { loadBestDocuments } from './api/dataDashboard.js';
import { searchAll } from './api/search.js'
import {searchDocument } from './api/search.js'
/* import { whoAdmin } from './api/dataDashboard.js'; */

// Carga dinámica del componente header
document.addEventListener('DOMContentLoaded', () => {
    
    loadBestDocuments()
    
    // Cargar dinámicamente el Header
    const headerContainer = document.getElementById('header_dashboard');
    if (headerContainer) {
        fetch('/components/header_dashboard.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;
            infoUser()

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
                    
                    // Manejar el botón de editar perfil
                    const editarPerfilLink = document.getElementById('editar-perfil-link');
                    if (editarPerfilLink) {
                        editarPerfilLink.addEventListener('click', function(e) {
                            e.preventDefault();
                            window.location.href = '../configuracion_perfil.html';
                        });
                    }
                    
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
                    
                    searchAll()
                    searchDocument()
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
                infoUser();
                
                const logoutLink = document.getElementById('logoutLink');
                if (logoutLink) {
                    logoutLink.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.removeItem('jwt');
                        window.location.href = '/';
                    });
                }

                
                const enlaceAdministrar = document.getElementById('admin-enlace');
                if (enlaceAdministrar) {
                    enlaceAdministrar.addEventListener('click', function(e) {
                        e.preventDefault();
                        //cargarAdminPanel();
                    });
                }

                const mobileMenuButton = document.getElementById('mobile-menu-button')
            const panelLateral = document.getElementById('panel-lateral')
            const mobileOverlay = document.getElementById('mobile-overlay')

            if (mobileMenuButton && panelLateral && mobileOverlay) {
                
                console.log('-------------------')
                mobileMenuButton.addEventListener('click', () => {
                
                    if (panelLateral.classList.contains('-translate-x-full')) {
                        panelLateral.classList.remove('-translate-x-full')
                        mobileOverlay.classList.remove('hidden')
                    }else {
                        mobileOverlay.classList.add('hidden')
                        panelLateral.classList.add('-translate-x-full')
                    }
                })

                mobileOverlay.addEventListener('click', () => {
                    panelLateral.classList.add('-translate-x-full')
                    mobileOverlay.classList.add('hidden')
                })
            } 
                
                /* // Asignar el evento de clic al enlace "Mis Recursos"
                const enlaceMisRecursos = document.getElementById('enlace-recursos');
                if (enlaceMisRecursos) {
                    enlaceMisRecursos.addEventListener('click', function (e) {
                        e.preventDefault(); // Evita el comportamiento predeterminado del enlace
                        cargarMisRecursos(); // Llama a la función para cargar los ciclos
                        });
                } */
                })
                .catch(error => console.error('Error al cargar el sidebar:', error));
            }

                
            })

            /* function cargarMisRecursos() {
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

    fetch(`${API_URL}/api/ciclos/completos`)
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
} */


// function cargarAdminPanel() {
//     const mainContent = document.querySelector('main');
//     mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Cargando administración...</h2>';
//     fetch('/admin/admin.html')
//         .then(res => res.text())
//         .then(html => {
//             // Extrae solo el contenido del <main> de admin.html
//             const tempDiv = document.createElement('div');
//             tempDiv.innerHTML = html;
//             const adminMain = tempDiv.querySelector('main');
//             if (adminMain) {
//                 mainContent.innerHTML = adminMain.innerHTML;

//                 // Listener para "Gestionar Usuarios"
//                 const enlaceUsuarios = mainContent.querySelector('#enlace-usuarios-admin');
//                 if (enlaceUsuarios) {
//                     enlaceUsuarios.addEventListener('click', function(e) {
//                         e.preventDefault();
//                         cargarUsuariosPanel();
//                     });
//                 }
//                 // Listener para "Gestionar Comentarios"
//                 const enlaceComentarios = mainContent.querySelector('#enlace-comentarios-admin');
//                 if (enlaceComentarios) {
//                      enlaceComentarios.addEventListener('click', function(e) {
//                         e.preventDefault();
//                         cargarComentariosPanel();
//                     });
//                 }
                
//             } else {
//                 mainContent.innerHTML = '<p class="text-red-500">No se pudo cargar el panel de administración.</p>';
//             }
//         });
// }

// function cargarUsuariosPanel() {
//     const mainContent = document.querySelector('main');
//     mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Cargando usuarios...</h2>';
//     fetch('/admin/usuarios.html')
//         .then(res => res.text())
//         .then(html => {
//             mainContent.innerHTML = html;
//             // Elimina scripts anteriores de usuarios.js
//             document.querySelectorAll('script[src="/admin/usuarios.js"]').forEach(s => s.remove());
//             // Cargar el JS de usuarios
//             const script = document.createElement('script');
//             script.src = '/admin/usuarios.js?v=' + Date.now(); // <-- fuerza recarga y evita caché
//             script.onload = () => {
//                 console.log('usuarios.js insertado y ejecutado');
//                 if (window.initUsuariosPanel) window.initUsuariosPanel();
//             };
//             script.onerror = () => console.error('Error al cargar usuarios.js');
//             document.body.appendChild(script);
//         });
// }

// function cargarComentariosPanel() {
//     const mainContent = document.querySelector('main');
//     mainContent.innerHTML = '<h2 class="text-xl font-semibold mb-4">Cargando comentarios...</h2>';
//     fetch('/admin/comentarios.html')
//         .then(res => res.text())
//         .then(html => {
//             mainContent.innerHTML = html;
//             // Elimina scripts anteriores de comentarios.js
//             document.querySelectorAll('script[src^="/admin/comentarios.js"]').forEach(s => s.remove());
//             // Cargar el JS de comentarios
//             const script = document.createElement('script');
//             script.src = '/admin/comentarios.js?v=' + Date.now();
//             script.onload = () => {
//                 if (window.initComentariosPanel) window.initComentariosPanel();
//             };
//             document.body.appendChild(script);
//         });
// }
