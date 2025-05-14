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
use App\Repository\AsignaturaRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Valoracion;

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

    // Método para obtener documentos por asignatura
    #[Route('/asignatura/{codigo}', name: 'app_documento_asignatura', methods: ['GET'])]
    public function documentosPorAsignatura(string $codigo, AsignaturaRepository $asignaturaRepository, DocumentoRepository $documentoRepository): Response
    {
         // Buscar la asignatura por el código
        $asignatura = $asignaturaRepository->findOneBy(['codigo' => $codigo]);

        if (!$asignatura) {
            return $this->json(['error' => 'Asignatura no encontrada'], Response::HTTP_NOT_FOUND);
        }

        // Buscar documentos relacionados con la asignatura
        $documentos = $documentoRepository->findBy(['asignatura' => $asignatura]);
        
        $documentosData = [];
        foreach ($documentos as $documento) {
            $documentosData[] = [
                'id' => $documento->getId(),
                'nombre' => $documento->getTitulo(),
                'descripcion' => $documento->getDescripcion(),
                'puntuacion' => $documento->calcularMediaValoraciones(),
                'fecha_subida' => $documento->getFechaSubida()->format('d/m/Y'),
                'tipo_archivo' => $documento->getTipoArchivo(),
            ];
        }
        $data = [
            'asignatura' => [
                'nombre' => $asignatura->getNombre(),
                'curso' => $asignatura->getCurso()->getNombre(),
                'ciclo' => $asignatura->getCurso()->getCiclo()->getNombre(),
            ],
            'totalDocumentos' => count($documentos),
            'documentos' => $documentosData,
        ];

        return $this->json($data, Response::HTTP_OK,['Access-Control-Allow-Origin' => '*']);
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

    // Método para consultar datos de un documento
    #[Route('/api/documentos/{id}/data', name: 'api_documento', methods: ['GET'])]
    public function getFileData(int $id, DocumentoRepository $documentoRepository): Response
    {
        // Buscar el documento por ID
        $documento = $documentoRepository->find($id);

        if (!$documento) {
            return new JsonResponse(['error' => 'Documento no encontrado'], 404);
        }

        $asignatura = $documento->getAsignatura();
        $user = $documento->getUser();

        $usuario = [
                'id' => $user->getId(),
                'nombre' => $user->getNombre(),
                'apellido' => $user->getApellido(),
                'email' => $user->getEmail(),
                'avatar' => $user->getAvatar(),
        ];

        $data = [
            'id' => $documento->getId(),
            'titulo' => $documento->getTitulo(),
            'descripcion' => $documento->getDescripcion(),
            'asignatura' => $asignatura->getNombre(),
            'curso' => $asignatura->getCurso()->getNombre(),
            'ciclo' => $asignatura->getCurso()->getCiclo()->getNombre(),
            'puntuacion' => $documento->calcularMediaValoraciones(),
            'usuario' => $usuario,
        ];

        return $this->json($data, Response::HTTP_OK);
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
        /* $documentos = $documentoRepository->findBy([], ['id' => 'DESC'], 3);

        $data = [];
        foreach ($documentos as $documento) {
            $data[] = [
                'id' => $documento->getId(),
                'titulo' => $documento->getTitulo(),
                'descripcion' => $documento->getDescripcion(),
                'asignatura' => $documento->getAsignatura()->getNombre(),
                'puntuacion' => $documento->calcularMediaValoraciones(), // Media de las valoraciones
            ];
        } */
        $documentos = $documentoRepository->findAll();

        // Calcular la media de valoraciones para cada documento
        $documentosValoracionData = [];
        foreach ($documentos as $documento) {
            $documentosValoracionData[] = [
                'id' => $documento->getId(),
                'titulo' => $documento->getTitulo(),
                'descripcion' => $documento->getDescripcion(),
                'asignatura' => $documento->getAsignatura()->getNombre(),
                'puntuacion' => $documento->calcularMediaValoraciones(),
            ];
        }

        // Ordenar los documentos por puntuación de mayor a menor
        usort($documentosValoracionData, function ($a, $b) {
            return $b['puntuacion'] <=> $a['puntuacion'];
        });

        // Se tienen los 3 mejores documentos
        $mejoresDocumentos = array_slice($documentosValoracionData, 0, 3);

        return $this->json($mejoresDocumentos, Response::HTTP_OK);
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
        $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME); // Nombre original del archivo sin extensión

        // Obtener el tipo MIME del archivo
        $tipoArchivo = $file->getClientMimeType();

        // Crear el documento en la base de datos
        $documento = new Documento();
        $asignatura = $entityManager->getRepository(Asignatura::class)->find($asignaturaId);
        $documento->setAsignatura($asignatura); // Asignatura debe ser un objeto de la entidad Asignatura
        $documento->setTitulo($fileName);
        $documento->setDescripcion($descripcion);
        $documento->setRutaArchivo('uploads/' . $user->getId() . '/' . $originalFileName);
        $documento->setUser($user);
        $documento->setFechaSubida(new \DateTime());
        $documento->setTipoArchivo($tipoArchivo);

        $entityManager->persist($documento);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Documento subido exitosamente'], 201);
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

    #[Route('/api/documentos/{id}/puntuar', name: 'puntuar_documento', methods: ['POST'])]
    public function puntuarDocumento(
        int $id,
        Request $request,
        DocumentoRepository $documentoRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // Buscar el documento por ID
        $documento = $documentoRepository->find($id);

        if (!$documento) {
            return new JsonResponse(['error' => 'Documento no encontrado'], 404);
        }

        // Obtener el usuario autenticado
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], 401);
        }

        // Obtener la puntuación del cuerpo de la solicitud
        $data = json_decode($request->getContent(), true);
        $puntuacion = $data['puntuacion'] ?? null;

        if (!$puntuacion || $puntuacion < 1 || $puntuacion > 5) {
            return new JsonResponse(['error' => 'La puntuación debe estar entre 1 y 5.'], 400);
        }

        // Verificar si el usuario ya ha puntuado este documento
        foreach ($documento->getValoraciones() as $valoracion) {
            if ($valoracion->getUser() === $user) {
                return new JsonResponse(['error' => 'Ya has puntuado este documento.'], 400);
            }
        }

        // Crear una nueva valoración
        $valoracion = new Valoracion();
        $valoracion->setPuntuacion($puntuacion);
        $valoracion->setDocumento($documento);
        $valoracion->setUser($user);
        $valoracion->setFecha(new \DateTime());

        $entityManager->persist($valoracion);
        $entityManager->flush();

        $entityManager->refresh($documento); // Refrescar el documento para obtener la nueva media de valoraciones

        // Calcular la nueva media de puntuaciones
        $nuevaPuntuacion = $documento->calcularMediaValoraciones();

        return new JsonResponse([
            'message' => 'Puntuación registrada exitosamente.',
            'nuevaPuntuacion' => $nuevaPuntuacion, 
        ], 201);
    }
}
