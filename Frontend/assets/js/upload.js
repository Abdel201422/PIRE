// js/upload.js
import { BACKEND_URL } from './config.js'

document.addEventListener('DOMContentLoaded', function () {
            const asignaturaSelect = document.getElementById('asignatura')
            const fileInput = document.getElementById('file')
            const dropArea = document.getElementById('dropArea')
            const selectedFileDiv = document.getElementById('selectedFile')
            const cancelButton = document.getElementById('cancelButton')
            
            const token = localStorage.getItem('jwt')

            // Función para mostrar el archivo seleccionado
            function displaySelectedFile(file) {
                if (file) {
                    selectedFileDiv.textContent = `Archivo seleccionado: ${file.name}`
                } else {
                    selectedFileDiv.textContent = ''
                }
            }

            // Eventos para el drag & drop
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false)
            })

            function preventDefaults(e) {
                e.preventDefault()
                e.stopPropagation()
            }

            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight, false)
            })

            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unhighlight, false)
            })

            function highlight() {
                dropArea.classList.add('border-pire-green', 'bg-green-50')
            }

            function unhighlight() {
                dropArea.classList.remove('border-pire-green', 'bg-green-50')
            }

            dropArea.addEventListener('drop', handleDrop, false)

            function handleDrop(e) {
                const dt = e.dataTransfer
                const file = dt.files[0]
                fileInput.files = dt.files
                displaySelectedFile(file)
            }

            // Clic en el área para abrir el selector de archivos
            dropArea.addEventListener('click', function() {
                fileInput.click()
            })

            fileInput.addEventListener('change', function() {
                displaySelectedFile(this.files[0])
            })

            // Botón cancelar
            cancelButton.addEventListener('click', function() {
                window.location.href = 'dashboard.html'
            })

            // Manejar el envío del formulario
            document.getElementById('uploadForm').addEventListener('submit', function (e) {
                e.preventDefault()

                const formData = new FormData(this)
                
                fetch(`${BACKEND_URL}/api/documentos/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    const responseDiv = document.getElementById('response')
                    if (data.error) {
                        responseDiv.innerHTML = `<div class="p-3 bg-red-100 text-red-700 rounded-lg">Error: ${data.error}</div>`
                    } else {
                        responseDiv.innerHTML = `<div class="p-3 bg-green-100 text-green-700 rounded-lg">${data.message}</div>`
                        // Resetear el formulario
                        document.getElementById('uploadForm').reset()
                        selectedFileDiv.textContent = ''
                        
                        // Redirigir después de 2 segundos
                        setTimeout(function() {
                            window.location.href = 'dashboard.html'
                        }, 2000)
                    }
                })
                .catch(err => {
                    const responseDiv = document.getElementById('response')
                    responseDiv.innerHTML = `<div class="p-3 bg-red-100 text-red-700 rounded-lg">Error al subir el documento</div>`
                })
            })
        })