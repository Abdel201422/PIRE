<?php

namespace App\DataFixtures;

use App\Entity\Asignatura;
use App\Entity\Ciclo;
use App\Entity\Comentario;
use App\Entity\Curso;
use App\Entity\Documento;
use App\Entity\User;
use App\Entity\Valoracion;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;
    
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }
    
    public function load(ObjectManager $manager): void
    {
      
        $ciclos = $this->loadCiclos($manager);
        
        $cursos = $this->loadCursos($manager, $ciclos);
        
        $asignaturas = $this->loadAsignaturas($manager, $cursos);
        
        $users = $this->loadUsers($manager);
        
        $documentos = $this->loadDocumentos($manager, $asignaturas, $users);
        
        $this->loadValoraciones($manager, $documentos, $users);
        
        $this->loadComentarios($manager, $documentos, $users);
        
        $manager->flush();
    }
    
    private function loadCiclos(ObjectManager $manager): array
{
    $ciclosData = [
        [
            'cod_ciclo' => 'DAW',
            'nombre' => 'Desarrollo de Aplicaciones Web',
            'descripcion' => 'Ciclo formativo de grado superior de Desarrollo de Aplicaciones Web'
        ],
        [
            'cod_ciclo' => 'ADF',
            'nombre' => 'Administración y Finanzas',
            'descripcion' => 'Ciclo formativo de grado superior de Administración y Finanzas'
        ],
        [
            'cod_ciclo' => 'EIN',
            'nombre' => 'Educación Infantil',
            'descripcion' => 'Ciclo formativo de grado superior de Educación Infantil'
        ],
        [
            'cod_ciclo' => 'MEC',
            'nombre' => 'Mecatrónica Industrial',
            'descripcion' => 'Ciclo formativo de grado superior de Mecatrónica Industrial'
        ],
        [
            'cod_ciclo' => 'LAB',
            'nombre' => 'Laboratorio de Análisis y de Control de Calidad',
            'descripcion' => 'Ciclo formativo de grado superior de Laboratorio de Análisis y de Control de Calidad'
        ]
    ];
    
    $ciclos = [];
    foreach ($ciclosData as $cicloData) {
        $ciclo = new Ciclo();
        $ciclo->setCodCiclo($cicloData['cod_ciclo']);
        $ciclo->setNombre($cicloData['nombre']);
        $ciclo->setDescripcion($cicloData['descripcion']);
        
        $manager->persist($ciclo);
        $ciclos[$cicloData['cod_ciclo']] = $ciclo;
    }
    
    return $ciclos;
}

private function loadCursos(ObjectManager $manager, array $ciclos): array
{
    $cursosData = [
        // Desarrollo de Aplicaciones Web (DAW)
        [
            'cod_curso' => 'D1',
            'nombre' => '1º Curso DAW',
            'ciclo' => 'DAW'
        ],
        [
            'cod_curso' => 'D2',
            'nombre' => '2º Curso DAW',
            'ciclo' => 'DAW'
        ],
        // Administración y Finanzas (ADF)
        [
            'cod_curso' => 'A1',
            'nombre' => '1º Curso Administración y Finanzas',
            'ciclo' => 'ADF'
        ],
        [
            'cod_curso' => 'A2',
            'nombre' => '2º Curso Administración y Finanzas',
            'ciclo' => 'ADF'
        ],
        // Educación Infantil (EIN)
        [
            'cod_curso' => 'E1',
            'nombre' => '1º Curso Educación Infantil',
            'ciclo' => 'EIN'
        ],
        [
            'cod_curso' => 'E2',
            'nombre' => '2º Curso Educación Infantil',
            'ciclo' => 'EIN'
        ],
        // Mecatrónica Industrial (MEC)
        [
            'cod_curso' => 'M1',
            'nombre' => '1º Curso Mecatrónica',
            'ciclo' => 'MEC'
        ],
        [
            'cod_curso' => 'M2',
            'nombre' => '2º Curso Mecatrónica',
            'ciclo' => 'MEC'
        ],
        // Laboratorio (LAB)
        [
            'cod_curso' => 'L1',
            'nombre' => '1º Curso Laboratorio',
            'ciclo' => 'LAB'
        ],
        [
            'cod_curso' => 'L2',
            'nombre' => '2º Curso Laboratorio',
            'ciclo' => 'LAB'
        ]
    ];
    
    $cursos = [];
    foreach ($cursosData as $cursoData) {
        $curso = new Curso();
        $curso->setCodCurso($cursoData['cod_curso']);
        $curso->setNombre($cursoData['nombre']);
        $curso->setCiclo($ciclos[$cursoData['ciclo']]);
        
        $manager->persist($curso);
        $cursos[$cursoData['cod_curso']] = $curso;
    }
    
    return $cursos;
}

