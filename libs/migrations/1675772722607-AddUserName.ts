import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserName1675772722607 implements MigrationInterface {
    name = 'AddUserName1675772722607';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "username" character varying NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }
}
