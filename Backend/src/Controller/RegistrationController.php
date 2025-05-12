<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;

#[Route('/api')]
class RegistrationController extends AbstractController
{
    public function __construct(private EmailVerifier $emailVerifier)
    {
    }

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data || !isset($data['email'], $data['password'], $data['nombre'])) {
                return new JsonResponse(['error' => 'Datos incompletos'], 400);
            }

            $user = new User();
            $user->setEmail($data['email']);
            $user->setNombre($data['nombre']);
            $user->setApellido($data['apellido'] ?? '');
            $user->setRoles(['ROLE_USER']); // Por defecto, asignamos el rol de usuario
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            $entityManager->persist($user);
            $entityManager->flush();

            // Generar el avatar automáticamente
            $this->generarAvatar($user, $entityManager);

            return new JsonResponse(['message' => 'Usuario registrado exitosamente'], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error interno: ' . $e->getMessage()], 500);
        }
    } 

    // Función para generar el avatar
    // Esta función crea un avatar con las iniciales del usuario y un color de fondo aleatorio
    // y lo guarda en la carpeta del usuario
    private function generarAvatar(User $user, EntityManagerInterface $entityManager): void
{
    // Obtener las iniciales del usuario
    $nombre = $user->getNombre();
    $apellido = $user->getApellido();
    $iniciales = strtoupper(mb_substr($nombre, 0, 1) . mb_substr($apellido, 0, 1));

    // Generar un color de fondo aleatorio
    $color = sprintf('#%06X', mt_rand(0, 0xFFFFFF));

    // Generar el contenido SVG como una cadena
        $svgContent = '
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                <circle cx="25" cy="25" r="40" fill="' . $color . '" />
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24" fill="white">' . $iniciales . '</text>
            </svg>';

    // Crear la carpeta del usuario si no existe
    $userDir = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $user->getId();
    if (!is_dir($userDir)) {
        mkdir($userDir, 0775, true);
    }
    
    $avatarDir = $userDir . '/avatar';
    if (!is_dir($avatarDir)) {
        mkdir($avatarDir, 0775, true);
    }

    // Guardar la imagen en la carpeta del usuario
    $avatarPath = 'uploads/' . $user->getId() . '/avatar/avatar.svg';
    $fullPath = $this->getParameter('kernel.project_dir') . '/public/' . $avatarPath;
    file_put_contents($fullPath, $svgContent);

    // Guardar la ruta del avatar en la base de datos
    $user->setAvatar($avatarPath);
    $entityManager->flush();
}

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, TranslatorInterface $translator, UserRepository $userRepository): Response
    {
        $id = $request->query->get('id');

        if (null === $id) {
            return $this->redirectToRoute('app_register');
        }

        $user = $userRepository->find($id);

        if (null === $user) {
            return $this->redirectToRoute('app_register');
        }

        // validate email confirmation link, sets User::isVerified=true and persists
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $translator->trans($exception->getReason(), [], 'VerifyEmailBundle'));

            return $this->redirectToRoute('app_register');
        }

        // @TODO Change the redirect on success and handle or remove the flash message in your templates
        $this->addFlash('success', 'Your email address has been verified.');

        return $this->redirectToRoute('app_register');
    }
}
