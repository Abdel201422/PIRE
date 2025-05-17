// js/search.js
import { BACKEND_URL } from '../config.js';

const token = localStorage.getItem('jwt')

if (!token) {
    window.location.href = '/login.html'
}

export function searchAll() {
    const inputSearch = document.getElementById('input-busqueda')
    
    inputSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {

            const query = e.target.value.trim()
            if (query.length > 0) {
                // Redirige a la página de resultados de búsqueda con el término como parámetro
                window.location.href = `/search.html?query=${encodeURIComponent(query)}`
            }
        }
    })
}

export function searchDocument() {

    const params = new URLSearchParams(window.location.search);
const query = params.get('query');

if (query) {
    const inputSearch = document.getElementById('input-busqueda')

    if (inputSearch) {
        inputSearch.value = query
    }
    
    fetch(`${BACKEND_URL}/api/documentos/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar los documentos.')
            }

            return response.json()
        })
        .then(data => mostrarResultados(data.documentos))
}

// Renderiza los resultados en la página
function mostrarResultados(documentos) {

    const documentosContainer = document.getElementById('documentosContainer')
    console.log(documentos)
    documentos.forEach(documento => {

                const docDiv = document.createElement('div')
                docDiv.classList.add('flex', 'flex-row', 'gap-6', 'p-6', 'border-2', 'border-gray-300', 'rounded-3xl', 'cursor-pointer', 'hover:bg-green-100', 'hover:border-pire-green', 'transition-all', 'duration-200')

                let icono = ''

                if (documento.tipo_archivo === 'application/pdf') {
                    icono = `<div class="w-32 h-32 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" style="background-color: #F87171;">PDF</div>`
                } else if (documento.tipo_archivo.startsWith('image/')) {
                    icono = `<div class="w-32 h-32 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" style="background-color:rgb(192, 113, 248);">IMAGEN</div>`
                } else {
                    icono = `<div class="w-32 h-32 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" style="background-color: #9CA3AF;">ARCHIVO</div>`
                }

                docDiv.innerHTML = `${icono}
                <div class="flex flex-col justify-between w-full">
                    <div class="flex flex-col gap-2">
                        <h3 class="text-xl font-bold truncate">${documento.nombre}</h3>
                        <p class="text-base text-gray-500 truncate">${documento.descripcion}</p>
                    </div>
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row gap-2 items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2V4" stroke="#4A4A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 2V4" stroke="#4A4A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 8H21" stroke="#4A4A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 7.99998V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V7.99998M21 7.99998V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V7.99998" stroke="#4A4A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p class="text-sm text-[#4A4A4A]">${documento.fecha_subida}</p>
                        </div>
                        <div class="flex items-center justify-end">
                                
                                <span
                                    class="bg-[var(--color-orange-100)] px-4 py-2 rounded-full flex items-center gap-2">
                                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.50516 0.25C9.79025 0.250313 10.0508 0.412325 10.177 0.667969L12.6018 5.58105L18.0247 6.36914C18.3069 6.41044 18.542 6.60862 18.6302 6.87988C18.7072 7.11731 18.6597 7.37518 18.51 7.56934L18.4397 7.64844L14.5159 11.4727L15.4427 16.873C15.4909 17.1543 15.3746 17.4386 15.1438 17.6064C14.9131 17.774 14.6073 17.7965 14.3548 17.6641L9.50418 15.1133L4.65458 17.6641C4.40207 17.7966 4.0963 17.774 3.86551 17.6064C3.63455 17.4386 3.51843 17.1544 3.56668 16.873L4.49247 11.4727L0.569615 7.64844C0.365202 7.44918 0.291971 7.15138 0.380161 6.87988C0.468444 6.6085 0.703203 6.41018 0.98563 6.36914L6.40653 5.58105L8.83231 0.667969L8.88602 0.576172C9.02453 0.374098 9.25568 0.25 9.50516 0.25Z"
                                            fill="#FFA53C" />
                                    </svg>
                                    <span class="font-medium">${documento.puntuacion}</span>
                                </span>
                                </div>
                            </div>
                    </div>
                </div>
                </div>`

                // Evento para redirigir a la página de visualización
                docDiv.addEventListener('click', () => {
                    window.location.href = `/documento.html?id=${documento.id}`
                })

                documentosContainer.append(docDiv)
            })
}
}