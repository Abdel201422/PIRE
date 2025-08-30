// js/config.js
export const BACKEND_URL = 'http://localhost:8000'
export const DOC_URL = 'http://localhost:8000'

const setFavicon = () => {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/x-icon'
    link.href = './assets/images/favicon.ico'
    document.head.appendChild(link)
}

setFavicon()