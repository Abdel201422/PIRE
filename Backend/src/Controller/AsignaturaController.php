<?php

namespace App\Controller;

use App\Repository\AsignaturaRepository; // Importa el repositorio correctamente
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/asignaturas')]
final class AsignaturaController extends AbstractController
{
    #[Route('/get', name: 'get_asignaturas', methods: ['GET'])]
    public function getAsignaturas(AsignaturaRepository $asignaturaRepository): JsonResponse
    {
        $asignaturas = $asignaturaRepository->findAll();

        $data = array_map(function ($asignatura) {
            return [
                'id' => $asignatura->getCodigo(), // Usa el método correcto para obtener el ID
                'nombre' => $asignatura->getNombre(),
            ];
        }, $asignaturas);

        return new JsonResponse($data);
    }
}