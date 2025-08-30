<?php
namespace App\Repository;

use App\Entity\Valoracion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

use App\Entity\User;

class ValoracionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Valoracion::class);
    }

    //Buscar valoraciones por puntuación mínima
    public function findByPuntuacionGreaterThan(int $puntuacion): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.puntuacion >= :puntuacion')
            ->setParameter('puntuacion', $puntuacion)
            ->getQuery()
            ->getResult();
    }

    // SQL personalizado para buscar la última puntuación recibida
    public function findUltimaPuntuacionRecibida(User $user): ?valoracion
    {
        return $this->createQueryBuilder('v')
            ->join('v.documento', 'd')
            ->where('d.user = :user')
            ->setParameter('user', $user)
            ->orderBy('v.fecha', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}