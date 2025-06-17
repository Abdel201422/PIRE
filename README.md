# PIRE (Plataforma Intercambio de Recursos Educativos)

## Descripción

PIRE es una plataforma web colaborativa diseñada para centralizar y mejorar el intercambio de apuntes, guías y materiales académicos entre estudiantes de distintos ciclos formativos, cursos y asignaturas. Ofrece un entorno libre de publicidad y de acceso gratuito, con sistemas de metadatos, valoraciones y comentarios para asegurar la calidad y facilitar la búsqueda y organización de recursos.

## Características principales

* Gestión de usuarios y roles: Autenticación y autorización mediante JWT (Symfony Security), con roles diferenciados (usuario regular, administrador).
* Subida y descarga de documentos: Almacenamiento en el sistema de archivos del backend, con previsualización y descarga controlada.
* Metadatos y categorías: Etiquetado por ciclo formativo, curso y asignatura, con filtrado por palabras clave.
* Valoraciones y comentarios: Sistema de puntuación (1–5 estrellas) y feedback escrito para cada recurso, con métricas de popularidad.
* Dashboard personalizado: Sección donde el usuario ve el total de recursos subidos, media de valoraciones recibidas y número de comentarios.
* Búsqueda avanzada: Filtrado por título, metadatos y palabras clave.
* API REST robusta: Backend en Symfony 6 (PHP 8) con arquitectura MVC y controladores para usuarios, documentos, comentarios, valoraciones, asignaturas, ciclos y dashboard.
* Frontend responsivo: MPA con HTML5, CSS3 (Tailwind CSS) y JavaScript ES6 para consumo de API REST.
* Despliegue en la nube: Frontend en Azure Static Web Apps (CI/CD con GitHub Actions), backend en Azure App Service y base de datos en Azure SQL Database.

## Tecnologías

* Backend: Symfony 6, PHP 8, Doctrine ORM, JWT para seguridad.
* Base de datos: Azure SQL Database (MySQL/PostgreSQL o SQL Server según configuración), con índices para optimización.
* Frontend: HTML5, CSS3 con Tailwind CSS, JavaScript ES6.
* Despliegue y CI/CD:

  * Azure Static Web Apps para frontend (build automático desde GitHub Actions).
  * Azure App Service para backend.
  * Azure SQL Database para almacenamiento.
* Prototipado: Figma.

## Estructura del proyecto

* Backend (Symfony)

  * Directorio principal: /src/

    * Controller/: Controladores para API REST (UserController, DocumentoController, ComentarioController, ValoracionController, AsignaturaController, CicloController, DashboardController, RegistrationController, SecurityController).
    * Entity/: Entidades (User, Documento, Comentario, Valoracion, Asignatura, Curso, Ciclo).
    * Repository/: Repositorios personalizados.
    * Security/: Configuración de JWT y firewalls.
    * Migrations/: Migraciones de base de datos.
    * Resources/config/: Configuración de seguridad, rutas y servicios.
  * Configuración de seguridad: JWT en config/packages/security.yaml y parámetros en .env.
  * Rutas API: Prefijo /api/ para todas las operaciones.

* Frontend (MPA)

  * Archivos HTML independientes para cada sección (login.html, dashboard.html, documentos.html, perfil.html, administración.html, etc.).
  * Carpeta assets/ para CSS (Tailwind) y scripts JavaScript.
  * Scripts JavaScript para llamadas fetch a la API, gestión de tokens y actualización dinámica de la interfaz.
  * Tailwind configurado con archivo de configuración para colores y tipografía personalizados.

## Instalación y configuración

### Requisitos previos

* PHP >= 8.0
* Composer
* Node.js y npm (para herramientas de frontend, si se usa build local de Tailwind)
* Azure CLI (opcional, para despliegue en Azure)
* Servidor de base de datos compatible (Azure SQL Database o local para desarrollo)

### Configuración del backend

1. Clonar el repositorio:

   git clone https://github.com/tu-org/pire.git
   cd pire/backend
   
2. Instalar dependencias PHP:

   composer install
   
3. Configurar variables de entorno en .env o .env.local:

   DATABASE_URL
   JWT_PASSPHRASE
   # Otras variables necesarias (APP_ENV, APP_SECRET ...)
   
4. Crear la base de datos y ejecutar migraciones:

   php bin/console doctrine:database:create
   php bin/console doctrine:migrations:migrate
   
5. (Opcional) Cargar datos de prueba (fixtures):

   php bin/console doctrine:fixtures:load
   
6. Iniciar servidor de desarrollo:

   symfony server:start

### Configuración del frontend

1. Entrar en la carpeta del frontend:

   cd ../frontend
  
2. Instalar dependencias (si aplica, por ejemplo para Tailwind):

   npm install
 
3. Generar los estilos con Tailwind (si se usa un build local):

   npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
  
4. Abrir los archivos HTML en un servidor local o configurar un servidor estático:

   * Con VSCode Live Server o similar.
   * Asegurarse de apuntar las llamadas fetch al dominio del backend (configurable con variable en scripts).

## Uso

1. Registro e inicio de sesión:

   * El usuario se registra o inicia sesión en la página de login.
   * Al autenticarse, se guarda el token JWT en almacenamiento local (localStorage).
2. Dashboard:

   * Muestra estadísticas: número de recursos subidos, media de valoraciones y comentarios.
