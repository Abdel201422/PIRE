// js/dashboard.js

// Carga dinámica del componente header
document.addEventListener('DOMContentLoaded', () => {

    // Cargar dinámicamente el Header
    const headerContainer = document.getElementById('header_dashboard');
    if (headerContainer) {
        fetch('/components/header_dashboard.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;

                // Obtener datos del usuario para el header
                // const token = localStorage.getItem('jwt');
                // if (token) {
                //     fetch('http://127.0.0.1:8000/api/dashboard', {
                //         method: 'GET',
                //         headers: { 'Authorization': `Bearer ${token}` },
                //     })
                //     .then(response => response.json())
                //     .then(data => {
                //         if (!data.error && data.user) {
                //             const userNameComplete = document.getElementById('userNameComplete');
                //             const dropdownUserName = document.getElementById('dropdown-userName');
                //             const dropdownUserEmail = document.getElementById('dropdown-userEmail');
                //             if (userNameComplete) userNameComplete.textContent = data.user.nombre;
                //             if (dropdownUserName) dropdownUserName.textContent = data.user.nombre;
                //             if (dropdownUserEmail) dropdownUserEmail.textContent = data.user.email;
                //         }
                //     })
                //     .catch(err => console.error('No se pudo cargar el usuario en el header:', err));
                // }

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
            })
            .catch(error => console.error('Error al cargar el sidebar:', error));
    }
})