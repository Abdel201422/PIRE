<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\AsignaturaRepository; 

#[ORM\Entity(repositoryClass: AsignaturaRepository::class)]
class Asignatura
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\ManyToOne(targetEntity: Curso::class, inversedBy: 'asignaturas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Curso $curso = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $codigo = null;

    // Getters y Setters
    public function getId(): ?int { return $this->id; }
    public function getNombre(): ?string { return $this->nombre; }
    public function setNombre(string $nombre): self { $this->nombre = $nombre; return $this; }
    public function getCurso(): ?Curso { return $this->curso; }
    public function setCurso(?Curso $curso): self { $this->curso = $curso; return $this; }
    public function getCodigo(): ?string { return $this->codigo; }
    public function setCodigo(?string $codigo): self { $this->codigo = $codigo; return $this; }
}