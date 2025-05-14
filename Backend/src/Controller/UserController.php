<?php

namespace App\Controller;

use App\Entity\User;

use App\Form\UserType;
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
    #[Route(name: 'app_user_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): Response
    {
        return $this->render('user/index.html.twig', [
            'users' => $userRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_user_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($user);
            $entityManager->flush();

            return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('user/new.html.twig', [
            'user' => $user,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
    public function show(User $user): Response
    {
        return $this->render('user/show.html.twig', [
            'user' => $user,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_user_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, User $user, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('user/edit.html.twig', [
            'user' => $user,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_user_delete', methods: ['POST'])]
    public function delete(Request $request, User $user, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($user);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
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

}
