import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764598012786 implements MigrationInterface {
    name = 'Migration1764598012786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_reward" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_reward" DROP COLUMN "reward_id"`);
        await queryRunner.query(`ALTER TABLE "user_quest" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_quest" DROP COLUMN "quest_id"`);
        await queryRunner.query(`ALTER TABLE "verification_image" DROP COLUMN "verification_id"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "user_quest_id"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "reviewer_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" ADD "reviewer_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "user_quest_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification_image" ADD "verification_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD "quest_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD "reward_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD "user_id" integer NOT NULL`);
    }

}
