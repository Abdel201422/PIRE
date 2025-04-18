<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use App\Repository\CursoRepository;

#[ORM\Entity(repositoryClass: CursoRepository::class)]
class Curso
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $nombre = null;

    #[ORM\ManyToOne(targetEntity: Ciclo::class, inversedBy: 'cursos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ciclo $ciclo = null;

    #[ORM\OneToMany(mappedBy: 'curso', targetEntity: Asignatura::class)]
    private Collection $asignaturas;

    public function __construct()
    {
        $this->asignaturas = new ArrayCollection();
    }

    // Getters y Setters
    public function getId(): ?int { return $this->id; }
    public function getNombre(): ?string { return $this->nombre; }
    public function setNombre(string $nombre): self { $this->nombre = $nombre; return $this; }
    public function getCiclo(): ?Ciclo { return $this->ciclo; }
    public function setCiclo(?Ciclo $ciclo): self { $this->ciclo = $ciclo; return $this; }
    public function getAsignaturas(): Collection { return $this->asignaturas; }
}