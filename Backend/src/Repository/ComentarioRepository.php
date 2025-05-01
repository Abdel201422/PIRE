<?php
namespace App\Repository;

use App\Entity\Comentario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ComentarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comentario::class);
    }

    // Ejemplo: Buscar comentarios por fecha
    public function findByFecha(\DateTime $fecha): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.fecha >= :fecha')
            ->setParameter('fecha', $fecha)
            ->orderBy('c.fecha', 'DESC')
            ->getQuery()
            ->getResult();
    }

    // Ejemplo: Buscar comentarios por usuario
    public function findByUser($userId): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.user = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('c.fecha', 'DESC')
            ->getQuery()
            ->getResult();
    }

    // Ejemplo: Buscar comentarios por documento
    public function findByDocumento($documentoId): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.documento = :documentoId')
            ->setParameter('documentoId', $documentoId)
            ->orderBy('c.fecha', 'DESC')
            ->getQuery()
            ->getResult();
    }
}