<?php

namespace App\Controller;

use App\Entity\Documento;
use App\Entity\Asignatura;
use App\Form\DocumentoType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\DocumentoRepository;

#[Route('/documento')]
final class DocumentoController extends AbstractController
{
    #[Route(name: 'app_documento_index', methods: ['GET'])]
public function index(DocumentoRepository $documentoRepository): Response
{
    $documentos = $documentoRepository->findAll();
    $data = [];
    foreach ($documentos as $documento) {
        $data[] = [
            'id' => $documento->getId(),
            'titulo' => $documento->getTitulo(),
            'ruta' => $documento->getRutaArchivo(),
            'asignatura' => $documento->getAsignatura()->getNombre(),
        ];
    }

    return $this->json(
        $data, 
        Response::HTTP_OK, // Código 200
        ['Access-Control-Allow-Origin' => '*'] // Headers aquí
    );
}

#[Route('/asignatura/{id}', name: 'app_documento_asignatura', methods: ['GET'])]
public function documentosPorAsignatura(
    Asignatura $asignatura,
    DocumentoRepository $documentoRepository
): Response {
    $documentos = $documentoRepository->findByAsignatura($asignatura);
    $data = [];
    foreach ($documentos as $documento) {
        $data[] = [
            'id' => $documento->getId(),
            'nombre' => $documento->getTitulo(),
            'ruta' => $documento->getRuta(),
            'asignatura' => $asignatura->getNombre(),
        ];
    }

    return $this->json(
        $data, 
        Response::HTTP_OK,
        ['Access-Control-Allow-Origin' => '*']
    );
}
    
    // ... otros métodos permanecen igual


    #[Route('/new', name: 'app_documento_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $documento = new Documento();
        $form = $this->createForm(DocumentoType::class, $documento);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($documento);
            $entityManager->flush();

            return $this->redirectToRoute('app_documento_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('documento/new.html.twig', [
            'documento' => $documento,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_documento_show', methods: ['GET'])]
    public function show(Documento $documento): Response
    {
        return $this->render('documento/show.html.twig', [
            'documento' => $documento,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_documento_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Documento $documento, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(DocumentoType::class, $documento);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_documento_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('documento/edit.html.twig', [
            'documento' => $documento,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_documento_delete', methods: ['POST'])]
    public function delete(Request $request, Documento $documento, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$documento->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($documento);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_documento_index', [], Response::HTTP_SEE_OTHER);
    }
}
