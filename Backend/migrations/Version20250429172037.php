<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250429172037 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE asignatura (id INT AUTO_INCREMENT NOT NULL, curso_id INT NOT NULL, nombre VARCHAR(100) NOT NULL, codigo VARCHAR(20) DEFAULT NULL, INDEX IDX_9243D6CE87CB4A1F (curso_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE ciclo (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(100) NOT NULL, descripcion LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE comentario (id INT AUTO_INCREMENT NOT NULL, documento_id INT NOT NULL, user_id INT NOT NULL, comentario LONGTEXT NOT NULL, fecha DATETIME DEFAULT CURRENT_TIMESTAMP, INDEX IDX_4B91E70245C0CF75 (documento_id), INDEX IDX_4B91E702A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE curso (id INT AUTO_INCREMENT NOT NULL, ciclo_id INT NOT NULL, nombre VARCHAR(50) NOT NULL, INDEX IDX_CA3B40ECD8F6DC8 (ciclo_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE documento (id INT AUTO_INCREMENT NOT NULL, asignatura_id INT NOT NULL, user_id INT NOT NULL, titulo VARCHAR(255) NOT NULL, descripcion LONGTEXT DEFAULT NULL, ruta_archivo VARCHAR(255) NOT NULL, fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP, aprobado TINYINT(1) NOT NULL, numero_descargas INT NOT NULL, activo TINYINT(1) NOT NULL, tipo_archivo VARCHAR(50) NOT NULL, INDEX IDX_B6B12EC7C5C70C5B (asignatura_id), INDEX IDX_B6B12EC7A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nombre VARCHAR(100) NOT NULL, apellido VARCHAR(100) DEFAULT NULL, fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP, activo TINYINT(1) NOT NULL, avatar VARCHAR(255) DEFAULT NULL, is_verified TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE valoracion (id INT AUTO_INCREMENT NOT NULL, documento_id INT NOT NULL, user_id INT NOT NULL, puntuacion SMALLINT NOT NULL, fecha DATETIME DEFAULT CURRENT_TIMESTAMP, INDEX IDX_6D3DE0F445C0CF75 (documento_id), INDEX IDX_6D3DE0F4A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', available_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', delivered_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura ADD CONSTRAINT FK_9243D6CE87CB4A1F FOREIGN KEY (curso_id) REFERENCES curso (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario ADD CONSTRAINT FK_4B91E70245C0CF75 FOREIGN KEY (documento_id) REFERENCES documento (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario ADD CONSTRAINT FK_4B91E702A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso ADD CONSTRAINT FK_CA3B40ECD8F6DC8 FOREIGN KEY (ciclo_id) REFERENCES ciclo (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD CONSTRAINT FK_B6B12EC7C5C70C5B FOREIGN KEY (asignatura_id) REFERENCES asignatura (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD CONSTRAINT FK_B6B12EC7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE valoracion ADD CONSTRAINT FK_6D3DE0F445C0CF75 FOREIGN KEY (documento_id) REFERENCES documento (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE valoracion ADD CONSTRAINT FK_6D3DE0F4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura DROP FOREIGN KEY FK_9243D6CE87CB4A1F
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario DROP FOREIGN KEY FK_4B91E70245C0CF75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comentario DROP FOREIGN KEY FK_4B91E702A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso DROP FOREIGN KEY FK_CA3B40ECD8F6DC8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento DROP FOREIGN KEY FK_B6B12EC7C5C70C5B
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
