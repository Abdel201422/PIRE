export const BACKEND_URL = 'https://pire1-fqb0ezg0egdbh4hy.canadacentral-01.azurewebsites.net/Backend/public/index.php'
export const DOC_URL = 'https://pire1-fqb0ezg0egdbh4hy.canadacentral-01.azurewebsites.net/Backend/public'

// Asegurarse de que el favicon esté configurado
const setFavicon = () => {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/x-icon'
    link.href = './assets/images/favicon.ico' // Ruta al favicon
    document.head.appendChild(link)
}

// Llamar a la función para establecer el favicon
setFavicon()