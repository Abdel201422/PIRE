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
    #[ORM\Column(name: "cod_ciclo", length: 4, unique: true, nullable: false)]
    private string $cod_ciclo;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\OneToMany(mappedBy: 'ciclo', targetEntity: Curso::class, cascade: ["remove"])]
    private Collection $cursos;

    public function __construct()
    {
        $this->cursos = new ArrayCollection();
    }

    // Getters y Setters
    public function getCodCiclo(): string { return $this->cod_ciclo; }
    public function setCodCiclo(string $cod_ciclo): self { $this->cod_ciclo = strtoupper($cod_ciclo); return $this; }
    public function getNombre(): ?string { return $this->nombre; }
    public function setNombre(string $nombre): self { $this->nombre = $nombre; return $this; }
    public function getDescripcion(): ?string { return $this->descripcion; }
    public function setDescripcion(?string $descripcion): self { $this->descripcion = $descripcion; return $this; }
    public function getCursos(): Collection { return $this->cursos; }
}