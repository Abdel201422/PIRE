<?php
namespace App\Repository;

use App\Entity\Ciclo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class CicloRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ciclo::class);
    }

    // Ejemplo: Buscar ciclos por nombre
    public function findByNombre(string $nombre): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.nombre LIKE :nombre')
            ->setParameter('nombre', '%' . $nombre . '%')
            ->getQuery()
            ->getResult();
    }
}