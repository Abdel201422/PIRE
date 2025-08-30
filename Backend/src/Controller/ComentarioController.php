<?php

namespace App\Controller;

use App\Entity\Comentario;
use App\Repository\ComentarioRepository;
use App\Repository\DocumentoRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class ComentarioController extends AbstractController
{
    // Listar todos los comentarios
    #[Route('/api/comentario/listar', name: 'api_comentario_listar', methods: ['GET'])]
    public function listar(ComentarioRepository $comentarioRepository): JsonResponse
    {
        $comentarios = $comentarioRepository->findAll();
        $data = [];

        foreach ($comentarios as $comentario) {
            $data[] = [
                'id' => $comentario->getId(),
                'comentario' => $comentario->getComentario(),
                'fecha' => $comentario->getFecha()?->format('Y-m-d H:i'),
                'documento' => $comentario->getDocumento()?->getTitulo(),
                'user_email' => $comentario->getUser()?->getEmail(),
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    // Obtener un comentario por ID
    #[Route('/api/comentario/documento/{id}', name: 'api_comentario_por_documento', methods: ['GET'])]
    public function listarPorDocumento(int $id, ComentarioRepository $comentarioRepository, DocumentoRepository $documentoRepository): JsonResponse
    {
        // Verificar si el documento existe
        $documento = $documentoRepository->find($id);
        if (!$documento) {
            return $this->json(['error' => 'Documento no encontrado'], Response::HTTP_NOT_FOUND);
        }

        // Obtener los comentarios asociados al documento
        $comentarios = $comentarioRepository->findBy(['documento' => $documento],['fecha' => 'DESC']);

        // Formatear los datos para la respuesta
        $data = [];
        foreach ($comentarios as $comentario) {
            $data[] = [
                'id' => $comentario->getId(),
                'comentario' => $comentario->getComentario(),
                'fecha' => $comentario->getFecha()?->format('Y-m-d H:i:s'),
                'documento' => [
                    'id' => $comentario->getDocumento()?->getId(),
                    'titulo' => $comentario->getDocumento()?->getTitulo(),
                ],
                'user' => [
                    'id' => $comentario->getUser()?->getId(),
                    'nombre' => $comentario->getUser()?->getNombre(),
                    'avatar' => $comentario->getUser()?->getAvatar(),
                ],
            ];
        }

        return $this->json($data, Response::HTTP_OK);
}

    // Crear un nuevo comentario
    #[Route('/api/comentario/crear', name: 'api_comentario_crear', methods: ['POST'])]
    public function crear(Request $request, EntityManagerInterface $em, DocumentoRepository $docRepo, UserRepository $userRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['comentario'], $data['documento_id'], $data['user_id'])) {
            return $this->json(['error' => 'Datos incompletos'], Response::HTTP_BAD_REQUEST);
        }

        $documento = $docRepo->find($data['documento_id']);
        $user = $userRepo->find($data['user_id']);

        if (!$documento || !$user) {
            return $this->json(['error' => 'Documento o usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $comentario = new Comentario();
        $comentario->setComentario($data['comentario']);
        $comentario->setDocumento($documento);
        $comentario->setUser($user);
        $comentario->setFecha(new \DateTime());

        $em->persist($comentario);
        $em->flush();

        return $this->json([
            'message' => 'Comentario creado exitosamente',
        ], Response::HTTP_CREATED);
    }

    // Editar un comentario
    #[Route('/api/comentario/edit/{id}', name: 'api_comentario_edit', methods: ['PUT'])]
    public function edit(Request $request, Comentario $comentario, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['comentario'])) {
            $comentario->setComentario($data['comentario']);
        }
        if (isset($data['fecha'])) {
            $comentario->setFecha(new \DateTime($data['fecha']));
        }

        $em->flush();

        return $this->json(['message' => 'Comentario actualizado exitosamente'], Response::HTTP_OK);
    }

    // Eliminar un comentario
    #[Route('/api/comentario/delete/{id}', name: 'api_comentario_delete', methods: ['DELETE'])]
    public function delete(Comentario $comentario, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($comentario);
        $em->flush();

        return $this->json(['message' => 'Comentario eliminado exitosamente'], Response::HTTP_OK);
    }
}
