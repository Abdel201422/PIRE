// js/api/getCiclosAll.js

import { BACKEND_URL } from '../config.js'

const token = localStorage.getItem('jwt')

if (!token) {
    window.location.href = '/login.html'
}

document.addEventListener('DOMContentLoaded', function () {
    
    // Verificar si el elemento cicloSelect existe antes de llamar a getCiclos
    const cicloSelect = document.getElementById('cicloSelect')
    if (cicloSelect) {
        getCiclos(token)
    }
})

// Verificar si cicloSelect existe antes de añadir el evento
const cicloSelect = document.getElementById('cicloSelect')
if (cicloSelect) {
    cicloSelect.addEventListener('change', function () {
        const codCiclo = this.value
        const token = localStorage.getItem('jwt')

        if (codCiclo) {
            getCursosPorCiclo(codCiclo, token)
        } else {
            // Limpia el select si no se ha elegido nada
            const cursoSelect = document.getElementById('cursoSelect')
            if (cursoSelect) {
                cursoSelect.innerHTML = '<option value="">Selecciona curso</option>'
            }

            const asignaturaSelect = document.getElementById('asignaturaSelect')
            if (asignaturaSelect) {
                asignaturaSelect.innerHTML = '<option value="">Selecciona asignatura</option>'
            }
        }
    })
}

// Verificar si cursoSelect existe antes de añadir el evento
const cursoSelect = document.getElementById('cursoSelect')
if (cursoSelect) {
    cursoSelect.addEventListener('change', function () {
        const codCurso = this.value
        const token = localStorage.getItem('jwt')

        if (codCurso) {
            getAsignaturasPorCurso(codCurso, token)
        } else {
            // Limpia el select si no se ha elegido nada
            const asignaturaSelect = document.getElementById('asignaturaSelect')
            if (asignaturaSelect) {
                asignaturaSelect.innerHTML = '<option value="">Selecciona asignatura</option>'
            }
        }
    })
}

// Obtener los ciclos
async function getCiclos(token) {

    try {
        const response = await fetch(`${BACKEND_URL}/api/ciclos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const ciclos = await response.json()
        
        const select = document.getElementById('cicloSelect')
        select.innerHTML = '<option value="">Selecciona ciclo</option>'
        ciclos.forEach(ciclo => {
            const option = document.createElement('option')
            option.value = ciclo.cod_ciclo
            option.textContent = `${ciclo.nombre}`
            select.appendChild(option)
        })

    } catch (error) {
        //console.error('Error al cargar ciclos:', error)

        if (error.message.includes('401')) {
            localStorage.removeItem('jwt')
            window.location.href = '/login.html'
        }
    }
}

// Obtener los cursos por ciclo
async function getCursosPorCiclo(codCiclo, token) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/ciclos/${codCiclo}/cursos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const cursos = await response.json()

        const cursoSelect = document.getElementById('cursoSelect')
        cursoSelect.innerHTML = '<option value="">Selecciona curso</option>'

        const asignaturaSelect = document.getElementById('asignaturaSelect')
        asignaturaSelect.innerHTML = '<option value="">Selecciona asignatura</option>'

        cursos.forEach(curso => {
            const option = document.createElement('option')
            option.value = curso.cod_curso
            option.textContent = curso.nombre
            cursoSelect.appendChild(option)
        })

    } catch (error) {
        //console.error('Error al cargar cursos:', error)

        if (error.message.includes('401')) {
            localStorage.removeItem('jwt')
            window.location.href = '/login.html'
        }
    }
}

// Obtener las asignaturas por curso
async function getAsignaturasPorCurso(codCurso, token) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/cursos/${codCurso}/asignaturas`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const asignaturas = await response.json()

        const asignaturaSelect = document.getElementById('asignaturaSelect')
        asignaturaSelect.innerHTML = '<option value="">Selecciona asignatura</option>'

        //console.log(asignaturas)
        asignaturas.forEach(asignatura => {
            const option = document.createElement('option')
            option.value = asignatura.codigo
            option.textContent = asignatura.nombre
            asignaturaSelect.appendChild(option)
        })

    } catch (error) {
        //console.error('Error al cargar asignaturas:', error)

        if (error.message.includes('401')) {
            localStorage.removeItem('jwt')
            window.location.href = '/login.html'
        }
    }
}