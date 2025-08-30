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

    //obtener las asignaturas de un curso
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
