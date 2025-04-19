<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    #[Route(path: '/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, AuthenticationUtils $authenticationUtils): JsonResponse
    {
        // Si el usuario ya está autenticado, devolver un mensaje
        if ($this->getUser()) {
            return new JsonResponse(['message' => 'Ya estás autenticado'], 200);
        }

        // Obtener el error de inicio de sesión si existe
        $error = $authenticationUtils->getLastAuthenticationError();

        // Último nombre de usuario ingresado
        $lastUsername = $authenticationUtils->getLastUsername();

        if ($error) {
            return new JsonResponse([
                'error' => $error->getMessageKey(),
                'last_username' => $lastUsername,
            ], 401);
        }

        return new JsonResponse(['message' => 'Inicio de sesión exitoso'], 200);
    }

    #[Route(path: '/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): void
    {
        throw new \LogicException('Este método será interceptado por la configuración de cierre de sesión en el firewall.');
    }
}