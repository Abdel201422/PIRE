// js/api/getDocumentosUser.js

import { BACKEND_URL } from '../config.js'

const token = localStorage.getItem('jwt')

if (!token) {
    window.location.href = '/login.html'
}

document.addEventListener('DOMContentLoaded', function () {

    const documentosContainer = document.getElementById('documentosContainer')

    if (!documentosContainer) return

    fetch(`${BACKEND_URL}/api/documentos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener documentos');
            return response.json();
    })
    .then(data => {
        //console.log('---> ', data)

        data.forEach(documento => {
            const a = document.createElement('a')
            a.href = `./documento?id=${documento.id}`
            a.className = 'block'
            
            const div = document.createElement('div')
            div.className = 'px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors'
        
            div.innerHTML = `
                <div class="flex items-center space-x-4">
                                    <div class="w-8 h-8 flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path  d="M17.25 2C18.4926 2 19.5 3.00736 19.5 4.25V19.75C19.5 20.9926 18.4926 22 17.25 22H6.75C5.50736 22 4.5 20.9926 4.5 19.75V9.62109C4.5 9.09917 4.68099 8.59561 5.00879 8.19531L5.1582 8.03027L10.5264 2.65918C10.9483 2.23707 11.5213 2 12.1182 2H17.25ZM12.251 7.49902C12.2517 8.74215 11.2441 9.75093 10.001 9.75098H6V19.75C6 20.1642 6.33579 20.5 6.75 20.5H17.25C17.6642 20.5 18 20.1642 18 19.75V4.25C18 3.83579 17.6642 3.5 17.25 3.5H12.248L12.251 7.49902ZM12.0771 16.7539C12.4551 16.7925 12.75 17.1118 12.75 17.5C12.75 17.8882 12.4551 18.2075 12.0771 18.2461L12 18.25H9C8.58579 18.25 8.25 17.9142 8.25 17.5C8.25 17.0858 8.58579 16.75 9 16.75H12L12.0771 16.7539ZM15.0771 13.7539C15.4551 13.7925 15.75 14.1118 15.75 14.5C15.75 14.8882 15.4551 15.2075 15.0771 15.2461L15 15.25H9C8.58579 15.25 8.25 14.9142 8.25 14.5C8.25 14.0858 8.58579 13.75 9 13.75H15L15.0771 13.7539ZM7.05859 8.25098H10.001C10.4153 8.25093 10.7511 7.91428 10.751 7.5L10.748 4.55859L7.05859 8.25098Z"  fill="currentColor"/></svg>
                                    </div>
                                    <span class="font-medium text-gray-800">${documento.titulo}</span>
                                </div>
                                <span class="bg-[var(--color-orange-100)] px-4 py-2 rounded-full flex items-center gap-2">
                                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.50516 0.25C9.79025 0.250313 10.0508 0.412325 10.177 0.667969L12.6018 5.58105L18.0247 6.36914C18.3069 6.41044 18.542 6.60862 18.6302 6.87988C18.7072 7.11731 18.6597 7.37518 18.51 7.56934L18.4397 7.64844L14.5159 11.4727L15.4427 16.873C15.4909 17.1543 15.3746 17.4386 15.1438 17.6064C14.9131 17.774 14.6073 17.7965 14.3548 17.6641L9.50418 15.1133L4.65458 17.6641C4.40207 17.7966 4.0963 17.774 3.86551 17.6064C3.63455 17.4386 3.51843 17.1544 3.56668 16.873L4.49247 11.4727L0.569615 7.64844C0.365202 7.44918 0.291971 7.15138 0.380161 6.87988C0.468444 6.6085 0.703203 6.41018 0.98563 6.36914L6.40653 5.58105L8.83231 0.667969L8.88602 0.576172C9.02453 0.374098 9.25568 0.25 9.50516 0.25Z" fill="#FFA53C"></path>
                                    </svg>
                                    <span class="font-medium">${documento.puntuacion}</span>
                                </span>
                            </div>`       
            
            a.append(div)
            documentosContainer.append(a)
        })
    })
})