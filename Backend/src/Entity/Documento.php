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

    #[ORM\Column(type: 'datetime', nullable: true, options: ["default" => "CURRENT_TIMESTAMP"])]
    private ?\DateTimeInterface $fecha_subida = null;

    #[ORM\Column(type: 'boolean')]
    private bool $aprobado = false;

    #[ORM\Column(type: 'integer')]
    private int $numero_descargas = 0;

    #[ORM\Column(type: 'boolean')]
    private bool $activo = true;

    #[ORM\Column(length: 50)]
    private ?string $tipo_archivo = null;

    #[ORM\OneToMany(mappedBy: 'documento', targetEntity: Valoracion::class)]
    private Collection $valoraciones;

    #[ORM\OneToMany(mappedBy: 'documento', targetEntity: Comentario::class)]
    private Collection $comentarios;

    

    public function __construct()
    {
        $this->valoraciones = new ArrayCollection();
        $this->comentarios = new ArrayCollection();
        $this->fecha_subida = new \DateTime(); // Auto-set fecha de subida
        $this->numero_descargas = 0;
        $this->activo = true;
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

    public function getNumeroDescargas(): int
    {
        return $this->numero_descargas;
    }

    public function setNumeroDescargas(int $numero_descargas): self
    {
        $this->numero_descargas = $numero_descargas;
        return $this;
    }

    public function incrementNumeroDescargas(): self
    {
        $this->numero_descargas++;
        return $this;
    }

    public function isActivo(): bool
    {
        return $this->activo;
    }

    public function setActivo(bool $activo): self
    {
        $this->activo = $activo;
        return $this;
    }

    public function getTipoArchivo(): ?string
    {
        return $this->tipo_archivo;
    }

    public function setTipoArchivo(string $tipo_archivo): self
    {
        $this->tipo_archivo = $tipo_archivo;
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

    /**
     * @return Collection<int, Comentario>
     */
    public function getComentarios(): Collection
    {
        return $this->comentarios;
    }

    public function addComentario(Comentario $comentario): self
    {
        if (!$this->comentarios->contains($comentario)) {
            $this->comentarios->add($comentario);
            $comentario->setDocumento($this);
        }
        return $this;
    }

    public function removeComentario(Comentario $comentario): self
    {
        if ($this->comentarios->removeElement($comentario)) {
            if ($comentario->getDocumento() === $this) {
                $comentario->setDocumento(null);
            }
        }
        return $this;
    }

    
}