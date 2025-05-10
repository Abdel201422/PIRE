<?php

namespace App\Controller;

use App\Entity\Ciclo;
use App\Form\CicloType;
use App\Repository\CicloRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;


final class CicloController extends AbstractController
{
    #[Route(name: 'app_ciclo_index', methods: ['GET'])]
    public function index(CicloRepository $cicloRepository): Response
    {
        return $this->render('ciclo/index.html.twig', [
            'ciclos' => $cicloRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_ciclo_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $ciclo = new Ciclo();
        $form = $this->createForm(CicloType::class, $ciclo);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($ciclo);
            $entityManager->flush();

            return $this->redirectToRoute('app_ciclo_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('ciclo/new.html.twig', [
            'ciclo' => $ciclo,
            'form' => $form,
        ]);
    }

    #[Route('/{cod_ciclo}', name: 'app_ciclo_show', methods: ['GET'])]
    public function show(Ciclo $ciclo): Response
    {
        return $this->render('ciclo/show.html.twig', [
            'ciclo' => $ciclo,
        ]);
    }

    #[Route('/{cod_ciclo}/edit', name: 'app_ciclo_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Ciclo $ciclo, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(CicloType::class, $ciclo);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_ciclo_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('ciclo/edit.html.twig', [
            'ciclo' => $ciclo,
            'form' => $form,
        ]);
    }

    #[Route('/{cod_ciclo}', name: 'app_ciclo_delete', methods: ['POST'])]
    public function delete(Request $request, Ciclo $ciclo, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$ciclo->getCodCiclo(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($ciclo);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_ciclo_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/api/ciclos', name: 'api_ciclos', methods: ['GET'])]
    public function getCiclos(CicloRepository $cicloRepository): JsonResponse
    {
        $ciclos = $cicloRepository->findAll();
        $data = [];

        foreach ($ciclos as $ciclo) {
            $data[] = [
                'id' => $ciclo->getId(),
                'nombre' => $ciclo->getNombre(),
                'tipo' => $ciclo->getTipo(), // Ejemplo: "Grado Medio", "Grado Superior"
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    #[Route('/api/ciclos/completos', name: 'api_ciclos_completos', methods: ['GET'])]
    public function getCiclosCompletos(CicloRepository $cicloRepository): JsonResponse
    {
        $ciclos = $cicloRepository->findAll();
        $data = [];

        foreach ($ciclos as $ciclo) {
            $cursosData = [];
            foreach ($ciclo->getCursos() as $curso) {
                $asignaturasData = [];
                foreach ($curso->getAsignaturas() as $asignatura) {
                    $asignaturasData[] = [
                        'id' => $asignatura->getCodigo(),
                        'nombre' => $asignatura->getNombre(),
                        'curso' => $curso->getNombre(), // Indica a qué curso pertenece
                    ];
                }

                $cursosData[] = [
                    'id' => $curso->getCodCurso(),
                    'nombre' => $curso->getNombre(),
                    'asignaturas' => $asignaturasData,
                ];
            }

            $data[] = [
                'id' => $ciclo->getCodCiclo(),
                'nombre' => $ciclo->getNombre(),
                'descripcion' => $ciclo->getDescripcion(),
                'cursos' => $cursosData,
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }
}
