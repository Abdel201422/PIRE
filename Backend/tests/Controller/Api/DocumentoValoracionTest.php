<?php

namespace App\Tests\Controller\Api;

use App\Entity\Documento;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class DocumentoValoracionTest extends WebTestCase
{
    public function testPuntuarDocumento(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        $entityManager = $container->get('doctrine')->getManager();

        // Obtener un usuario y un documento existentes
        $user = $entityManager->getRepository(User::class)->findOneBy([]);
        $documento = $entityManager->getRepository(Documento::class)->findOneBy([]);

        $this->assertNotNull($user, 'No se encontró ningún usuario en la base de datos.');
        $this->assertNotNull($documento, 'No se encontró ningún documento en la base de datos.');

        // Simular login con Symfony (o usa JWT si tu app depende de él)
        $client->loginUser($user);

        // Enviar puntuación
        $client->request(
            'POST',
            '/api/documentos/' . $documento->getId() . '/puntuar',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['puntuacion' => 4])
        );

        $response = $client->getResponse();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $json = json_decode($response->getContent(), true);

        $this->assertArrayHasKey('nuevaPuntuacion', $json);
        $this->assertIsNumeric($json['nuevaPuntuacion']);
    }
}
