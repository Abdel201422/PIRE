export const BACKEND_URL = 'https://pire-production-7617.up.railway.app';

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