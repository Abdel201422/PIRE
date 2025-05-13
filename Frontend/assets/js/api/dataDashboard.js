import { BACKEND_URL } from '../config.js'
import { setupLogout } from './auth.js'

setupLogout()

export function infoUser() {

    const token = localStorage.getItem('jwt')

    // Si no hay token, volvemos al login
    if (!token) {
        window.location.href = '/login.html'
    } else {
        // Cargar datos del usuario
        fetch(`${BACKEND_URL}/api/dashboard`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener la información del usuario')
                }

                return response.json()
            })
            .then(data => {
                console.log(data)
                const ui = document.getElementById('userInfo')
                const userName = document.getElementById('userName')
                const userNameComplete = document.getElementById('userNameComplete')
                const userNumDocumentos = document.getElementById('userNumDocumentos')
                // Nuevos elementos para el header
                const dropdownUserName = document.getElementById('dropdown-userName')
                const dropdownUserEmail = document.getElementById('dropdown-userEmail')
                // const userAvatar = document.getElementById('user-avatar')
                //const userPuntuacion = document.getElementById('userPuntuacion')

                const userAvatar = document.getElementById('user-avatar')

                if (data.error) {
                    ui.innerHTML = `<p style="color: red">Error: ${data.error}</p>`
                } else {
                    
                    if (userName) userName.textContent = data.user.nombre
                    if (userNameComplete) userNameComplete.textContent = data.user.nombreCompleto
                    
                    if (dropdownUserName) dropdownUserName.textContent = data.user.nombreCompleto
                    if (dropdownUserEmail) dropdownUserEmail.textContent = data.user.email
                    
                    if (userNumDocumentos) userNumDocumentos.textContent = data.user.nDocumentos
                    /* if (userPuntuacion) {
                        userPuntuacion.textContent = data.user.puntuacion
                    } */

                    if (userAvatar) {
                        userAvatar.innerHTML = `<img src="${BACKEND_URL}/${data.user.avatar}" alt="Avatar">`
                    }
                }
            })
            .catch(err => {
                console.error('Error:', err)
                document.getElementById('userInfo').innerHTML =
                    `<p style="color: red">Error al cargar el dashboard.</p>`
            })
    }
}

// Cargar los mejores documentos
export function loadBestDocuments() {

    const token = localStorage.getItem('jwt')

    // Verificar si el contenedor de mejores documentos existe
    const mejoresDocumentos = document.getElementById('seccion-populares')
    if (!mejoresDocumentos) {
        console.warn('El contenedor de mejores documentos no existe en el DOM')
        // Si no existe, no ejecutamos la lógica
        return
    }

    fetch(`${BACKEND_URL}/api/documentos/mejores`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de los mejores documentos')
            }

            return response.json()
        })
        .then(data => {
            if (data.error) {
                mejoresDocumentos.innerHTML = `<p style="color: red">Error: ${data.error}</p>`
            } else {
                console.log(data)
                const gridRecursos = document.getElementById('grid-recursos')

                if (gridRecursos) {
                    gridRecursos.innerHTML = '' // Limpiar contenido previo

                    data.forEach(doc => {
                        console.log(doc)
                        const div = document.createElement('div')
                        div.innerHTML = `
                        <div class="bg-white rounded-xl p-5 border border-gray-300 hover:bg-green-100 hover:border-pire-green transition-all duration-200">
                            <div class="mb-2 text-xs text-green-600">${doc.asignatura}</div>
                            <h3 class="font-medium mb-2">${doc.titulo}</h3>
                            <div class="flex items-center justify-end mt-4">
                                <div class="bg-[#FFEACB] px-3 py-1 rounded-full flex items-center ">
                                    <span>${doc.puntuacion}</span>
                                </div>
                            </div>
                        </div>`

                        gridRecursos.appendChild(div)
                    })
                }
            }
        })
        .catch(err => {
            console.error('Error:', err)
            mejoresDocumentos.innerHTML =
                `<p style="color: red">Error al cargar los mejores documentos.</p>`
        })
}