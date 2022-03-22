import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1647624385145 implements MigrationInterface {
  name = 'createUserTable1647624385145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`login\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, UNIQUE INDEX \`IDX_a62473490b3e4578fd683235c5\` (\`login\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a62473490b3e4578fd683235c5\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
