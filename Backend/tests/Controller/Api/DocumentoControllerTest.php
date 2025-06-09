<?php
// tests/Controller/Api/DocumentoControllerTest.php
namespace App\Tests\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class DocumentoControllerTest extends WebTestCase
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

        if (!$token) {
            throw new \Exception('No se pudo obtener token JWT al hacer login');
        }

        $client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $token));
        return $client;
    }

    public function testSubirDocumentoCompleto(): void
    {
        $client = $this->loginClient();

        $filePath = __DIR__.'/../../Fixtures/prueba.pdf';

        if (!file_exists($filePath)) {
            throw new \Exception('Archivo de prueba no encontrado en la ruta: ' . realpath($filePath));
        }

        $uploadedFile = new UploadedFile(
            $filePath,
            'prueba.pdf',
            'application/pdf',
            null,
            true // archivo de prueba en modo test, no mueve archivo real
        );

        // Campos del formulario
        $formData = [
            'ciclo' => 'DAW',
            'curso' => 'D2',
            'asignatura' => 'EIE',
            'descripcion' => 'Documento de prueba para test',
        ];

        // Envía la petición como multipart/form-data (necesario para subir archivos)
        $client->request('POST', '/api/documentos/upload', $formData, ['file' => $uploadedFile], [
            'HTTP_Authorization' => $client->getServerParameter('HTTP_Authorization'),
            // No sets CONTENT_TYPE here: el cliente detecta multipart/form-data por el archivo.
        ]);

        $response = $client->getResponse();

        if (!($response->isSuccessful() || $response->getStatusCode() === 201)) {
            // Muestra datos para debugging en caso de fallo
            echo "\nStatus code: " . $response->getStatusCode() . "\n";
            echo "Response content:\n" . $response->getContent() . "\n";
        }

        $this->assertTrue(
            $response->isSuccessful() || $response->getStatusCode() === 201,
            'La respuesta debe ser exitosa o 201 Created.'
        );

        $data = json_decode($response->getContent(), true);

        $this->assertArrayHasKey('message', $data);
        $this->assertStringContainsString('subido', $data['message'] ?? '', 'El mensaje debe indicar subida correcta.');
    }
}
