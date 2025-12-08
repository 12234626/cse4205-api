import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765214395939 implements MigrationInterface {
    name = 'Migration1765214395939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TYPE "public"."user_quest_status_enum" RENAME TO "user_quest_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_quest_status_enum" AS ENUM('PENDING', 'CONSENTED')`);
        await queryRunner.query(`ALTER TABLE "user_quest" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_quest" ALTER COLUMN "status" TYPE "public"."user_quest_status_enum" USING "status"::"text"::"public"."user_quest_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user_quest" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."user_quest_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_quest_status_enum_old" AS ENUM('pending', 'completed', 'verified')`);
        await queryRunner.query(`ALTER TABLE "user_quest" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_quest" ALTER COLUMN "status" TYPE "public"."user_quest_status_enum_old" USING "status"::"text"::"public"."user_quest_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user_quest" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."user_quest_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_quest_status_enum_old" RENAME TO "user_quest_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "level" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "age" integer`);
    }

}
