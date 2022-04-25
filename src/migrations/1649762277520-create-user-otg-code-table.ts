import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserOtgCodeTable1649762277520 implements MigrationInterface {
  name = 'createUserOtgCodeTable1649762277520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_otg_code\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`userId\` int NULL, \`otgCode\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, UNIQUE INDEX \`IDX_81ac0f0aecb9fdd3328a86d525\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_otg_code\` ADD CONSTRAINT \`FK_c6adf5fb37b0ecbcaf4f1459534\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_otg_code\` DROP FOREIGN KEY \`FK_c6adf5fb37b0ecbcaf4f1459534\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_81ac0f0aecb9fdd3328a86d525\` ON \`user_otg_code\``,
    );
    await queryRunner.query(`DROP TABLE \`user_otg_code\``);
  }
}
