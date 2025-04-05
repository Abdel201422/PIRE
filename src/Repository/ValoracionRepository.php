<?php
namespace App\Repository;

use App\Entity\Valoracion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ValoracionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Valoracion::class);
    }

    // Ejemplo: Buscar valoraciones por puntuación mínima
    public function findByPuntuacionGreaterThan(int $puntuacion): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.puntuacion >= :puntuacion')
            ->setParameter('puntuacion', $puntuacion)
            ->getQuery()
            ->getResult();
    }
}