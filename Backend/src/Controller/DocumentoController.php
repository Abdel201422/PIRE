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
use Symfony\Component\HttpFoundation\JsonResponse;


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
    public function edit(Request $request, Documento $documento, EntityManagerInterface $entityManager, ParameterBagInterface $params, SluggerInterface $slugger): Response
    {
        $form = $this->createForm(DocumentoType::class, $documento, [
            'is_edit' => true,
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $archivoRaw = $request->files;
            if ($archivoRaw->get('documento') && $archivoRaw->get('documento')['ruta_archivo']) {
                $targetPath = $params->get('app_path_files');
                $service = new FileUploader($targetPath, $slugger);
                $archivo_db = $service->upload($archivoRaw->get('documento')['ruta_archivo']);
                $documento->setRutaArchivo($targetPath . $archivo_db);
            }
            
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

    // Método para obtener los mejores documentos
    #[Route('/api/documentos/mejores', name: 'api_documentos', methods: ['GET'])]
    public function mejoresDocumentos(DocumentoRepository $documentoRepository): JsonResponse
    {
        $documentos = $documentoRepository->findBy(
            [],
            ['id' => 'DESC'],
            3);

        // Si no hay documentos
        if (!$documentos) {
            return new JsonResponse(['message' => 'No se encontraron documentos'], 404);
        }

        $data = [];
        foreach ($documentos as $documento) {
            $data[] = [
                'id' => $documento->getId(),
                'titulo' => $documento->getTitulo(),
                'ruta' => $documento->getRutaArchivo(),
                'asignatura' => $documento->getAsignatura()->getNombre(),
                'puntuacion' => $documento->calcularMediaValoraciones(),
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    #[Route('/api/documentos/upload', name: 'upload_document', methods: ['POST'])]
    public function upload(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {

        $user = $this->getUser();

        if (!$user instanceof \App\Entity\User) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], 401);
        }

        $descripcion = $request->request->get('descripcion');
        $asignaturaId = $request->request->get('asignatura');
        $file = $request->files->get('file');

        // Crear carpeta del usuario
        $userDir = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $user->getId();
        if (!is_dir($userDir)) {
            mkdir($userDir, 0777, true);
        }

        // Verificar si el archivo ya existe
        $originalFileName = $file->getClientOriginalName(); // Nombre original del archivo con extensión
        $filePath = $userDir . '/' . $originalFileName;

        if (file_exists($filePath)) {
            return new JsonResponse(['error' => 'Ya existe un archivo con el mismo nombre'], 409); // Código 409: Conflicto
        }
        
        // Guardar el archivo
        try {
            $file->move($userDir, $originalFileName);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error al guardar el archivo: ' . $e->getMessage()], 500);
        }
        $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME); // Nombre original del archivo sin extensión
        /*$fileName = uniqid() . '.' . $file->guessExtension(); // Nombre único para evitar colisiones
        $file->move($userDir, $fileName); */

        // Obtener el tipo MIME del archivo
        $tipoArchivo = $file->getClientMimeType();

        // Crear el documento en la base de datos
        $documento = new Documento();
        $asignatura = $entityManager->getRepository(Asignatura::class)->find($asignaturaId);
        $documento->setAsignatura($asignatura); // Asignatura debe ser un objeto de la entidad Asignatura
        $documento->setTitulo($originalFileName);
        $documento->setDescripcion($descripcion);
        $documento->setRutaArchivo('uploads/' . $user->getId() . '/' . $originalFileName);
        //$documento->setRutaArchivo('uploads/' . $user->getId() . '/' . $fileName);
        $documento->setUser($user);
        $documento->setFechaSubida(new \DateTime());
        $documento->setTipoArchivo($tipoArchivo);

        $entityManager->persist($documento);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Documento subido exitosamente'], 201);
        /* $user = $this->getUser();

        if (!$user instanceof \App\Entity\User) {
            return new JsonResponse(['error' => 'Usuario nddo autenticado'], 401);
        }
 */
        /* $file = $request->files->get('file');

        if (!$file) {
            return new JsonResponse(['error' => 'No se ha enviado ningún archivo'], 400);
        }

        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads';
        $fileName = uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($uploadDir, $fileName);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error al subir el archivo: ' . $e->getMessage()], 500);
        }

        return new JsonResponse(['message' => 'Archivo subido exitosamente', 'fileName' => $fileName], 201); */
    }

    #[Route('/api/documentos/download/{id}', name: 'download_document', methods: ['GET'])]
    public function download(int $id, DocumentoRepository $documentoRepository): Response
    {
        // Buscar el documento por ID
        $documento = $documentoRepository->find($id);

        if (!$documento) {
            return new JsonResponse(['error' => 'Documento no encontrado'], 404);
        }

        // Obtener la ruta del archivo
        $filePath = $this->getParameter('kernel.project_dir') . '/public/' . $documento->getRutaArchivo();

        if (!file_exists($filePath)) {
            return new JsonResponse(['error' => 'El archivo no existe en el servidor'], 404);
        }

        // Retornar el archivo para su descarga
        return $this->file($filePath, $documento->getTitulo() . '.' . pathinfo($filePath, PATHINFO_EXTENSION));
    }
}
