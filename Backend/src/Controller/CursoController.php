<?php

namespace App\Controller;

use App\Entity\Curso;
use App\Form\CursoType;
use App\Repository\CursoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class CursoController extends AbstractController
{
    #[Route(name: 'app_curso_index', methods: ['GET'])]
    public function index(CursoRepository $cursoRepository): Response
    {
        return $this->render('curso/index.html.twig', [
            'cursos' => $cursoRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_curso_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $curso = new Curso();
        $form = $this->createForm(CursoType::class, $curso);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($curso);
            $entityManager->flush();

            return $this->redirectToRoute('app_curso_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('curso/new.html.twig', [
            'curso' => $curso,
            'form' => $form,
        ]);
    }

    /* #[Route('/{cod_curso}', name: 'app_curso_show', methods: ['GET'])]
    public function show(Curso $curso): Response
    {
        return $this->render('curso/show.html.twig', [
            'curso' => $curso,
        ]);
    } */

    #[Route('/{cod_curso}/edit', name: 'app_curso_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Curso $curso, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(CursoType::class, $curso);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_curso_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('curso/edit.html.twig', [
            'curso' => $curso,
            'form' => $form,
        ]);
    }

    #[Route('/{cod_curso}', name: 'app_curso_delete', methods: ['POST'])]
    public function delete(Request $request, Curso $curso, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$curso->getCod_curso(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($curso);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_curso_index', [], Response::HTTP_SEE_OTHER);
    }

    // Ruta para obtener las asignaturas de un curso
    #[Route('/api/cursos/{codCurso}/asignaturas', name: 'api_asignaturas_por_curso', methods: ['GET'])]
    public function getAsignaturasPorCurso(string $codCurso, CursoRepository $cursoRepository): JsonResponse
    {
        // Buscar el curso por su código
        $curso = $cursoRepository->findOneBy(['cod_curso' => $codCurso]);

        // Verificar si el curso existe
        if (!$curso) {
            return new JsonResponse(['error' => 'Curso no encontrado'], 404);
        }

        // Obtener las asignaturas asociadas al curso
        $asignaturas = $curso->getAsignaturas();  // Asumimos que tienes una relación OneToMany o ManyToMany

        // Crear un array con los datos de las asignaturas
        $data = [];
        foreach ($asignaturas as $asignatura) {
            $data[] = [
                'codigo' => $asignatura->getCodigo(),
                'nombre' => $asignatura->getNombre(),
            ];
        }

        // Devolver los datos de las asignaturas en formato JSON
        return new JsonResponse($data);
    }
}
