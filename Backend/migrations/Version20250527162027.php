<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250527162027 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE asignatura (codigo VARCHAR(4) NOT NULL, curso_cod_curso VARCHAR(4) NOT NULL, nombre VARCHAR(100) NOT NULL, INDEX IDX_9243D6CEA0EBEF6 (curso_cod_curso), INDEX idx_asignatura_nombre (nombre), PRIMARY KEY(codigo)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE ciclo (cod_ciclo VARCHAR(4) NOT NULL, nombre VARCHAR(100) NOT NULL, descripcion LONGTEXT DEFAULT NULL, PRIMARY KEY(cod_ciclo)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE comentario (id INT AUTO_INCREMENT NOT NULL, documento_id INT NOT NULL, user_id INT NOT NULL, comentario LONGTEXT NOT NULL, fecha DATETIME DEFAULT CURRENT_TIMESTAMP, INDEX IDX_4B91E70245C0CF75 (documento_id), INDEX IDX_4B91E702A76ED395 (user_id), INDEX idx_comentario_fecha (fecha), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE curso (cod_curso VARCHAR(4) NOT NULL, ciclo_cod_ciclo VARCHAR(4) NOT NULL, nombre VARCHAR(50) NOT NULL, INDEX IDX_CA3B40EC9B25319B (ciclo_cod_ciclo), PRIMARY KEY(cod_curso)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE documento (id INT AUTO_INCREMENT NOT NULL, asignatura_codigo VARCHAR(4) NOT NULL, user_id INT NOT NULL, titulo VARCHAR(70) NOT NULL, descripcion LONGTEXT DEFAULT NULL, ruta_archivo VARCHAR(150) NOT NULL, fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP, aprobado TINYINT(1) NOT NULL, numero_descargas INT NOT NULL, activo TINYINT(1) NOT NULL, tipo_archivo VARCHAR(50) NOT NULL, INDEX IDX_B6B12EC7895FDA48 (asignatura_codigo), INDEX IDX_B6B12EC7A76ED395 (user_id), INDEX idx_documento_titulo (titulo), INDEX idx_documento_fecha_subida (fecha_subida), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT '(DC2Type:json)', password VARCHAR(255) NOT NULL, nombre VARCHAR(50) NOT NULL, apellido VARCHAR(50) DEFAULT NULL, fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP, activo TINYINT(1) NOT NULL, avatar VARCHAR(255) DEFAULT NULL, is_verified TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), INDEX idx_user_nombre (nombre), INDEX idx_user_apellido (apellido), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE valoracion (id INT AUTO_INCREMENT NOT NULL, documento_id INT NOT NULL, user_id INT NOT NULL, puntuacion SMALLINT NOT NULL, fecha DATETIME DEFAULT CURRENT_TIMESTAMP, INDEX IDX_6D3DE0F445C0CF75 (documento_id), INDEX IDX_6D3DE0F4A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', available_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', delivered_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura ADD CONSTRAINT FK_9243D6CEA0EBEF6 FOREIGN KEY (curso_cod_curso) REFERENCES curso (cod_curso)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario ADD CONSTRAINT FK_4B91E70245C0CF75 FOREIGN KEY (documento_id) REFERENCES documento (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario ADD CONSTRAINT FK_4B91E702A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso ADD CONSTRAINT FK_CA3B40EC9B25319B FOREIGN KEY (ciclo_cod_ciclo) REFERENCES ciclo (cod_ciclo)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD CONSTRAINT FK_B6B12EC7895FDA48 FOREIGN KEY (asignatura_codigo) REFERENCES asignatura (codigo)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD CONSTRAINT FK_B6B12EC7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE valoracion ADD CONSTRAINT FK_6D3DE0F445C0CF75 FOREIGN KEY (documento_id) REFERENCES documento (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE valoracion ADD CONSTRAINT FK_6D3DE0F4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura DROP FOREIGN KEY FK_9243D6CEA0EBEF6
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario DROP FOREIGN KEY FK_4B91E70245C0CF75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario DROP FOREIGN KEY FK_4B91E702A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso DROP FOREIGN KEY FK_CA3B40EC9B25319B
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento DROP FOREIGN KEY FK_B6B12EC7895FDA48
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento DROP FOREIGN KEY FK_B6B12EC7A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE valoracion DROP FOREIGN KEY FK_6D3DE0F445C0CF75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE valoracion DROP FOREIGN KEY FK_6D3DE0F4A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE asignatura
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE ciclo
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE comentario
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE curso
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE documento
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE valoracion
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE messenger_messages
        SQL);
    }
}