private function loadAsignaturas(ObjectManager $manager, array $cursos): array
{
    $asignaturasData = [
        // Asignaturas de DAW1 (1º Curso DAW - D1)
        [
            'codigo' => 'SINF',
            'nombre' => 'Sistemas informáticos',
            'curso' => 'D1'
        ],
        [
            'codigo' => 'BD',
            'nombre' => 'Bases de datos',
            'curso' => 'D1'
        ],
        [
            'codigo' => 'PROG',
            'nombre' => 'Programación',
            'curso' => 'D1'
        ],
        [
            'codigo' => 'LMSG',
            'nombre' => 'Lenguajes de marcas y sistemas de gestión de información',
            'curso' => 'D1'
        ],
        [
            'codigo' => 'ENT',
            'nombre' => 'Entornos de desarrollo',
            'curso' => 'D1'
        ],
        [
            'codigo' => 'FOL',
            'nombre' => 'Formación y orientación laboral',
            'curso' => 'D1'
        ],
        
        // Asignaturas de DAW2 (2º Curso DAW - D2)
        [
            'codigo' => 'DWC',
            'nombre' => 'Desarrollo web en entorno cliente',
            'curso' => 'D2'
        ],
        [
            'codigo' => 'DWS',
            'nombre' => 'Desarrollo web en entorno servidor',
            'curso' => 'D2'
        ],
        [
            'codigo' => 'DPL',
            'nombre' => 'Despliegue de aplicaciones web',
            'curso' => 'D2'
        ],
        [
            'codigo' => 'DIW',
            'nombre' => 'Diseño de interfaces web',
            'curso' => 'D2'
        ],
        [
            'codigo' => 'EIE',
            'nombre' => 'Empresa e iniciativa emprendedora',
            'curso' => 'D2'
        ],
        [
            'codigo' => 'PROY',
            'nombre' => 'Proyecto DAW',
            'curso' => 'D2'
        ],
        
        // Asignaturas de Administración y Finanzas 1 (A1)
        [
            'codigo' => 'COM',
            'nombre' => 'Comunicación y atención al cliente',
            'curso' => 'A1'
        ],
        [
            'codigo' => 'GES',
            'nombre' => 'Gestión de la documentación jurídica y empresarial',
            'curso' => 'A1'
        ],
        [
            'codigo' => 'PIA',
            'nombre' => 'Proceso integral de la actividad comercial',
            'curso' => 'A1'
        ],
        [
            'codigo' => 'RSC',
            'nombre' => 'Recursos humanos y responsabilidad social corporativa',
            'curso' => 'A1'
        ],
        [
            'codigo' => 'OFI',
            'nombre' => 'Ofimática y proceso de la información',
            'curso' => 'A1'
        ],
        [
            'codigo' => 'ING',
            'nombre' => 'Inglés',
            'curso' => 'A1'
        ],
        [
            'codigo' => 'FOL2',
            'nombre' => 'Formación y orientación laboral',
            'curso' => 'A1'
        ],
        
        // Asignaturas de Administración y Finanzas 2 (A2)
        [
            'codigo' => 'GRH',
            'nombre' => 'Gestión de recursos humanos',
            'curso' => 'A2'
        ],
        [
            'codigo' => 'GFI',
            'nombre' => 'Gestión financiera',
            'curso' => 'A2'
        ],
        [
            'codigo' => 'COF',
            'nombre' => 'Contabilidad y fiscalidad',
            'curso' => 'A2'
        ],
        [
            'codigo' => 'GLC',
            'nombre' => 'Gestión logística y comercial',
            'curso' => 'A2'
        ],
        [
            'codigo' => 'SIM',
            'nombre' => 'Simulación empresarial',
            'curso' => 'A2'
        ],
        [
            'codigo' => 'EIE2',
            'nombre' => 'Empresa e iniciativa emprendedora',
            'curso' => 'A2'
        ],
        [
            'codigo' => 'PROA',
            'nombre' => 'Proyecto',
            'curso' => 'A2'
        ],
        
        // Asignaturas de Educación Infantil 1 (E1)
        [
            'codigo' => 'DID',
            'nombre' => 'Didáctica de la educación infantil',
            'curso' => 'E1'
        ],
        [
            'codigo' => 'APS',
            'nombre' => 'Autonomía personal y salud infantil',
            'curso' => 'E1'
        ],
        [
            'codigo' => 'JUE',
            'nombre' => 'El juego infantil y su metodología',
            'curso' => 'E1'
        ],
        [
            'codigo' => 'EXC',
            'nombre' => 'Expresión y comunicación',
            'curso' => 'E1'
        ],
        [
            'codigo' => 'DCM',
            'nombre' => 'Desarrollo cognitivo y motor',
            'curso' => 'E1'
        ],
        [
            'codigo' => 'FOL3',
            'nombre' => 'Formación y orientación laboral',
            'curso' => 'E1'
        ],
        
        // Asignaturas de Educación Infantil 2 (E2)
        [
            'codigo' => 'DSO',
            'nombre' => 'Desarrollo socioafectivo',
            'curso' => 'E2'
        ],
        [
            'codigo' => 'INT',
            'nombre' => 'Intervención con familias y atención a menores en riesgo social',
            'curso' => 'E2'
        ],
        [
            'codigo' => 'HAB',
            'nombre' => 'Habilidades sociales',
            'curso' => 'E2'
        ],
        [
            'codigo' => 'EIE3',
            'nombre' => 'Empresa e iniciativa emprendedora',
            'curso' => 'E2'
        ],
        [
            'codigo' => 'PAU',
            'nombre' => 'Primeros auxilios',
            'curso' => 'E2'
        ],
        [
            'codigo' => 'PROE',
            'nombre' => 'Proyecto',
            'curso' => 'E2'
        ],
        
        // Asignaturas de Mecatrónica Industrial 1 (M1)
        [
            'codigo' => 'SME',
            'nombre' => 'Sistemas mecánicos',
            'curso' => 'M1'
        ],
        [
            'codigo' => 'SEE',
            'nombre' => 'Sistemas eléctricos y electrónicos',
            'curso' => 'M1'
        ],
        [
            'codigo' => 'PFA',
            'nombre' => 'Procesos de fabricación',
            'curso' => 'M1'
        ],
        [
            'codigo' => 'RGS',
            'nombre' => 'Representación gráfica de sistemas mecatrónicos',
            'curso' => 'M1'
        ],
        [
            'codigo' => 'FOL4',
            'nombre' => 'Formación y orientación laboral',
            'curso' => 'M1'
        ],
        [
            'codigo' => 'EIE4',
            'nombre' => 'Empresa e iniciativa emprendedora',
            'curso' => 'M1'
        ],
        
        // Asignaturas de Mecatrónica Industrial 2 (M2)
        [
            'codigo' => 'CSM',
            'nombre' => 'Configuración de sistemas mecatrónicos',
            'curso' => 'M2'
        ],
        [
            'codigo' => 'PGM',
            'nombre' => 'Procesos y gestión del mantenimiento',
            'curso' => 'M2'
        ],
        [
            'codigo' => 'ISM',
            'nombre' => 'Integración de sistemas',
            'curso' => 'M2'
        ],
        [
            'codigo' => 'SSM',
            'nombre' => 'Simulación de sistemas mecatrónicos',
            'curso' => 'M2'
        ],
        [
            'codigo' => 'PROM',
            'nombre' => 'Proyecto',
            'curso' => 'M2'
        ],
        
        // Asignaturas de Laboratorio 1 (L1)
        [
            'codigo' => 'MPM',
            'nombre' => 'Muestreo y preparación de la muestra',
            'curso' => 'L1'
        ],
        [
            'codigo' => 'ANQ',
            'nombre' => 'Análisis químicos',
            'curso' => 'L1'
        ],
        [
            'codigo' => 'ENF',
            'nombre' => 'Ensayos físicos',
            'curso' => 'L1'
        ],
        [
            'codigo' => 'EFQ',
            'nombre' => 'Ensayos fisicoquímicos',
            'curso' => 'L1'
        ],
        [
            'codigo' => 'FOL5',
            'nombre' => 'Formación y orientación laboral',
            'curso' => 'L1'
        ],
        [
            'codigo' => 'EIE5',
            'nombre' => 'Empresa e iniciativa emprendedora',
            'curso' => 'L1'
        ],
        
        // Asignaturas de Laboratorio 2 (L2)
        [
            'codigo' => 'ENM',
            'nombre' => 'Ensayos microbiológicos',
            'curso' => 'L2'
        ],
        [
            'codigo' => 'ENB',
            'nombre' => 'Ensayos biotecnológicos',
            'curso' => 'L2'
        ],
        [
            'codigo' => 'CYS',
            'nombre' => 'Calidad y seguridad en el laboratorio',
            'curso' => 'L2'
        ],
        [
            'codigo' => 'PROL',
            'nombre' => 'Proyecto',
            'curso' => 'L2'
        ]
    ];
    
    $asignaturas = [];
    foreach ($asignaturasData as $asignaturaData) {
        $asignatura = new Asignatura();
        $asignatura->setCodigo($asignaturaData['codigo']);
        $asignatura->setNombre($asignaturaData['nombre']);
        $asignatura->setCurso($cursos[$asignaturaData['curso']]);
        
        $manager->persist($asignatura);
        $asignaturas[$asignaturaData['codigo']] = $asignatura;
    }
    
    return $asignaturas;
}
    
    private function loadUsers(ObjectManager $manager): array
    {
        $usersData = [
            [
                'email' => 'admin@pire.com',
                'nombre' => 'Administrador',
                'apellido' => 'Sistema',
                'password' => 'admin123',
                'roles' => ['ROLE_ADMIN']
            ],
            [
                'email' => 'alumno1@pire.com',
                'nombre' => 'Alumno',
                'apellido' => 'Uno',
                'password' => 'alumno123',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'alumno2@pire.com',
                'nombre' => 'Alumno',
                'apellido' => 'Dos',
                'password' => 'alumno123',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'alumno3@pire.com',
                'nombre' => 'Alumno',
                'apellido' => 'Tres',
                'password' => 'alumno123',
                'roles' => ['ROLE_USER']
            ]
        ];
        
        $users = [];
        foreach ($usersData as $index => $userData) {
            $user = new User();
            $user->setEmail($userData['email']);
            $user->setNombre($userData['nombre']);
            $user->setApellido($userData['apellido']);
            $user->setRoles($userData['roles']);
            
            // Hashear la contraseña
            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $userData['password']
            );
            $user->setPassword($hashedPassword);
            $user->setIsVerified(true);
            
            $manager->persist($user);
            $users[$index] = $user;
        }
        
        return $users;
    }
    
    private function loadDocumentos(ObjectManager $manager, array $asignaturas, array $users): array
    {
        $documentosData = [
            // [
            //     'titulo' => 'Introducción a la programación',
            //     'descripcion' => 'Documento introductorio sobre fundamentos de programación',
            //     'asignatura' => 'PRG1',
            //     'user' => 1, 
            //     'aprobado' => true,
            //     'tipo_archivo' => 'pdf',
            //     'ruta_archivo' => 'introduccion-programacion.pdf'
            // ],
            // [
            //     'titulo' => 'Ejercicios de SQL',
            //     'descripcion' => 'Colección de ejercicios de consultas SQL',
            //     'asignatura' => 'BBDD',
            //     'user' => 1, 
            //     'aprobado' => true,
            //     'tipo_archivo' => 'pdf',
            //     'ruta_archivo' => 'ejercicios-sql.pdf'
            // ],
            // [
            //     'titulo' => 'Solución Práctica HTML/CSS',
            //     'descripcion' => 'Solución a la práctica de estructura web con HTML y CSS',
            //     'asignatura' => 'LMSG',
            //     'user' => 2, // alumno1
            //     'aprobado' => true,
            //     'tipo_archivo' => 'zip',
            //     'ruta_archivo' => 'solucion-practica-html-css.zip'
            // ],
            // [
            //     'titulo' => 'Ejemplo de API REST',
            //     'descripcion' => 'Implementación de ejemplo de una API REST con Laravel',
            //     'asignatura' => 'DWES',
            //     'user' => 3, // alumno2
            //     'aprobado' => true,
            //     'tipo_archivo' => 'pdf',
            //     'ruta_archivo' => 'ejemplo-api-rest.pdf'
            // ],
            // [
            //     'titulo' => 'Tutorial React',
            //     'descripcion' => 'Tutorial básico sobre componentes React',
            //     'asignatura' => 'DWEC',
            //     'user' => 3, // alumno2
            //     'aprobado' => false,
            //     'tipo_archivo' => 'pdf',
            //     'ruta_archivo' => 'tutorial-react.pdf'
            // ],
            // [
            //     'titulo' => 'Apuntes Docker',
            //     'descripcion' => 'Apuntes sobre Docker y contenedores',
            //     'asignatura' => 'DAW',
            //     'user' => 3, // alumno3 (cambiado de 4 a 3 porque solo hay índices 0-3)
            //     'aprobado' => true,
            //     'tipo_archivo' => 'pdf',
            //     'ruta_archivo' => 'apuntes-docker.pdf'
            // ]
        ];
        
        $documentos = [];
        foreach ($documentosData as $index => $documentoData) {
            $documento = new Documento();
            $documento->setTitulo($documentoData['titulo']);
            $documento->setDescripcion($documentoData['descripcion']);
            $documento->setAsignatura($asignaturas[$documentoData['asignatura']]);
            $documento->setUser($users[$documentoData['user']]);
            $documento->setAprobado($documentoData['aprobado']);
            $documento->setTipoArchivo($documentoData['tipo_archivo']);
            $documento->setRutaArchivo($documentoData['ruta_archivo']);
            
            // Simular algunas descargas
            $documento->setNumeroDescargas(rand(0, 50));
            
            $manager->persist($documento);
            $documentos[$index] = $documento;
        }
        
        return $documentos;
    }
    
    private function loadValoraciones(ObjectManager $manager, array $documentos, array $users): void
    {
        $valoracionesData = [
            // [
            //     'documento' => 0, // Introducción a la programación
            //     'user' => 2, // alumno1
            //     'puntuacion' => 5
            // ],
            // [
            //     'documento' => 0, // Introducción a la programación
            //     'user' => 3, // alumno2
            //     'puntuacion' => 4
            // ],
            // [
            //     'documento' => 1, // Ejercicios de SQL
            //     'user' => 2, // alumno1
            //     'puntuacion' => 5
            // ],
            // [
            //     'documento' => 3, // Ejemplo de API REST
            //     'user' => 3, // alumno3
            //     'puntuacion' => 5
            // ],
            // [
            //     'documento' => 5, // Apuntes Docker
            //     'user' => 2, // alumno1
            //     'puntuacion' => 3
            // ]
        ];
        
        foreach ($valoracionesData as $valoracionData) {
            $valoracion = new Valoracion();
            $valoracion->setDocumento($documentos[$valoracionData['documento']]);
            $valoracion->setUser($users[$valoracionData['user']]);
            $valoracion->setPuntuacion($valoracionData['puntuacion']);
            
            $manager->persist($valoracion);
        }
    }
    
    private function loadComentarios(ObjectManager $manager, array $documentos, array $users): void
    {
        $comentariosData = [
            // [
            //     'documento' => 0, // Introducción a la programación
            //     'user' => 3, // alumno3 
            //     'texto' => '¿Podríais añadir más ejemplos sobre bucles?',
            //     'fecha' => new \DateTime('-5 days')
            // ],
            // [
            //     'documento' => 0, // Introducción a la programación
            //     'user' => 1, // profesor
            //     'texto' => 'Añadiré más ejemplos en la próxima versión.',
            //     'fecha' => new \DateTime('-3 days')
            // ],
            // [
            //     'documento' => 3, // Ejemplo de API REST
            //     'user' => 2, // alumno1
            //     'texto' => '¿Qué versión de Laravel se usa en este ejemplo?',
            //     'fecha' => new \DateTime('-10 days')
            // ],
            // [
            //     'documento' => 3, // Ejemplo de API REST
            //     'user' => 3, // alumno2 (autor)
            //     'texto' => 'Es la versión 10 de Laravel',
            //     'fecha' => new \DateTime('-9 days')
            // ]
        ];
        
        foreach ($comentariosData as $comentarioData) {
            $comentario = new Comentario();
            $comentario->setDocumento($documentos[$comentarioData['documento']]);
            $comentario->setUser($users[$comentarioData['user']]);
            $comentario->setComentario($comentarioData['texto']);
            $comentario->setFecha($comentarioData['fecha']);
            
            $manager->persist($comentario);
        }
    }
}