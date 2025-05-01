<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;
use App\Entity\Documento;
use App\Repository\ValoracionRepository;

#[ORM\Entity(repositoryClass: ValoracionRepository::class)]
class Valoracion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'smallint')]
    private $puntuacion;

    #[ORM\Column(type: 'datetime', nullable: true, options: ["default" => "CURRENT_TIMESTAMP"])]
    private $fecha;

    #[ORM\ManyToOne(targetEntity: Documento::class, inversedBy: 'valoraciones')]
    #[ORM\JoinColumn(nullable: false)]
    private $documento;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'valoraciones')]
    #[ORM\JoinColumn(nullable: false)]
    private $user;

    public function __construct()
    {
        $this->fecha = new \DateTime();
    }

    // Getters y Setters
    public function getId(): ?int { return $this->id; }
    public function getPuntuacion(): ?int { return $this->puntuacion; }
    public function setPuntuacion(int $puntuacion): self { $this->puntuacion = $puntuacion; return $this; }
    public function getFecha(): ?\DateTimeInterface { return $this->fecha; }
    public function setFecha(\DateTimeInterface $fecha): self { $this->fecha = $fecha; return $this; }
    public function getDocumento(): ?Documento { return $this->documento; }
    public function setDocumento(?Documento $documento): self { $this->documento = $documento; return $this; }
    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): self { $this->user = $user; return $this; }
}