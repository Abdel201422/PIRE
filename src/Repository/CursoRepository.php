<?php
namespace App\Repository;

use App\Entity\Curso;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class CursoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Curso::class);
    }

    // Ejemplo: Buscar cursos por ciclo
    public function findByCiclo(int $cicloId): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.ciclo = :cicloId')
            ->setParameter('cicloId', $cicloId)
            ->getQuery()
            ->getResult();
    }
}