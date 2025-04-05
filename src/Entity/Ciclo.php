<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use App\Repository\CicloRepository; 

#[ORM\Entity(repositoryClass: CicloRepository::class)]
class Ciclo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\OneToMany(mappedBy: 'ciclo', targetEntity: Curso::class)]
    private Collection $cursos;

    public function __construct()
    {
        $this->cursos = new ArrayCollection();
    }

    // Getters y Setters
    public function getId(): ?int { return $this->id; }
    public function getNombre(): ?string { return $this->nombre; }
    public function setNombre(string $nombre): self { $this->nombre = $nombre; return $this; }
    public function getDescripcion(): ?string { return $this->descripcion; }
    public function setDescripcion(?string $descripcion): self { $this->descripcion = $descripcion; return $this; }
    public function getCursos(): Collection { return $this->cursos; }
}