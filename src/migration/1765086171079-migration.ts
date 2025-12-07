import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765086171079 implements MigrationInterface {
    name = 'Migration1765086171079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "deleted_at"`);
    }

}
