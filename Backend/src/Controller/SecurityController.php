<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SecurityController extends AbstractController
{
    #[Route(path: '/api/login', name: 'api_login', methods: ['POST'])]
    
    public function login(Request $request, AuthenticationUtils $authenticationUtils): JsonResponse
{
    // Si ya estoy logueado, devuelvo la URL del dashboard
    if ($this->getUser()) {
        return new JsonResponse([
            'redirect' => $this->generateUrl('dashboard'),
        ], 200);
    }

    // Obtener el posible error
    $error = $authenticationUtils->getLastAuthenticationError();
    $lastUsername = $authenticationUtils->getLastUsername();

    if ($error) {
        return new JsonResponse([
            'error'         => $error->getMessageKey(),
            'last_username' => $lastUsername,
        ], 401);
    }

    // Aquí Symfony ya habría autenticado por el firewall, así que:
    return new JsonResponse([
        'message'  => 'Inicio de sesión exitoso',
        'redirect' => $this->generateUrl('dashboard'),
    ], 200);
}

    #[Route(path: '/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): void
    {
        throw new \LogicException('Este método será interceptado por la configuración de cierre de sesión en el firewall.');
    }
}