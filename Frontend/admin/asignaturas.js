import { BACKEND_URL } from '/assets/js/config.js'

// Verificar autenticación
const token = localStorage.getItem('jwt')
if (!token) {
    window.location.href = '/login.html'
}

// Variables globales
let asignaturas = []
let cursos = []
let asignaturaActual = null

// Cargar componentes dinámicamente
import { infoUser } from '/assets/js/api/dataDashboard.js'
document.addEventListener('DOMContentLoaded', () => {
    infoUser()
    // Cargar datos de asignaturas y cursos
    cargarAsignaturas()
    cargarCursos()

    // Configurar eventos de los modales
    configurarEventosModales()
    
    // Configurar evento de búsqueda
    configurarBusqueda()
})

// Función para configurar la búsqueda
function configurarBusqueda() {
    const inputBusqueda = document.getElementById('busqueda-asignaturas')
    
    inputBusqueda.addEventListener('input', () => {
        filtrarAsignaturas(inputBusqueda.value.toLowerCase())
    })
}

// Función para filtrar asignaturas según el texto de búsqueda
function filtrarAsignaturas(textoBusqueda) {
    if (!Array.isArray(asignaturas) || asignaturas.length === 0) return
    
    // Si no hay texto de búsqueda, mostrar todas las asignaturas
    if (!textoBusqueda.trim()) {
        renderizarTablaAsignaturas(asignaturas)
        return
    }
    
    // Filtrar las asignaturas que coinciden con el texto de búsqueda
    const asignaturasFiltradas = asignaturas.filter(asignatura => {
        if (!asignatura) return false
        
        const codigo = (asignatura.codigo || '').toLowerCase()
        const nombre = (asignatura.nombre || '').toLowerCase()
        let cursoNombre = ''
        
        try {
            if (asignatura.curso && asignatura.curso.nombre) {
                cursoNombre = asignatura.curso.nombre.toLowerCase()
            }
        } catch (error) {
            console.error('Error al acceder al nombre del curso para filtrar:', error)
        }
        
        return codigo.includes(textoBusqueda) || 
               nombre.includes(textoBusqueda) || 
               cursoNombre.includes(textoBusqueda)
    })
    
    renderizarTablaAsignaturas(asignaturasFiltradas)
}

// Función para cargar las asignaturas desde la API
function cargarAsignaturas() {
    //console.log('Cargando asignaturas desde:', `${BACKEND_URL}/api/asignaturas`)
    fetch(`${BACKEND_URL}/api/asignaturas`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => {
        //console.log('Respuesta API asignaturas:', response.status, response.statusText)
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        return response.json()
    })
    .then(data => {
        //console.log('Datos de asignaturas recibidos:', data)
        asignaturas = data
        renderizarTablaAsignaturas(asignaturas)
    })
    .catch(error => {
        console.error('Error al cargar asignaturas:', error)
        document.getElementById('tabla-asignaturas').innerHTML = `
            <tr>
                <td colspan="5" class="px-3 py-4 text-center text-red-500">
                    Error al cargar las asignaturas: ${error.message}. Por favor, intenta de nuevo.
                </td>
            </tr>
        `
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt')
            window.location.href = '/login.html'
        }
    })
}

// Función para cargar los cursos desde la API
function cargarCursos() {
    fetch(`${BACKEND_URL}/api/ciclos/completos`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        return response.json()
    })
    .then(data => {
        const selectCurso = document.getElementById('curso')
        let optionsHtml = '<option value="">Selecciona un curso</option>'
        
        // Iterar sobre los ciclos y sus cursos
        data.forEach(ciclo => {
            if (ciclo.cursos && ciclo.cursos.length > 0) {
                optionsHtml += `<optgroup label="${ciclo.nombre}">`
                ciclo.cursos.forEach(curso => {
                    cursos.push(curso)
                    optionsHtml += `<option value="${curso.cod_curso}">${curso.nombre}</option>`
                })
                optionsHtml += '</optgroup>'
            }
        })
        
        selectCurso.innerHTML = optionsHtml
    })
    .catch(error => {
        console.error('Error al cargar cursos:', error)
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt')
            window.location.href = '/login.html'
        }
    })
}

// Función para renderizar la tabla de asignaturas
function renderizarTablaAsignaturas(asignaturas) {
    const tablaAsignaturas = document.getElementById('tabla-asignaturas')
    
    if (!Array.isArray(asignaturas) || asignaturas.length === 0) {
        tablaAsignaturas.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    No hay asignaturas disponibles.
                </td>
            </tr>
        `
        return
    }
    
    let html = ''
    asignaturas.forEach(asignatura => {
        if (!asignatura) return // Saltar elementos nulos o indefinidos
        
        // Extraer valores de manera segura
        const codigo = asignatura.codigo || 'N/A'
        const nombre = asignatura.nombre || 'Sin nombre'
        
        let nombreCurso = 'No asignado'
        try {
            if (asignatura.curso && asignatura.curso.nombre) {
                nombreCurso = asignatura.curso.nombre
            }
        } catch (error) {
            console.error('Error al acceder al nombre del curso:', error)
        }
        
        // Obtener el número de documentos
        let documentosCount = 0
        try {
            if (asignatura.documentos_count !== undefined) {
                documentosCount = asignatura.documentos_count
            }
        } catch (error) {
            console.error('Error al acceder al contador de documentos:', error)
        }

        html += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${codigo}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${nombre}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${nombreCurso}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${documentosCount} ${documentosCount === 1 ? 'documento' : 'documentos'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3" data-accion="editar" data-id="${codigo}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900" data-accion="eliminar" data-id="${codigo}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `
    })
    
    tablaAsignaturas.innerHTML = html
    
    // Configurar eventos para los botones de acción
    document.querySelectorAll('[data-accion="editar"]').forEach(btn => {
        btn.addEventListener('click', () => editarAsignatura(btn.dataset.id))
    })
    
    document.querySelectorAll('[data-accion="eliminar"]').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarAsignatura(btn.dataset.id))
    })
}

