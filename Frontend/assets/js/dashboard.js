// js/dashboard.js
import { infoUser } from './api/dataDashboard.js'
import { loadBestDocuments } from './api/dataDashboard.js'
import { searchAll } from './api/search.js'
import { searchDocument } from './api/search.js'

// Carga dinámica del componente header
document.addEventListener('DOMContentLoaded', async () => {

    await Promise.all([
        cargarHeader(),
        cargarSidebar()
    ])

    loadBestDocuments()
})

async function cargarHeader() {
    // Cargar dinámicamente el Header
    const headerContainer = document.getElementById('header_dashboard')
    if (headerContainer) {
        fetch('/components/header_dashboard.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html
                infoUser()

                // Aquí asignamos el evento al botón del menú móvil, que está en header
                const mobileMenuButton = headerContainer.querySelector('#mobile-menu-button')
                if (mobileMenuButton) {
                    mobileMenuButton.addEventListener('click', () => {
                        // Como el panel lateral está en sidebar, disparamos un evento custom o hacemos algo diferente
                        // Lo mejor es guardar la referencia globalmente o manejar desde sidebar
                        // Aquí solo indicamos que el botón fue pulsado
                        document.dispatchEvent(new CustomEvent('toggleMobileMenu'))
                    })
                }

                // Funcionalidad para alternar el menú desplegable del usuario
                const userAvatar = document.getElementById('user-avatar')
                const userInfo = document.getElementById('user-info')
                const dropdown = document.getElementById('user-dropdown')

                if (userAvatar && dropdown) {
                    userAvatar.addEventListener('click', function (e) {
                        e.stopPropagation()
                        dropdown.classList.toggle('hidden')
                    })

                    // También permite hacer clic en toda el área de información del usuario
                    userInfo.addEventListener('click', function (e) {
                        e.stopPropagation()
                        dropdown.classList.toggle('hidden')
                    })

                    // Manejar el botón de editar perfil
                    const editarPerfilLink = document.getElementById('editar-perfil-link')
                    if (editarPerfilLink) {
                        editarPerfilLink.addEventListener('click', function (e) {
                            e.preventDefault()
                            window.location.href = '../configuracion_perfil.html'
                        })
                    }

                    // Manejar el botón de cierre de sesión
                    const logoutButton = document.getElementById('logout-button')
                    if (logoutButton) {
                        logoutButton.addEventListener('click', function (e) {
                            e.preventDefault()
                            localStorage.removeItem('jwt')
                            window.location.href = '/'
                        })
                    }

                    // Cierra el menú desplegable al hacer clic fuera de él
                    document.addEventListener('click', function () {
                        if (!dropdown.classList.contains('hidden')) {
                            dropdown.classList.add('hidden')
                        }
                    })

                    // Evita que el menú desplegable se cierre al hacer clic dentro de él
                    dropdown.addEventListener('click', function (e) {
                        e.stopPropagation()
                    })

                    searchAll()
                    searchDocument()
                }
            })
            .catch(error => console.error('Error al cargar el header:', error))
    }
}

async function cargarSidebar() {
    // Cargar dinámicamente el Sidebar
    const sidebarContainer = document.getElementById('sidebar')
    if (sidebarContainer) {
        fetch('/components/sidebar.html')
            .then(response => response.text())
            .then(html => {
                sidebarContainer.innerHTML = html
                infoUser()

                const logoutLink = document.getElementById('logoutLink')
                if (logoutLink) {
                    logoutLink.addEventListener('click', function (e) {
                        e.preventDefault()
                        localStorage.removeItem('jwt')
                        window.location.href = '/'
                    })
                }

                // Aquí el panel lateral y el overlay están en sidebar
                const panelLateral = sidebarContainer.querySelector('#panel-lateral')
                const mobileOverlay = sidebarContainer.querySelector('#mobile-overlay')

                // Escuchar el evento lanzado desde header para abrir/cerrar menú
                document.addEventListener('toggleMobileMenu', () => {
                    if (panelLateral.classList.contains('-translate-x-full')) {
                        panelLateral.classList.remove('-translate-x-full')
                        mobileOverlay.classList.remove('hidden')
                    } else {
                        mobileOverlay.classList.add('hidden')
                        panelLateral.classList.add('-translate-x-full')
                    }
                })

                mobileOverlay.addEventListener('click', () => {
                    panelLateral.classList.add('-translate-x-full')
                    mobileOverlay.classList.add('hidden')
                })


                const enlaceAdministrar = document.getElementById('admin-enlace')
                if (enlaceAdministrar) {
                    enlaceAdministrar.addEventListener('click', function (e) {
                        e.preventDefault()
                    })
                }
            })
            .catch(error => console.error('Error al cargar el sidebar:', error))
    }
}