<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250505170556 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE documento CHANGE titulo titulo VARCHAR(70) NOT NULL, CHANGE ruta_archivo ruta_archivo VARCHAR(150) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user CHANGE nombre nombre VARCHAR(50) NOT NULL, CHANGE apellido apellido VARCHAR(50) DEFAULT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE documento CHANGE titulo titulo VARCHAR(255) NOT NULL, CHANGE ruta_archivo ruta_archivo VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user CHANGE nombre nombre VARCHAR(100) NOT NULL, CHANGE apellido apellido VARCHAR(100) DEFAULT NULL
        SQL);
    }
}
