<?php

namespace App\Form;

use App\Entity\Asignatura;
use App\Entity\Documento;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;

class DocumentoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('titulo')
            ->add('descripcion')
            ->add('fecha_subida', null, [
                'widget' => 'single_text',
            ])
            ->add('aprobado')
            ->add('asignatura', EntityType::class, [
                'class' => Asignatura::class,
                'choice_label' => 'id',
            ])
            ->add('user', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'id',
            ])
            ->add('ruta_archivo', FileType::class, [
                'label' => 'Archivo',

                
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Documento::class,
        ]);
    }
}
