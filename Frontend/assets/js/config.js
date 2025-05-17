export const BACKEND_URL = 'http://127.0.0.1:8000';
export const API_URL = "https://pire-production.up.railway.app";

// Asegurarse de que el favicon esté configurado
const setFavicon = () => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = './assets/images/favicon.ico'; // Ruta al favicon
    document.head.appendChild(link);
};

// Llamar a la función para establecer el favicon
setFavicon();