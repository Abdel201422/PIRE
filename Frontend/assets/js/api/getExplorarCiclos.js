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

    function updateArrows() {
        if (tabsContainer.scrollLeft > 0) {
            leftArrow?.classList.remove('hidden')
        } else {
            leftArrow?.classList.add('hidden')
        }

        if (tabsContainer.scrollLeft + tabsContainer.clientWidth < tabsContainer.scrollWidth - 1) {
            rightArrow?.classList.remove('hidden')
        } else {
            rightArrow?.classList.add('hidden')
        }
    }

    tabsContainer.addEventListener('scroll', updateArrows)

    leftArrow?.addEventListener('click', () => {
        tabsContainer.scrollBy({ left: -150, behavior: 'smooth' })
    })

    rightArrow?.addEventListener('click', () => {
        tabsContainer.scrollBy({ left: 150, behavior: 'smooth' })
    })

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
                const btnCiclo = document.createElement('button')
                btnCiclo.textContent = ciclos.nombre
                btnCiclo.dataset.ciclo = ciclos.nombre
                btnCiclo.className = 'flex-none tab-button pl-4 pr-4 snap-start'
                tabsContainer.appendChild(btnCiclo)

                const ciclo = document.createElement('div')
                ciclo.dataset.ciclo = ciclos.nombre
                ciclo.classList.add('flex', 'flex-col', 'gap-4', 'bg-white', 'rounded-3xl', 'border-2', 'p-6', 'border-gray-300', 'ciclo-card')

                ciclo.innerHTML = `
                    <h2 class="text-2xl font-semibold">${ciclos.nombre}</h2>`

                const asignaturasWrapper = document.createElement('div')
                asignaturasWrapper.classList.add('inline-flex', 'flex-row', 'flex-wrap', 'gap-4')

                ciclos.cursos.forEach(cursos => {
                    cursos.asignaturas.forEach(asignatura => {
                        const partes = asignatura.curso.split(' ')
                        const cursoCorto = `${partes[0]} ${partes[1]}`

                        const asignaturaDiv = document.createElement('div')
                        asignaturaDiv.classList.add('flex', 'w-full', 'sm:w-max', 'items-center', 'border-2', 'border-gray-300', 'rounded-full', 'p-2', 'pr-4', 'hover:bg-green-100', 'hover:border-pire-green', 'transition-all', 'duration-200', 'cursor-pointer')

                        asignaturaDiv.innerHTML = `
                        <a href="/asignatura?codigo=${asignatura.codigo}" class="flex items-center">
                            <div class="bg-pire-green p-3 rounded-full mr-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="..." fill="#1C1C1C"></path>
                                </svg>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-base break-words whitespace-normal">${asignatura.nombre}</span>
                                <span class="text-sm text-gray-400">${cursoCorto}</span>
                            </div>
                        </a>`

                        asignaturasWrapper.appendChild(asignaturaDiv)
                    })
                })

                ciclo.appendChild(asignaturasWrapper)
                explorarCiclos.appendChild(ciclo)
            })

            // Filtrado
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

            // Asegurar que los arrows se actualicen correctamente después de renderizar todo
            setTimeout(updateArrows, 0)
        })
        .catch(error => {
            console.error('Error al cargar los ciclos:', error)
        })
})
