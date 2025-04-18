<?php
namespace App\Repository;

use App\Entity\Asignatura;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class AsignaturaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Asignatura::class);
    }

    // Ejemplo: Buscar asignaturas por código
    public function findByCodigo(string $codigo): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.codigo = :codigo')
            ->setParameter('codigo', $codigo)
            ->getQuery()
            ->getResult();
    }
}