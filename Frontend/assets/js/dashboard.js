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

    // MIS RECURSOS
    
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