import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameAddLikesColumn1612903436930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('likes', 'posts_likes');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('posts_likes', 'likes');
  }
}