// Función para configurar eventos de los modales
function configurarEventosModales() {
    // Modal de nueva asignatura
    const btnNuevaAsignatura = document.getElementById('btn-nueva-asignatura')
    const modalAsignatura = document.getElementById('modal-asignatura')
    const btnCancelar = document.getElementById('btn-cancelar')
    const formAsignatura = document.getElementById('form-asignatura')
    
    btnNuevaAsignatura.addEventListener('click', () => {
        document.getElementById('modal-titulo').textContent = 'Nueva Asignatura'
        formAsignatura.reset()
        document.getElementById('codigo').disabled = false // Permitir editar el código para nuevas asignaturas
        asignaturaActual = null
        modalAsignatura.classList.remove('hidden')
    })
    
    btnCancelar.addEventListener('click', () => {
        modalAsignatura.classList.add('hidden')
    })
    
    formAsignatura.addEventListener('submit', (e) => {
        e.preventDefault()
        guardarAsignatura()
    })
    
    // Modal de confirmación para eliminar
    const modalConfirmar = document.getElementById('modal-confirmar')
    const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar')
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar')
    
    btnCancelarEliminar.addEventListener('click', () => {
        modalConfirmar.classList.add('hidden')
    })
    
    btnConfirmarEliminar.addEventListener('click', () => {
        eliminarAsignatura()
    })
}

// Función para editar una asignatura
function editarAsignatura(codigo) {
    const asignatura = asignaturas.find(a => a.codigo === codigo)
    if (!asignatura) return
    
    asignaturaActual = asignatura
    
    document.getElementById('modal-titulo').textContent = 'Editar Asignatura'
    document.getElementById('codigo').value = asignatura.codigo
    document.getElementById('codigo').disabled = true // No permitir cambiar el código
    document.getElementById('nombre').value = asignatura.nombre
    document.getElementById('curso').value = asignatura.curso.cod_curso
    
    document.getElementById('modal-asignatura').classList.remove('hidden')
}

// Función para confirmar la eliminación de una asignatura
function confirmarEliminarAsignatura(codigo) {
    asignaturaActual = asignaturas.find(a => a.codigo === codigo)
    if (!asignaturaActual) return
    
    document.getElementById('modal-confirmar').classList.remove('hidden')
}

// Función para guardar una asignatura (nueva o editada)
function guardarAsignatura() {
    const codigo = document.getElementById('codigo').value
    const nombre = document.getElementById('nombre').value
    const cursoId = document.getElementById('curso').value
    
    if (!cursoId) {
        alert('Por favor, selecciona un curso para la asignatura.')
        return
    }
    
    const asignaturaData = {
        codigo: codigo,
        nombre: nombre,
        curso_id: cursoId
    }
    
    const url = asignaturaActual 
        ? `${BACKEND_URL}/api/asignaturas/${asignaturaActual.codigo}` // Editar
        : `${BACKEND_URL}/api/asignaturas` // Nueva
    
    const method = asignaturaActual ? 'PUT' : 'POST'
    
    fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(asignaturaData)
    })
    .then(response => {
        if (!response.ok) {
            // Capturar la respuesta de error para leer el mensaje
            return response.json().then(errorData => {
                throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
            })
        }
        return response.json()
    })
    .then(data => {
        document.getElementById('modal-asignatura').classList.add('hidden')
        cargarAsignaturas() // Recargar la lista de asignaturas
    })
    .catch(error => {
        console.error('Error al guardar asignatura:', error)
        // Mostrar el mensaje de error específico
        alert(error.message || 'Error al guardar la asignatura. Por favor, intenta de nuevo.')
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt')
            window.location.href = '/login.html'
        }
    })
}

// Función para eliminar una asignatura
function eliminarAsignatura() {
    if (!asignaturaActual) return
    
    fetch(`${BACKEND_URL}/api/asignaturas/${asignaturaActual.codigo}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        return response.json()
    })
    .then(data => {
        document.getElementById('modal-confirmar').classList.add('hidden')
        cargarAsignaturas() // Recargar la lista de asignaturas
    })
    .catch(error => {
        console.error('Error al eliminar asignatura:', error)
        alert('Error al eliminar la asignatura. Por favor, intenta de nuevo.')
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt')
            window.location.href = '/login.html'
        }
    })
}