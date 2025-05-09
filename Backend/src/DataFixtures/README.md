# Fixtures para PIRE

Este directorio contiene los fixtures para cargar datos de prueba en la aplicación PIRE.

## Estructura de los Fixtures

El archivo `AppFixtures.php` contiene fixtures para todas las entidades del sistema:

- **Ciclos**: DAW, DAM, ASIR
- **Cursos**: Primero y segundo de cada ciclo
- **Asignaturas**: Varias asignaturas por curso
- **Usuarios**: Admin, profesor y varios alumnos
- **Documentos**: Ejemplos de documentos para diferentes asignaturas
- **Valoraciones**: Valoraciones de ejemplo para los documentos
- **Comentarios**: Comentarios de ejemplo para los documentos

## Cómo Cargar los Fixtures

### En Entorno Local

Para cargar los fixtures en la base de datos, ejecuta el siguiente comando desde el directorio raíz del proyecto:

```bash
php bin/console doctrine:fixtures:load
```

Este comando borrará todos los datos existentes en la base de datos y cargará los nuevos datos de prueba.

Si prefieres añadir los fixtures sin borrar los datos existentes, usa la opción `--append`:

```bash
php bin/console doctrine:fixtures:load --append
```

### En Entorno Docker

Si estás utilizando Docker, debes ejecutar el comando dentro del contenedor de backend:

```bash
# Acceder al contenedor de backend
docker-compose exec backend bash

# Una vez dentro del contenedor, ejecutar:
php bin/console doctrine:fixtures:load
```

O directamente en una sola línea:

```bash
docker-compose exec backend php bin/console doctrine:fixtures:load
```

Para añadir los fixtures sin eliminar datos existentes:

```bash
docker-compose exec backend php bin/console doctrine:fixtures:load --append
```

### Verificación

Para verificar que los datos se han cargado correctamente, puedes acceder a la aplicación y probar el inicio de sesión con alguno de los usuarios creados (ver tabla de usuarios más abajo).

También puedes verificar directamente en la base de datos:

```bash
# Acceder al contenedor de base de datos
docker-compose exec db mysql -uroot -proot

# Una vez dentro de MySQL
use pire_db;
select * from user;
select * from ciclo;
```

## Usuarios Creados

Los fixtures crean los siguientes usuarios:

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@pire.com | admin123 | ROLE_ADMIN |
| alumno1@pire.com | alumno123 | ROLE_USER |
| alumno2@pire.com | alumno123 | ROLE_USER |
| alumno3@pire.com | alumno123 | ROLE_USER |

## Personalización

Puedes personalizar los fixtures editando el archivo `AppFixtures.php` y modificando los arrays de datos en los diferentes métodos:

- `loadCiclos()`
- `loadCursos()`
- `loadAsignaturas()`
- `loadUsers()`
- `loadDocumentos()`
- `loadValoraciones()`
- `loadComentarios()`

También puedes crear clases de fixtures separadas para cada entidad utilizando:

```bash
php bin/console make:fixtures CicloFixtures
```

Y luego implementar la carga de datos para esa entidad específica.