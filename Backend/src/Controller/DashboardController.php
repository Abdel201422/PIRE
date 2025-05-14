<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity\User;
use App\Repository\DocumentoRepository;

class DashboardController extends AbstractController
{
    private $documentoRepository;

    public function __construct(DocumentoRepository $documentoRepository)
    {
        $this->documentoRepository = $documentoRepository;
    }

    #[Route('/api/dashboard', name: 'api_dashboard', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof \App\Entity\User) {
            return new JsonResponse(['error' => 'Usuario no autenticado o tipo incorrecto'], 401);
        }

        $userNumDocumentos = $this->documentoRepository->count(['user' => $user]);
        /* $documentos = $this->documentoRepository->findAll();

        // Mapear los documentos para devolverlos en el JSON
        $documentosData = array_map(function ($documento) {
            return [
                'id' => $documento->getId(),
                'titulo' => $documento->getTitulo(),
                'fechaSubida' => $documento->getFechaSubida()->format('Y-m-d H:i:s'),
            ];
        }, $documentos); */

        // Calcular la puntuación del usuario
        $valoraciones = $user->getValoraciones();
        $puntuacionPromedio = 0;

        if (!$valoraciones->isEmpty()) {
            $total = 0;
            foreach ($valoraciones as $valoracion) {
                $total += $valoracion->getPuntuacion();
            }

            $puntuacionPromedio = $total / count($valoraciones);
            $puntuacionPromedio = round($puntuacionPromedio, 1);
        }

        return new JsonResponse([
            'user' => [
                'id' => $user->getId(),
                'nombre' => $user->getNombre(),
                'nombreCompleto' => $user->getNombre() . ' ' . $user->getApellido(),
                'email' => $user->getEmail(),
                'avatar' => $user->getAvatar(),
                'roles' => $user->getRoles(),
                'puntuacion' => $puntuacionPromedio,
                'nDocumentos' => $userNumDocumentos
            ]
        ]);
    }
}