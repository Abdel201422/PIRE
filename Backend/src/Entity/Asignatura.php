<?php
namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\AsignaturaRepository;

#[ORM\Entity(repositoryClass: AsignaturaRepository::class)]
#[ORM\Index(name: "idx_asignatura_nombre", columns: ["nombre"])]
class Asignatura
{
    #[ORM\Id]
    #[ORM\Column(length: 4, unique: true, nullable: false)]
    private string $codigo;
    
    #[ORM\Column(length: 100)]
    private ?string $nombre = null;
    
    #[ORM\ManyToOne(targetEntity: Curso::class, inversedBy: 'asignaturas')]
    #[ORM\JoinColumn(name: "curso_cod_curso", referencedColumnName: "cod_curso", nullable: false)]
    private ?Curso $curso = null;
    
    // Getters y Setters
    public function getNombre(): ?string { return $this->nombre; }
    public function setNombre(string $nombre): self { $this->nombre = $nombre; return $this; }
    public function getCurso(): ?Curso { return $this->curso; }
    public function setCurso(?Curso $curso): self { $this->curso = $curso; return $this; }
    public function getCodigo(): string { return $this->codigo; }
    public function setCodigo(string $codigo): self { $this->codigo = $codigo; return $this; }
}