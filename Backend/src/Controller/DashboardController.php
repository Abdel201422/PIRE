<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity\User;
use App\Repository\DocumentoRepository;
use App\Repository\ComentarioRepository;
use App\Repository\ValoracionRepository;

class DashboardController extends AbstractController
{
    private $documentoRepository;

    public function __construct(DocumentoRepository $documentoRepository, ComentarioRepository $comentarioRepository, ValoracionRepository $valoracionRepository)
    {
        $this->comentarioRepository = $comentarioRepository;
        $this->documentoRepository = $documentoRepository;
        $this->valoracionRepository = $valoracionRepository;
    }
    
    #[Route('/api/dashboard', name: 'api_dashboard', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof \App\Entity\User) {
            return new JsonResponse(['error' => 'Usuario no autenticado o tipo incorrecto'], 401);
        }

        $userNumDocumentos = $this->documentoRepository->count(['user' => $user]);
        $userNumComentarios = $this->comentarioRepository->count(['user' => $user]);
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

        // Obtener el último documento subido por el usuario
        $ultimoDocumento = $this->documentoRepository->findOneBy(['user' => $user], ['fecha_subida' => 'DESC']);
        $fecha = $ultimoDocumento->getFechaSubida();
        $fechaAhora = new \DateTime();

        $diff = $fechaAhora->diff($fecha);
        $dias = $diff->days;

        $textoTiempo = '';
        
        if ($dias === 0) { $textoTiempo = 'hoy';
        } elseif ($dias === 1) { $textoTiempo = 'hace 1 día';
        } else { $textoTiempo = 'hace ' . $dias . ' días';
        }

        if ($ultimoDocumento) {
            $ultimoDoc = [
                'titulo' => $ultimoDocumento->getTitulo(),
                'fechaSubida' => $textoTiempo,
                ];
        }

        // Obtener la última valoración
        $ultimaValoracion = $this->valoracionRepository->findUltimaPuntuacionRecibida($user);

        return new JsonResponse([
            'user' => [
                'id' => $user->getId(),
                'nombre' => $user->getNombre(),
                'apellido' => $user->getApellido(),
                'nombreCompleto' => $user->getNombre() . ' ' . $user->getApellido(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
                'nDocumentos' => $userNumDocumentos,
                'nComentarios' => $userNumComentarios,
                'avatar' => $user->getAvatar(),
                'puntuacion' => $puntuacionPromedio,
                'ultimoDocumento' => $ultimoDoc,
                'ultimaValoracion' => $ultimaValoracion->getPuntuacion(),
            ]
        ]);
    }
}