// js/config.js
export const BACKEND_URL = 'https://pire1-fqb0ezg0egdbh4hy.canadacentral-01.azurewebsites.net/Backend/public/index.php'
export const DOC_URL = 'https://pire1-fqb0ezg0egdbh4hy.canadacentral-01.azurewebsites.net/Backend/public'

const setFavicon = () => {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/x-icon'
    link.href = './assets/images/favicon.ico' 
    document.head.appendChild(link)
}

setFavicon()