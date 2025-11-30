import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764502682095 implements MigrationInterface {
    name = 'Migration1764502682095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reward" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "reward" DROP COLUMN "created_at"`);
    }

}