3. Gestión de documentos:

   * Subir nuevo recurso: formulario con título, descripción, selección de ciclo, curso y asignatura, y archivo.
   * Listar y descargar documentos: vista con paginación o filtrado.
   * Buscar documentos: por título o palabra clave.
4. Valoraciones y comentarios:

   * Desde la vista de cada recurso, el usuario puede valorar (1–5 estrellas) y comentar.
   * Restricción: un usuario solo puede valorar una vez cada recurso.
5. Perfil de usuario:

   * Ver y editar datos personales, ver estadísticas personales.
6. Administración (solo para administradores):

   * Gestión de usuarios (listar, editar, eliminar).
   * Gestión de asignaturas, cursos y ciclos.
7. Dashboard API:

   * Endpoints /api/dashboard para obtener estadísticas de uso y métricas.

## API REST (Resumen de endpoints)

> Nota: Todas las rutas bajo /api/ requieren el token JWT salvo las de registro y login.

* Autenticación:

  * POST /api/register: Registro de usuario.
  * POST /api/login: Autenticación y obtención de token JWT.

* Usuarios:

  * GET /api/users: Listar usuarios (admin).
  * POST /api/users: Crear usuario.
  * GET /api/users/{id}: Obtener datos de un usuario.
  * PUT /api/users/{id}/edit: Actualizar usuario.
  * DELETE /api/users/{id}/delete: Eliminar usuario.

* Documentos:

  * GET /api/documentos: Listar documentos del usuario autenticado.
  * POST /api/documentos/upload: Subir recurso.
  * GET /api/documentos/download/{id}: Descargar recurso.
  * GET /api/documentos/{id}/data: Obtener metadatos de un recurso.
  * POST /api/documentos/{id}/puntuar: Valorar recurso.
  * GET /api/documentos/search?query=...: Buscar documentos por título o palabra clave.

* Comentarios:

  *  GET /api/comentario/listar: Listar todos los comentarios (admin o filtrado).
  *  GET /api/comentario/documento/{id}: Listar comentarios de un documento.
  *  POST /api/comentario: Crear comentario.
  *  DELETE /api/comentario/delete/{id}: Eliminar comentario.

* Valoraciones:

  * POST /api/documentos/{id}/puntuar: Crear o actualizar valoración.

* Asignaturas, Cursos y Ciclos:

  * GET /api/ciclos: Listar ciclos.
  * POST /api/ciclos: Crear ciclo.
  * GET /api/ciclos/{codCiclo}/cursos: Obtener cursos de un ciclo.
  * GET /api/asignaturas: Listar asignaturas.
  * POST /api/asignaturas: Crear asignatura.
  * PUT /api/asignaturas/{codigo}: Actualizar asignatura.
  * DELETE /api/asignaturas/{codigo}: Eliminar asignatura.
  * GET /api/asignaturas/ciclo/{id}: Listar asignaturas de un ciclo.

* Dashboard:

  * GET /api/dashboard: Obtener estadísticas del usuario autenticado.

## Estructura de la base de datos

Entidades principales y relaciones:

* User: id (PK), email (único), nombre, apellidos, contraseña, avatar, roles (JSON), fecha\_registro.

  * Relación: 1 usuario → N documentos, N comentarios, N valoraciones.
* Documento: id (PK), título, descripción, ruta\_archivo, tipo\_archivo, fecha\_subida, descargas, usuario\_id (FK), asignatura\_id (FK).

  * Relación: 1 documento → N comentarios, N valoraciones.
* Comentario: id (PK), texto, fecha, usuario\_id (FK), documento\_id (FK).
* Valoracion: id (PK), puntuacion (1–5), fecha, usuario\_id (FK), documento\_id (FK).
* Asignatura: codigo (PK), nombre, curso\_cod (FK).
* Curso: codigo (PK), nombre, ciclo\_cod (FK).
* Ciclo: codigo (PK), nombre, descripción.

Índices:

* Índices en campos frecuentes: email (único), nombre/apellidos de usuario, título de documento, fecha\_subida.
* Claves foráneas crean índices automáticos.

## Prototipado y diseño UI

* Diseñado en Figma con flujos de usuario claros.
* Interfaz responsiva y accesible.
* Paleta de colores y tipografía definidos en configuración de Tailwind.
* Componentes básicos: formularios de login/registro, listas de documentos, modales para comentarios/valoraciones.

## Despliegue

### Azure

* Frontend: Azure Static Web Apps, configurado con GitHub Actions para despliegue automático.
* Backend: Azure App Service, configurado para variables de entorno y escalabilidad.
* Base de datos: Azure SQL Database (configurar cadena de conexión en variables).
* Almacenamiento de archivos: Opcional almacenar en Azure Blob Storage; actualmente en sistema de archivos local o configurable.

### CI/CD

* GitHub Actions configuran build de frontend y despliegue en Azure Static Web Apps.
* Tests (si se implementan) ejecutados en pipeline antes de despliegue.


## Contribución

1. Fork del repositorio.
2. Crear rama con nueva funcionalidad o corrección: `git checkout -b feature/mi-cambio`.
3. Hacer commits claros y descriptivos.
4. Enviar Pull Request describiendo la propuesta y los cambios.
5. Revisiones y pruebas automáticas en CI antes de merge.

## Licencia

Este proyecto está bajo licencia Creative Commons Reconocimiento-CompartirIgual 4.0 Internacional.

