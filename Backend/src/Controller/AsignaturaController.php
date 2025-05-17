<?php

namespace App\Controller;

use App\Entity\Asignatura;
use App\Entity\Ciclo;
use App\Entity\Curso;
use App\Repository\AsignaturaRepository;
use App\Repository\CursoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class AsignaturaController extends AbstractController
{
    #[Route('/asignaturas/get', name: 'get_asignaturas', methods: ['GET'])]
    public function getAsignaturas(AsignaturaRepository $asignaturaRepository): JsonResponse
    {
        $asignaturas = $asignaturaRepository->findAll();

        $data = array_map(function ($asignatura) {
            return [
                'codigo' => $asignatura->getCodigo(),
                'nombre' => $asignatura->getNombre(),
            ];
        }, $asignaturas);

        return new JsonResponse($data);
    }

    #[Route('/api/asignaturas/ciclo/{id}', name: 'api_asignaturas_por_ciclo', methods: ['GET'])]
    public function getAsignaturasPorCiclo(Ciclo $ciclo): JsonResponse
    {
        $data = [];

        // Recorrer los cursos del ciclo
        foreach ($ciclo->getCursos() as $curso) {
            foreach ($curso->getAsignaturas() as $asignatura) {
                $data[] = [
                    'id' => $asignatura->getCodigo(),
                    'nombre' => $asignatura->getNombre(),
                    'curso' => $curso->getNombre(), // Indica a qué curso pertenece
                ];
            }
        }

        return $this->json($data, Response::HTTP_OK);
    }

    #[Route('/api/asignaturas', name: 'api_asignaturas', methods: ['GET', 'POST'])]
    public function apiAsignaturas(
        Request $request,
        AsignaturaRepository $asignaturaRepository,
        CursoRepository $cursoRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // Si es una petición GET, devolver todas las asignaturas
        if ($request->isMethod('GET')) {
            $asignaturas = $asignaturaRepository->findAll();
            $data = [];

            foreach ($asignaturas as $asignatura) {
                $data[] = [
                    'codigo' => $asignatura->getCodigo(),
                    'nombre' => $asignatura->getNombre(),
                    'curso' => [
                        'cod_curso' => $asignatura->getCurso()->getCodCurso(),
                        'nombre' => $asignatura->getCurso()->getNombre()
                    ],
                    'documentos_count' => count($asignatura->getDocumentos())
                ];
            }

            return $this->json($data, Response::HTTP_OK);
        }
        
        // Si es una petición POST, crear una nueva asignatura
        if ($request->isMethod('POST')) {
            $data = json_decode($request->getContent(), true);

            // Validación básica
            if (empty($data['codigo']) || empty($data['nombre']) || empty($data['curso_id'])) {
                return $this->json(['error' => 'Faltan datos obligatorios (codigo, nombre, curso_id)'], Response::HTTP_BAD_REQUEST);
            }

            // Comprobar si ya existe
            if ($asignaturaRepository->findOneBy(['codigo' => $data['codigo']])) {
                return $this->json(['error' => 'Ya existe una asignatura con ese código'], Response::HTTP_CONFLICT);
            }

            // Buscar el curso
            $curso = $cursoRepository->findOneBy(['cod_curso' => $data['curso_id']]);
            if (!$curso) {
                return $this->json(['error' => 'El curso especificado no existe'], Response::HTTP_BAD_REQUEST);
            }

            // Crear y guardar la nueva asignatura
            $asignatura = (new Asignatura())
                ->setCodigo($data['codigo'])
                ->setNombre($data['nombre'])
                ->setCurso($curso);

            $entityManager->persist($asignatura);
            $entityManager->flush();

            return $this->json([
                'message' => 'Asignatura creada correctamente',
                'asignatura' => [
                    'codigo' => $asignatura->getCodigo(),
                    'nombre' => $asignatura->getNombre(),
                    'curso' => [
                        'cod_curso' => $curso->getCodCurso(),
                        'nombre' => $curso->getNombre()
                    ]
                ]
            ], Response::HTTP_CREATED);
        }

        return new JsonResponse(['error' => 'Método no permitido'], Response::HTTP_METHOD_NOT_ALLOWED);
    }

    #[Route('/api/asignaturas/{codigo}', name: 'api_asignatura_update_delete', methods: ['PUT', 'DELETE'])]
    public function updateDeleteAsignatura(
        string $codigo,
        Request $request,
        AsignaturaRepository $asignaturaRepository,
        CursoRepository $cursoRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $asignatura = $asignaturaRepository->findOneBy(['codigo' => $codigo]);

        if (!$asignatura) {
            return $this->json(['error' => 'Asignatura no encontrada'], Response::HTTP_NOT_FOUND);
        }

        if ($request->isMethod('DELETE')) {
            $entityManager->remove($asignatura);
            $entityManager->flush();

            return $this->json(['message' => 'Asignatura eliminada correctamente'], Response::HTTP_OK);
        }

        if ($request->isMethod('PUT')) {
            $data = json_decode($request->getContent(), true);

            if (empty($data['nombre'])) {
                return $this->json(['error' => 'Falta el nombre de la asignatura'], Response::HTTP_BAD_REQUEST);
            }

            $asignatura->setNombre($data['nombre']);

            // Si se proporciona un nuevo curso, actualizar la relación
            if (!empty($data['curso_id'])) {
                $curso = $cursoRepository->findOneBy(['cod_curso' => $data['curso_id']]);
                if (!$curso) {
                    return $this->json(['error' => 'El curso especificado no existe'], Response::HTTP_BAD_REQUEST);
                }
                $asignatura->setCurso($curso);
            }

            $entityManager->flush();

            return $this->json([
                'message' => 'Asignatura actualizada correctamente',
                'asignatura' => [
                    'codigo' => $asignatura->getCodigo(),
                    'nombre' => $asignatura->getNombre(),
                    'curso' => [
                        'cod_curso' => $asignatura->getCurso()->getCodCurso(),
                        'nombre' => $asignatura->getCurso()->getNombre()
                    ]
                ]
            ], Response::HTTP_OK);
        }

        return $this->json(['error' => 'Método no permitido'], Response::HTTP_METHOD_NOT_ALLOWED);
    }
}