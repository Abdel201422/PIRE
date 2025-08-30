<?php

namespace App\Controller;

use App\Entity\Ciclo;
use App\Form\CicloType;
use App\Repository\CicloRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;


final class CicloController extends AbstractController
{
    #[Route('/api/ciclos', name: 'api_ciclos', methods: ['GET', 'POST'])]
    public function getCiclos(Request $request, CicloRepository $cicloRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        // Si es una petición GET, devolver todos los ciclos
        if ($request->isMethod('GET')) {
            $ciclos = $cicloRepository->findAll();
            $data = [];

            foreach ($ciclos as $ciclo) {
                $data[] = [
                    'cod_ciclo' => $ciclo->getCodCiclo(),
                    'nombre' => $ciclo->getNombre(),
                ];
            }

            return $this->json($data, Response::HTTP_OK);
        }
        
        // Si es una petición POST, crear un nuevo ciclo
        if ($request->isMethod('POST')) {
            $data = json_decode($request->getContent(), true);

            // Validación básica
            if (empty($data['cod_ciclo']) || empty($data['nombre'])) {
                return $this->json(['error' => 'Faltan datos obligatorios (cod_ciclo, nombre)'], Response::HTTP_BAD_REQUEST);
            }

            // Validar longitud del código (exactamente 3 caracteres)
            if (strlen($data['cod_ciclo']) != 3) {
                return $this->json(['error' => 'El código del ciclo debe tener exactamente 3 caracteres'], Response::HTTP_BAD_REQUEST);
            }

            // Comprobar si ya existe
            if ($cicloRepository->findOneBy(['cod_ciclo' => $data['cod_ciclo']])) {
                return $this->json(['error' => 'Ya existe un ciclo con ese código'], Response::HTTP_CONFLICT);
            }

            // Crear y guardar el nuevo ciclo
            $ciclo = (new Ciclo())
                ->setCodCiclo($data['cod_ciclo'])
                ->setNombre($data['nombre'])
                ->setDescripcion($data['descripcion'] ?? null);

            $entityManager->persist($ciclo);
            $entityManager->flush();

            // Crear automáticamente dos cursos para este ciclo
            $this->createDefaultCourses($ciclo, $entityManager);

            return $this->json([
                'message' => 'Ciclo creado correctamente',
                'ciclo' => [
                    'cod_ciclo' => $ciclo->getCodCiclo(),
                    'nombre' => $ciclo->getNombre(),
                    'descripcion' => $ciclo->getDescripcion()
                ]
            ], Response::HTTP_CREATED);
        }

        
        return new JsonResponse(['error' => 'Método no permitido'], Response::HTTP_METHOD_NOT_ALLOWED);
    }

    #[Route('/api/ciclos/{codCiclo}/cursos', name: 'api_cursos_por_ciclos', methods: ['GET'])]
    public function getCursosPorCiclo(string $codCiclo, CicloRepository $cicloRepository): JsonResponse
    {
        $ciclo = $cicloRepository->findOneBy(['cod_ciclo' => $codCiclo]);
        
        if (!$ciclo) {
            return new JsonResponse(['error' => 'Ciclo no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $cursos = $ciclo->getCursos();

        $data = [];
        foreach ($cursos as $curso) {
            $data[] = [
                'cod_curso' => $curso->getCodCurso(),
                'nombre' => $curso->getNombre(),
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    #[Route('/api/ciclos/completos', name: 'api_ciclos_completos', methods: ['GET'])]
    public function getCiclosCompletos(CicloRepository $cicloRepository): JsonResponse
    {
        $ciclos = $cicloRepository->findAll();
        $data = [];

        foreach ($ciclos as $ciclo) {
            $cursosData = [];
            foreach ($ciclo->getCursos() as $curso) {
                $asignaturasData = [];
                foreach ($curso->getAsignaturas() as $asignatura) {
                    $asignaturasData[] = [
                        'codigo' => $asignatura->getCodigo(), // Usar "codigo" como identificador
                        'nombre' => $asignatura->getNombre(),
                        'curso' => $curso->getNombre(), // Indica a qué curso pertenece
                    ];
                }

                $cursosData[] = [
                    'cod_curso' => $curso->getCodCurso(), // Usar "cod_curso" como identificador
                    'nombre' => $curso->getNombre(),
                    'asignaturas' => $asignaturasData,
                ];
            }

            $data[] = [
                'cod_ciclo' => $ciclo->getCodCiclo(), // Usar "cod_ciclo" como identificador
                'nombre' => $ciclo->getNombre(),
                'descripcion' => $ciclo->getDescripcion(),
                'cursos' => $cursosData,
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    #[Route('/api/ciclos/{codCiclo}', name: 'api_ciclo_update_delete', methods: ['PUT', 'DELETE'])]
public function updateDeleteCiclo(
    string $codCiclo,
    Request $request,
    CicloRepository $cicloRepository,
    EntityManagerInterface $entityManager
): JsonResponse {
    $ciclo = $cicloRepository->findOneBy(['cod_ciclo' => $codCiclo]);

    if (!$ciclo) {
        return $this->json(['error' => 'Ciclo no encontrado'], Response::HTTP_NOT_FOUND);
    }

    if ($request->isMethod('DELETE')) {
        $entityManager->remove($ciclo);
        $entityManager->flush();

        return $this->json(['message' => 'Ciclo eliminado correctamente'], Response::HTTP_OK);
    }

    if ($request->isMethod('PUT')) {
        $data = json_decode($request->getContent(), true);

        if (empty($data['nombre'])) {
            return $this->json(['error' => 'Falta el nombre del ciclo'], Response::HTTP_BAD_REQUEST);
        }

        $ciclo->setNombre($data['nombre']);
        $ciclo->setDescripcion($data['descripcion'] ?? null);

        $entityManager->flush();

        return $this->json([
            'message' => 'Ciclo actualizado correctamente',
            'ciclo' => [
                'cod_ciclo' => $ciclo->getCodCiclo(),
                'nombre' => $ciclo->getNombre(),
                'descripcion' => $ciclo->getDescripcion()
            ]
        ], Response::HTTP_OK);
    }

    return $this->json(['error' => 'Método no permitido'], Response::HTTP_METHOD_NOT_ALLOWED);
}

    /**
     * Crea automáticamente dos cursos para un ciclo recién creado
     */
    private function createDefaultCourses(Ciclo $ciclo, EntityManagerInterface $entityManager): void
    {
        // Curso 1: Primero
        $curso1 = new \App\Entity\Curso();
        $curso1->setCodCurso($ciclo->getCodCiclo() . '1'); // Ejemplo: DAW1
        $curso1->setNombre('1º Curso '. $ciclo->getNombre());
        $curso1->setCiclo($ciclo);
        $entityManager->persist($curso1);
        
        // Curso 2: Segundo
        $curso2 = new \App\Entity\Curso();
        $curso2->setCodCurso($ciclo->getCodCiclo() . '2'); // Ejemplo: DAW2
        $curso2->setNombre('2º Curso '. $ciclo->getNombre());
        $curso2->setCiclo($ciclo);
        $entityManager->persist($curso2);
        
        $entityManager->flush();
    }

}
