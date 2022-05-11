import { MigrationInterface, QueryRunner } from 'typeorm';

export class createVideoImageCoverTable1652233374359
  implements MigrationInterface
{
  name = 'createVideoImageCoverTable1652233374359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`video_image_cover\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`filesize_in_bytes\` int NOT NULL, \`filehash\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`video_image_cover\``);
  }
}
