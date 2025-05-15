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
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;    

final class UserController extends AbstractController
{
    #[Route('/api/user/profile/image', name: 'api_user_profile_image_update', methods: ['POST'])]
    public function updateProfileImage(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
        $file = $request->files->get('image');
        if (!$file) {
            return new JsonResponse(['error' => 'No se ha enviado ningún archivo'], 400);
        }
        // Crear carpeta del usuario
        $userDir = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $user->getId();
        if (!is_dir($userDir)) {
            mkdir($userDir, 0777, true);
        }
        // Nombre único para evitar colisiones
        $fileExt = $file->guessExtension();
        $fileName = 'avatar_' . uniqid() . '.' . $fileExt;
        $filePath = $userDir . '/' . $fileName;
        // Guardar archivo
        try {
            $file->move($userDir, $fileName);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error al guardar la imagen: ' . $e->getMessage()], 500);
        }
        // Eliminar imagen anterior si existía
        $oldAvatar = $user->getAvatar();
        if ($oldAvatar && file_exists($this->getParameter('kernel.project_dir') . '/public/' . $oldAvatar)) {
            @unlink($this->getParameter('kernel.project_dir') . '/public/' . $oldAvatar);
        }
        // Guardar ruta relativa
        $user->setAvatar('uploads/' . $user->getId() . '/' . $fileName);
        $entityManager->flush();
        return new JsonResponse([
            'success' => true,
            'avatar' => $user->getAvatar()
        ]);
    }

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

    #[Route('/api/user/profile', name: 'api_user_profile_update', methods: ['PUT', 'POST'])]
    public function updateProfile(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
        $data = json_decode($request->getContent(), true);
        if (isset($data['nombre'])) $user->setNombre($data['nombre']);
        if (isset($data['apellido'])) $user->setApellido($data['apellido']);
        if (isset($data['email'])) $user->setEmail($data['email']);
        $entityManager->flush();
        return new JsonResponse(['success' => true, 'user' => [
            'nombre' => $user->getNombre(),
            'apellido' => $user->getApellido(),
            'email' => $user->getEmail(),
        ]]);
    }

    #[Route('/api/user/change-password', name: 'api_user_change_password', methods: ['POST'])]
public function changePassword(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'No autenticado'], 401);
    }
    $data = json_decode($request->getContent(), true);
    $currentPassword = $data['currentPassword'] ?? null;
    $newPassword = $data['newPassword'] ?? null;

    if (!$currentPassword || !$newPassword) {
        return new JsonResponse(['error' => 'Datos incompletos'], 400);
    }

    if (!$passwordHasher->isPasswordValid($user, $currentPassword)) {
        return new JsonResponse(['error' => 'La contraseña actual es incorrecta'], 400);
    }

    if (strlen($newPassword) < 6) {
        return new JsonResponse(['error' => 'La nueva contraseña debe tener al menos 6 caracteres'], 400);
    }

    $user->setPassword($passwordHasher->hashPassword($user, $newPassword));
    $entityManager->flush();

    return new JsonResponse(['success' => true]);
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
