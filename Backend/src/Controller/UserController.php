<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;

final class UserController extends AbstractController
{
    // Listar todos los usuarios
    #[Route('/api/users', name: 'api_users_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    // Crear un nuevo usuario
    #[Route('/api/users', name: 'api_users_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'], $data['roles'])) {
            return $this->json(['error' => 'Datos incompletos'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
        $user->setRoles($data['roles']);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'Usuario creado exitosamente'], Response::HTTP_CREATED);
    }

    // Mostrar un usuario por ID
    #[Route('/api/users/{id}', name: 'api_users_show', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ], Response::HTTP_OK);
    }

    // Actualizar un usuario
    #[Route('/api/users/{id}/edit', name: 'api_users_update', methods: ['PUT'])]
    public function update(Request $request, User $user, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        if (isset($data['password'])) {
            $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
        }

        if (isset($data['roles'])) {
            $user->setRoles($data['roles']);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Usuario actualizado exitosamente'], Response::HTTP_OK);
    }

    // Eliminar un usuario
    #[Route('/api/users/{id}/delete', name: 'api_users_delete', methods: ['DELETE'])]
    public function delete(User $user, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(['message' => 'Usuario eliminado exitosamente'], Response::HTTP_OK);
    }

    // Obtener el usuario actual
    #[Route('/api/users/me', name: 'api_user_me', methods: ['GET'])]
public function getCurrentUser(): JsonResponse
{
    $user = $this->getUser();
    if (!$user instanceof User) {
        return $this->json(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
    }

    // Añade estas 2 líneas
    $roles = $user->getRoles();
    return $this->json([
        'id' => $user->getId(),
        'email' => $user->getEmail(),
        'roles' => !empty($roles) ? $roles : ['ROLE_USER'], // <-- Modificado
    ], Response::HTTP_OK);
}
}
