<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use App\Repository\DocumentoRepository;

#[ORM\Entity(repositoryClass: DocumentoRepository::class)]
class Documento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titulo = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(length: 255)]
    private ?string $ruta_archivo = null;

    #[ORM\ManyToOne(targetEntity: Asignatura::class, inversedBy: 'documentos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Asignatura $asignatura = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'documentos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $fecha_subida = null;

    #[ORM\Column(type: 'boolean')]
    private bool $aprobado = false;

    #[ORM\OneToMany(mappedBy: 'documento', targetEntity: Valoracion::class)]
    private Collection $valoraciones;

    

    public function __construct()
    {
        $this->valoraciones = new ArrayCollection();
        $this->fecha_subida = new \DateTime(); // Auto-set fecha de subida
    }

    // Getters y Setters
    public function getId(): ?int { return $this->id; }

    public function getTitulo(): ?string { return $this->titulo; }
    public function setTitulo(string $titulo): self
    {
        $this->titulo = $titulo;
        return $this;
    }

    public function getDescripcion(): ?string { return $this->descripcion; }
    public function setDescripcion(?string $descripcion): self
    {
        $this->descripcion = $descripcion;
        return $this;
    }

    public function getRutaArchivo(): ?string 
    { 
        return $this->ruta_archivo; 
    }
    public function setRutaArchivo(string $ruta_archivo): static
    {
        $this->ruta_archivo = $ruta_archivo;

        return $this;
    }

    public function getAsignatura(): ?Asignatura { return $this->asignatura; }
    public function setAsignatura(?Asignatura $asignatura): self
    {
        $this->asignatura = $asignatura;
        return $this;
    }

    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getFechaSubida(): ?\DateTimeInterface { return $this->fecha_subida; }
    public function setFechaSubida(\DateTimeInterface $fecha_subida): self
    {
        $this->fecha_subida = $fecha_subida;
        return $this;
    }

    public function isAprobado(): bool { return $this->aprobado; }
    public function setAprobado(bool $aprobado): self
    {
        $this->aprobado = $aprobado;
        return $this;
    }

    /**
     * @return Collection<int, Valoracion>
     */
    public function getValoraciones(): Collection
    {
        return $this->valoraciones;
    }

    public function addValoracion(Valoracion $valoracion): self
    {
        if (!$this->valoraciones->contains($valoracion)) {
            $this->valoraciones->add($valoracion);
            $valoracion->setDocumento($this);
        }
        return $this;
    }

    public function removeValoracion(Valoracion $valoracion): self
    {
        if ($this->valoraciones->removeElement($valoracion)) {
            if ($valoracion->getDocumento() === $this) {
                $valoracion->setDocumento(null);
            }
        }
        return $this;
    }

    
}