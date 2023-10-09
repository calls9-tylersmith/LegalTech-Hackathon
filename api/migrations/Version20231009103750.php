<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231009103750 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE answer ADD visible_faults VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE answer ADD safety_faults VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE answer ADD quality_faults VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE answer ADD ai_faults VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE answer DROP name');
        $this->addSql('ALTER TABLE answer DROP issue_type');
        $this->addSql('ALTER TABLE answer DROP visual_defects');
        $this->addSql('ALTER TABLE answer DROP image');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE answer ADD name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE answer ADD issue_type VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE answer ADD visual_defects VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE answer ADD image TEXT NOT NULL');
        $this->addSql('ALTER TABLE answer DROP visible_faults');
        $this->addSql('ALTER TABLE answer DROP safety_faults');
        $this->addSql('ALTER TABLE answer DROP quality_faults');
        $this->addSql('ALTER TABLE answer DROP ai_faults');
    }
}
