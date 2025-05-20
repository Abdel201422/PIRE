import { BACKEND_URL } from '/assets/js/config.js';

// Verificar autenticación
const token = localStorage.getItem('jwt');
if (!token) {
    window.location.href = '/login.html';
}

// Variables globales
let ciclos = [];
let cicloActual = null;

// Cargar componentes dinámicamente
import { infoUser } from '/assets/js/api/dataDashboard.js';
document.addEventListener('DOMContentLoaded', () => {
    infoUser();
    // Cargar datos de ciclos
    cargarCiclos();

    // Configurar eventos de los modales
    configurarEventosModales();
    
    // Configurar evento de búsqueda
    configurarBusqueda();
});

// Función para configurar la búsqueda
function configurarBusqueda() {
    const inputBusqueda = document.getElementById('busqueda-ciclos');
    
    inputBusqueda.addEventListener('input', () => {
        filtrarCiclos(inputBusqueda.value.toLowerCase());
    });
}

// Función para filtrar ciclos según el texto de búsqueda
function filtrarCiclos(textoBusqueda) {
    if (!Array.isArray(ciclos) || ciclos.length === 0) return;
    
    // Si no hay texto de búsqueda, mostrar todos los ciclos
    if (!textoBusqueda.trim()) {
        renderizarTablaCiclos(ciclos);
        return;
    }
    
    // Filtrar los ciclos que coinciden con el texto de búsqueda
    const ciclosFiltrados = ciclos.filter(ciclo => {
        if (!ciclo) return false;
        
        const codigo = (ciclo.cod_ciclo || '').toLowerCase();
        const nombre = (ciclo.nombre || '').toLowerCase();
        const descripcion = (ciclo.descripcion || '').toLowerCase();
        
        return codigo.includes(textoBusqueda) || 
               nombre.includes(textoBusqueda) || 
               descripcion.includes(textoBusqueda);
    });
    
    renderizarTablaCiclos(ciclosFiltrados);
}

// Función para cargar los ciclos desde la API
function cargarCiclos() {
    fetch(`${BACKEND_URL}/api/ciclos/completos`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        ciclos = data;
        renderizarTablaCiclos(ciclos);
    })
    .catch(error => {
        console.error('Error al cargar ciclos:', error);
        document.getElementById('tabla-ciclos').innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-red-500">
                    Error al cargar los ciclos. Por favor, intenta de nuevo.
                </td>
            </tr>
        `;
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt');
            window.location.href = '/login.html';
        }
    });
}

// Función para renderizar la tabla de ciclos
function renderizarTablaCiclos(ciclos) {
    const tablaCiclos = document.getElementById('tabla-ciclos');
    
    if (ciclos.length === 0) {
        tablaCiclos.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    No hay ciclos disponibles.
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    ciclos.forEach(ciclo => {
        html += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${ciclo.cod_ciclo}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${ciclo.nombre}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${ciclo.descripcion || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${ciclo.cursos ? ciclo.cursos.length : 0} cursos</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3" data-accion="editar" data-id="${ciclo.cod_ciclo}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900" data-accion="eliminar" data-id="${ciclo.cod_ciclo}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tablaCiclos.innerHTML = html;
    
    // Configurar eventos para los botones de acción
    document.querySelectorAll('[data-accion="editar"]').forEach(btn => {
        btn.addEventListener('click', () => editarCiclo(btn.dataset.id));
    });
    
    document.querySelectorAll('[data-accion="eliminar"]').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarCiclo(btn.dataset.id));
    });
}

// Función para configurar eventos de los modales
function configurarEventosModales() {
    // Modal de nuevo ciclo
    const btnNuevoCiclo = document.getElementById('btn-nuevo-ciclo');
    const modalCiclo = document.getElementById('modal-ciclo');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formCiclo = document.getElementById('form-ciclo');
    
    btnNuevoCiclo.addEventListener('click', () => {
        document.getElementById('modal-titulo').textContent = 'Nuevo Ciclo';
        formCiclo.reset();
        cicloActual = null;
        modalCiclo.classList.remove('hidden');
    });
    
    btnCancelar.addEventListener('click', () => {
        modalCiclo.classList.add('hidden');
    });
    
    formCiclo.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarCiclo();
    });
    
    // Modal de confirmación para eliminar
    const modalConfirmar = document.getElementById('modal-confirmar');
    const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    
    btnCancelarEliminar.addEventListener('click', () => {
        modalConfirmar.classList.add('hidden');
    });
    
    btnConfirmarEliminar.addEventListener('click', () => {
        eliminarCiclo();
    });
}

// Función para editar un ciclo
function editarCiclo(codCiclo) {
    const ciclo = ciclos.find(c => c.cod_ciclo === codCiclo);
    if (!ciclo) return;
    
    cicloActual = ciclo;
    
    document.getElementById('modal-titulo').textContent = 'Editar Ciclo';
    document.getElementById('codigo').value = ciclo.cod_ciclo;
    document.getElementById('codigo').disabled = true; // No permitir cambiar el código
    document.getElementById('nombre').value = ciclo.nombre;
    document.getElementById('descripcion').value = ciclo.descripcion || '';
    
    document.getElementById('modal-ciclo').classList.remove('hidden');
}

// Función para confirmar la eliminación de un ciclo
function confirmarEliminarCiclo(codCiclo) {
    cicloActual = ciclos.find(c => c.cod_ciclo === codCiclo);
    if (!cicloActual) return;
    
    document.getElementById('modal-confirmar').classList.remove('hidden');
}

// Función para guardar un ciclo (nuevo o editado)
function guardarCiclo() {
    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    
    const cicloData = {
        cod_ciclo: codigo,
        nombre: nombre,
        descripcion: descripcion
    };
    
    const url = cicloActual 
        ? `${BACKEND_URL}/api/ciclos/${cicloActual.cod_ciclo}` // Editar
        : `${BACKEND_URL}/api/ciclos`; // Nuevo
    
    const method = cicloActual ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cicloData)
    })
    .then(response => {
        if (!response.ok) {
            // Capturar la respuesta de error para leer el mensaje
            return response.json().then(errorData => {
                throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('modal-ciclo').classList.add('hidden');
        cargarCiclos(); // Recargar la lista de ciclos
    })
    .catch(error => {
        console.error('Error al guardar ciclo:', error);
        // Mostrar el mensaje de error específico
        alert(error.message || 'Error al guardar el ciclo. Por favor, intenta de nuevo.');
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt');
            window.location.href = '/login.html';
        }
    });
}

// Función para eliminar un ciclo
function eliminarCiclo() {
    if (!cicloActual) return;
    
    fetch(`${BACKEND_URL}/api/ciclos/${cicloActual.cod_ciclo}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('modal-confirmar').classList.add('hidden');
        cargarCiclos(); // Recargar la lista de ciclos
    })
    .catch(error => {
        console.error('Error al eliminar ciclo:', error);
        alert('Error al eliminar el ciclo. Por favor, intenta de nuevo.');
        
        if (error.message.includes('401')) {
            localStorage.removeItem('jwt');
            window.location.href = '/login.html';
        }
    });
}