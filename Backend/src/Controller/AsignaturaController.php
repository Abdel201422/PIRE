<?php

namespace App\Controller;

use App\Repository\AsignaturaRepository; // Importa el repositorio correctamente
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Ciclo; // Importa la entidad Ciclo
use Symfony\Component\HttpFoundation\Response;

#[Route('/asignaturas')]
final class AsignaturaController extends AbstractController
{
    #[Route('/get', name: 'get_asignaturas', methods: ['GET'])]
    public function getAsignaturas(AsignaturaRepository $asignaturaRepository): JsonResponse
    {
        $asignaturas = $asignaturaRepository->findAll();

        $data = array_map(function ($asignatura) {
            return [
                'codigo' => $asignatura->getCodigo(), // Usa el método correcto para obtener el ID
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
                    'id' => $asignatura->getCodigo(), // Ajusta según el método correcto para obtener el ID
                    'nombre' => $asignatura->getNombre(),
                    'curso' => $curso->getNombre(), // Indica a qué curso pertenece
                ];
            }
        }

        return $this->json($data, Response::HTTP_OK);
    }
}