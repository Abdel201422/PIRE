<?php
// tests/Controller/Api/ComentarioControllerTest.php
namespace App\Tests\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ComentarioControllerTest extends WebTestCase
{
    private function loginClient(): \Symfony\Bundle\FrameworkBundle\KernelBrowser
    {
        $client = static::createClient();

        $client->request('POST', '/api/login', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'username' => 'alumno1@pire.com',
            'password' => 'alumno123',
        ]));

        $response = $client->getResponse();
        $data = json_decode($response->getContent(), true);
        $token = $data['token'] ?? null;

        $client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $token));
        return $client;
    }

    public function testCrearComentario(): void
    {
        $client = $this->loginClient();

        $comentarioData = [
            'comentario' => 'Comentario de prueba desde test',
            'documento_id' => 1, // Pon un documento válido de test
            'user_id' => 1,      // Pon un user válido de test
        ];

        $client->request('POST', '/api/comentario/crear', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_Authorization' => $client->getServerParameter('HTTP_Authorization'),
        ], json_encode($comentarioData));

        $response = $client->getResponse();

        $this->assertTrue(
            $response->isSuccessful() || $response->getStatusCode() === 201,
            'La respuesta debería ser exitosa o 201 Created.'
        );

        $data = json_decode($response->getContent(), true);

        $this->assertArrayHasKey('id', $data, 'La respuesta debe contener el ID del comentario.');
        $this->assertEquals($comentarioData['comentario'], $data['comentario'], 'El contenido del comentario debe coincidir.');
    }
}
