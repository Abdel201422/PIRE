<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;

class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $user = $this->getUser();

       

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Usuario no autenticado o tipo incorrecto'], 401);
        }

        // Devuelve los datos del usuario en formato JSON
        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
    }
}