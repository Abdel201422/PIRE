// js/api/getExplorarCiclos.js

import { BACKEND_URL } from '../config.js'

const token = localStorage.getItem('jwt')

if (!token) {
    window.location.href = '/login.html'
}

document.addEventListener('DOMContentLoaded', function () {

    const tabsContainer = document.getElementById('tabsContainer')
    const explorarCiclos = document.getElementById('explorarCiclos')

    if (!explorarCiclos || !tabsContainer) return

    const leftArrow = document.getElementById('leftArrow')
    const rightArrow = document.getElementById('rightArrow')

    if (leftArrow && rightArrow && tabsContainer) {

        function updateArrows() {
        if (tabsContainer.scrollLeft > 0) {
            leftArrow.classList.remove('hidden')
        } else {
            leftArrow.classList.add('hidden')
        }

        if (tabsContainer.scrollLeft + tabsContainer.clientWidth < tabsContainer.scrollWidth - 1) {
            rightArrow.classList.remove('hidden')
        } else {
            rightArrow.classList.add('hidden')
        }
    }

    tabsContainer.addEventListener('scroll', updateArrows)

    leftArrow.addEventListener('click', () => {
        tabsContainer.scrollBy({ left: -150, behavior: 'smooth' })
    })

    rightArrow.addEventListener('click', () => {
        tabsContainer.scrollBy({ left: 150, behavior: 'smooth' })
    })
    }

    fetch(`${BACKEND_URL}/api/ciclos/completos`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    })
        .then(res => res.json())
        .then(data => {

            // Crear botón "Todos los ciclos"
            const btnTodos = document.createElement('button')
            btnTodos.textContent = 'Todos los ciclos'
            btnTodos.dataset.ciclo = 'todos'
            btnTodos.className = 'flex-none snap-start tab-button border-b-2 border-pire-green pl-4 pr-4 font-semibold'
            tabsContainer.appendChild(btnTodos)

            data.forEach(ciclos => {

                // Crear botón para cada ciclo
                const btnCiclo = document.createElement('button')
                btnCiclo.textContent = ciclos.nombre
                btnCiclo.dataset.ciclo = ciclos.nombre
                btnCiclo.className = 'flex-none tab-button pl-4 pr-4 snap-start'
                tabsContainer.appendChild(btnCiclo)

                const ciclo = document.createElement('div')
                ciclo.dataset.ciclo = ciclos.nombre
                ciclo.classList.add('flex', 'flex-col', 'gap-4', 'bg-white', 'rounded-3xl', 'border-2', 'p-6', 'border-gray-300', 'ciclo-card')

                ciclo.innerHTML = `
                    <!-- Card de ciclo -->
                    <h2 class="text-2xl font-semibold">${ciclos.nombre}</h2>`

                // Contenedor de asignaturas
                const asignaturasWrapper = document.createElement('div')
                asignaturasWrapper.classList.add('inline-flex', 'flex-row', 'flex-wrap', 'gap-4')

                ciclos.cursos.forEach(cursos => {

                    cursos.asignaturas.forEach(asignatura => {

                        const partes = asignatura.curso.split(' ')
                        const cursoCorto = `${partes[0]} ${partes[1]}` // "1º Curso" o "2º Curso"

                        const asignaturaDiv = document.createElement('div')
                        asignaturaDiv.classList.add('flex', 'w-full', 'sm:w-max', 'items-center', 'border-2', 'border-gray-300', 'rounded-full', 'p-2', 'pr-4', 'hover:bg-green-100', 'hover:border-pire-green', 'transition-all', 'duration-200', 'cursor-pointer')

                        asignaturaDiv.innerHTML = `
                        <a href="/asignatura?codigo=${asignatura.codigo}" class="flex items-center">
                                    <div class="bg-pire-green p-3 rounded-full mr-3">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.05 6.9L10.45 7.35L11.05 6.9ZM9.7 5.1L9.1 5.55L10.45 7.35L11.05 6.9L11.65 6.45L10.3 4.65L9.7 5.1ZM12.25 7.5V8.25H19.75V7.5V6.75H12.25V7.5ZM21.25 9H20.5V18H21.25H22V9H21.25ZM19.75 19.5V18.75H4.25V19.5V20.25H19.75V19.5ZM2.75 18H3.5V6H2.75H2V18H2.75ZM4.25 4.5V5.25H8.5V4.5V3.75H4.25V4.5ZM2.75 6H3.5C3.5 5.58579 3.83579 5.25 4.25 5.25V4.5V3.75C3.00736 3.75 2 4.75736 2 6H2.75ZM4.25 19.5V18.75C3.83579 18.75 3.5 18.4142 3.5 18H2.75H2C2 19.2426 3.00736 20.25 4.25 20.25V19.5ZM21.25 18H20.5C20.5 18.4142 20.1642 18.75 19.75 18.75V19.5V20.25C20.9926 20.25 22 19.2426 22 18H21.25ZM19.75 7.5V8.25C20.1642 8.25 20.5 8.58579 20.5 9H21.25H22C22 7.75736 20.9926 6.75 19.75 6.75V7.5ZM11.05 6.9L10.45 7.35C10.8749 7.91656 11.5418 8.25 12.25 8.25V7.5V6.75C12.0139 6.75 11.7916 6.63885 11.65 6.45L11.05 6.9ZM9.7 5.1L10.3 4.65C9.87508 4.08344 9.2082 3.75 8.5 3.75V4.5V5.25C8.73607 5.25 8.95836 5.36115 9.1 5.55L9.7 5.1Z" fill="#1C1C1C"></path>
                                        </svg>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-base break-words whitespace-normal">${asignatura.nombre}</span>
                                        <span class="text-sm text-gray-400">${cursoCorto}</span>
                                    </div></a>`

                        //console.log('Código de la asignatura:', asignatura.codigo)


                        asignaturasWrapper.appendChild(asignaturaDiv)
                    })
                })

                ciclo.appendChild(asignaturasWrapper)
                explorarCiclos.appendChild(ciclo)
            })

            // Evento de filtrado
            const tabButtons = document.querySelectorAll('.tab-button')
            const cards = document.querySelectorAll('.ciclo-card')

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('font-semibold', 'border-b-2', 'border-pire-green'))
                    button.classList.add('border-b-2', 'border-pire-green', 'font-semibold')

                    const filtro = button.dataset.ciclo
                    cards.forEach(card => {
                        if (filtro === 'todos' || card.dataset.ciclo === filtro) {
                            card.classList.remove('hidden')
                        } else {
                            card.classList.add('hidden')
                        }
                    })
                })
            })

            updateArrows()

        })
        .catch(error => {
            console.error('Error al cargar los ciclos:', error)
        })
})