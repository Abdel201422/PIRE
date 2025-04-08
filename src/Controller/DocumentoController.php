<?php

namespace App\Controller;

use App\Entity\Documento;
use App\Entity\Asignatura;
use App\Form\DocumentoType;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\DocumentoRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;


#[Route('/documento')]
final class DocumentoController extends AbstractController
{
    #[Route(name: 'app_documento_index', methods: ['GET'])]
    public function index(DocumentoRepository $documentoRepository): Response
    {
        return $this->render('documento/index.html.twig', [
            'documentos' => $documentoRepository->findAll(),
        ]);
    }

    #[Route('/asignatura/{id}', name: 'app_documento_asignatura', methods: ['GET'])]
    public function documentosPorAsignatura(
        Asignatura $asignatura,
        DocumentoRepository $documentoRepository
    ): Response {
        return $this->render('documento/index.html.twig', [
            'documentos' => $documentoRepository->findByAsignatura($asignatura),
            'asignatura' => $asignatura, // Opcional: para mostrar el nombre en la plantilla
        ]);
    }

    #[Route('/new', name: 'app_documento_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, ParameterBagInterface $params, SluggerInterface $slugger): Response
    {
        $documento = new Documento();
        $form = $this->createForm(DocumentoType::class, $documento);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $archivoRaw = $request->files;
           
            $targetPath = $params->get('app_path_files');
            $service = new FileUploader($targetPath, $slugger);
            //lo que se va a guardar en la base de datos
            $archivo_db = $service->upload($archivoRaw->get('documento')['ruta_archivo']);
            $documento->setRutaArchivo($targetPath . $archivo_db);
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
