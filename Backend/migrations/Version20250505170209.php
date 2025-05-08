<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250505170209 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura MODIFY id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura DROP FOREIGN KEY FK_9243D6CE87CB4A1F
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_9243D6CE87CB4A1F ON asignatura
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX `primary` ON asignatura
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura ADD curso_cod_curso VARCHAR(4) NOT NULL, DROP id, DROP curso_id, CHANGE codigo codigo VARCHAR(4) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura ADD CONSTRAINT FK_9243D6CEA0EBEF6 FOREIGN KEY (curso_cod_curso) REFERENCES curso (cod_curso)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_9243D6CEA0EBEF6 ON asignatura (curso_cod_curso)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_asignatura_nombre ON asignatura (nombre)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura ADD PRIMARY KEY (codigo)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ciclo MODIFY id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX `primary` ON ciclo
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ciclo ADD cod_ciclo VARCHAR(4) NOT NULL, DROP id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ciclo ADD PRIMARY KEY (cod_ciclo)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_comentario_fecha ON comentario (fecha)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso MODIFY id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso DROP FOREIGN KEY FK_CA3B40ECD8F6DC8
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_CA3B40ECD8F6DC8 ON curso
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX `primary` ON curso
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso ADD cod_curso VARCHAR(4) NOT NULL, ADD ciclo_cod_ciclo VARCHAR(4) NOT NULL, DROP id, DROP ciclo_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso ADD CONSTRAINT FK_CA3B40EC9B25319B FOREIGN KEY (ciclo_cod_ciclo) REFERENCES ciclo (cod_ciclo)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_CA3B40EC9B25319B ON curso (ciclo_cod_ciclo)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso ADD PRIMARY KEY (cod_curso)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento DROP FOREIGN KEY FK_B6B12EC7C5C70C5B
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_B6B12EC7C5C70C5B ON documento
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD asignatura_codigo VARCHAR(4) NOT NULL, DROP asignatura_id, CHANGE titulo titulo VARCHAR(70) NOT NULL, CHANGE ruta_archivo ruta_archivo VARCHAR(150) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD CONSTRAINT FK_B6B12EC7895FDA48 FOREIGN KEY (asignatura_codigo) REFERENCES asignatura (codigo)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B6B12EC7895FDA48 ON documento (asignatura_codigo)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_documento_titulo ON documento (titulo)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_documento_fecha_subida ON documento (fecha_subida)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user CHANGE nombre nombre VARCHAR(50) NOT NULL, CHANGE apellido apellido VARCHAR(50) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_user_nombre ON user (nombre)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_user_apellido ON user (apellido)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura DROP FOREIGN KEY FK_9243D6CEA0EBEF6
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_9243D6CEA0EBEF6 ON asignatura
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_asignatura_nombre ON asignatura
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura ADD id INT AUTO_INCREMENT NOT NULL, ADD curso_id INT NOT NULL, DROP curso_cod_curso, CHANGE codigo codigo VARCHAR(20) DEFAULT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE asignatura ADD CONSTRAINT FK_9243D6CE87CB4A1F FOREIGN KEY (curso_id) REFERENCES curso (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_9243D6CE87CB4A1F ON asignatura (curso_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ciclo ADD id INT AUTO_INCREMENT NOT NULL, DROP cod_ciclo, DROP PRIMARY KEY, ADD PRIMARY KEY (id)
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_comentario_fecha ON comentario
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso DROP FOREIGN KEY FK_CA3B40EC9B25319B
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_CA3B40EC9B25319B ON curso
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso ADD id INT AUTO_INCREMENT NOT NULL, ADD ciclo_id INT NOT NULL, DROP cod_curso, DROP ciclo_cod_ciclo, DROP PRIMARY KEY, ADD PRIMARY KEY (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE curso ADD CONSTRAINT FK_CA3B40ECD8F6DC8 FOREIGN KEY (ciclo_id) REFERENCES ciclo (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_CA3B40ECD8F6DC8 ON curso (ciclo_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento DROP FOREIGN KEY FK_B6B12EC7895FDA48
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_B6B12EC7895FDA48 ON documento
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_documento_titulo ON documento
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_documento_fecha_subida ON documento
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD asignatura_id INT NOT NULL, DROP asignatura_codigo, CHANGE titulo titulo VARCHAR(255) NOT NULL, CHANGE ruta_archivo ruta_archivo VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD CONSTRAINT FK_B6B12EC7C5C70C5B FOREIGN KEY (asignatura_id) REFERENCES asignatura (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B6B12EC7C5C70C5B ON documento (asignatura_id)
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_user_nombre ON user
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_user_apellido ON user
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user CHANGE nombre nombre VARCHAR(100) NOT NULL, CHANGE apellido apellido VARCHAR(100) DEFAULT NULL
        SQL);
    }
}
