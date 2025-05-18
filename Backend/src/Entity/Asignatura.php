<?php
namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
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
    
    #[ORM\OneToMany(mappedBy: 'asignatura', targetEntity: Documento::class, cascade: ["remove"])]
    private Collection $documentos;
    
    public function __construct()
    {
        $this->documentos = new ArrayCollection();
    }
    
    // Getters y Setters
    public function getNombre(): ?string
    {
        return $this->nombre;
    }
    
    public function setNombre(string $nombre): self
    { 
        $this->nombre = $nombre; return $this; 
    }
    
    public function getCurso(): ?Curso
    { 
        return $this->curso; 
    }
    
    public function setCurso(?Curso $curso): self 
    { 
        $this->curso = $curso; return $this;
    }
    
    public function getCodigo(): string 
    { 
        return $this->codigo; 
    }
    
    public function setCodigo(string $codigo): self 
    { 
        $this->codigo = strtoupper($codigo); return $this; 
    }
    /**
     * @return Collection<int, Documento>
     */
    public function getDocumentos(): Collection
    {
        return $this->documentos;
    }

    public function addDocumento(Documento $documento): self
    {
        if (!$this->documentos->contains($documento)) {
            $this->documentos->add($documento);
            $documento->setAsignatura($this);
        }
        return $this;
    }

    public function removeDocumento(Documento $documento): self
    {
        if ($this->documentos->removeElement($documento)) {
            // set the owning side to null (unless already changed)
            if ($documento->getAsignatura() === $this) {
                $documento->setAsignatura(null);
            }
        }
        return $this;
    }
}