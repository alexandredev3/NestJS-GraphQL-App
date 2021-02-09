import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLikesColumnOnPost1612626230540 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('posts', {
      name: 'likes_count',
      type: 'decimal',
      default: 0,
      isPrimary: false,
      isNullable: false,
      isUnique: false,
      isGenerated: false,
      isArray: false,
      length: '255',
      unsigned: false,
      zerofill: false,
      clone: null,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'likes_count');
  }
}
