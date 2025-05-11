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
                //const userPuntuacion = document.getElementById('userPuntuacion')
                if (data.error) {
                    ui.innerHTML = `<p style="color: red">Error: ${data.error}</p>`
                } else {
                    console.log(data)
                    if (userName) {
                        userName.textContent = data.user.nombre
                        userNameComplete.textContent = data.user.nombreCompleto
                    }
                    
                    if (userNumDocumentos) {
                        userNumDocumentos.textContent = data.user.nDocumentos
                    }

                    /* if (userPuntuacion) {
                        userPuntuacion.textContent = data.user.puntuacion
                    } */
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
                                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.50516 0.25C9.79025 0.250313 10.0508 0.412325 10.177 0.667969L12.6018 5.58105L18.0247 6.36914C18.3069 6.41044 18.542 6.60862 18.6302 6.87988C18.7072 7.11731 18.6597 7.37518 18.51 7.56934L18.4397 7.64844L14.5159 11.4727L15.4427 16.873C15.4909 17.1543 15.3746 17.4386 15.1438 17.6064C14.9131 17.774 14.6073 17.7965 14.3548 17.6641L9.50418 15.1133L4.65458 17.6641C4.40207 17.7966 4.0963 17.774 3.86551 17.6064C3.63455 17.4386 3.51843 17.1544 3.56668 16.873L4.49247 11.4727L0.569615 7.64844C0.365202 7.44918 0.291971 7.15138 0.380161 6.87988C0.468444 6.6085 0.703203 6.41018 0.98563 6.36914L6.40653 5.58105L8.83231 0.667969L8.88602 0.576172C9.02453 0.374098 9.25568 0.25 9.50516 0.25Z" fill="#FFA53C"/>
                                    </svg>
                                    <span>${doc.puntuacion}</span>
                                </div>
                            </div>
                        </div>`

                    gridRecursos.appendChild(div)
                })
            }
        })
        .catch(err => {
            console.error('Error:', err)
            mejoresDocumentos.innerHTML =
                `<p style="color: red">Error al cargar los mejores documentos.</p>`
        })
}