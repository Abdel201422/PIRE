<?php
namespace App\Repository;

use App\Entity\Documento;
use App\Entity\Asignatura;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DocumentoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Documento::class);
    }

    // Ejemplo: Buscar documentos aprobados
    public function findAprobados(): array
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.aprobado = true')
            ->getQuery()
            ->getResult();
    }

    public function findByAsignatura(Asignatura $asignatura): array
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.asignatura = :asignatura')
            ->setParameter('asignatura', $asignatura)
            ->getQuery()
            ->getResult();
    }

    public function searchByTitulo(string $query): array
    {
        return $this->createQueryBuilder('d')
            ->where('d.titulo LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->getQuery()
            ->getResult();
    }

    public function findByUserId(string $userId): array
    {
        return $this->createQueryBuilder('d')
            ->join('d.user', 'u')
            ->where('u.id = :id')
            ->setParameter('id', $userId)
            ->getQuery()
            ->getResult();
    }
}