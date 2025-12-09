import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765290682310 implements MigrationInterface {
    name = 'Migration1765290682310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "today_quest" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "today_quest"`);
    }

}
