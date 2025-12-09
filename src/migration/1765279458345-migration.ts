import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765279458345 implements MigrationInterface {
    name = 'Migration1765279458345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."quest_quest_type_enum" RENAME TO "quest_quest_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."quest_quest_type_enum" AS ENUM('DAILY', 'WEEKLY', 'EVENT', 'NORMAL')`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "quest_type" TYPE "public"."quest_quest_type_enum" USING "quest_type"::"text"::"public"."quest_quest_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."quest_quest_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."quest_difficulty_enum" RENAME TO "quest_difficulty_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."quest_difficulty_enum" AS ENUM('EASY', 'MEDIUM', 'HARD')`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "difficulty" TYPE "public"."quest_difficulty_enum" USING "difficulty"::"text"::"public"."quest_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."quest_difficulty_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_dd13e2801d2073391f346a58ae1"`);
        await queryRunner.query(`ALTER TYPE "public"."user_provider_enum" RENAME TO "user_provider_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_provider_enum" AS ENUM('GOOGLE', 'NAVER', 'KAKAO')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "provider" TYPE "public"."user_provider_enum" USING "provider"::"text"::"public"."user_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_provider_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('MENTEE', 'MENTOR', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."reward_reward_type_enum" RENAME TO "reward_reward_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."reward_reward_type_enum" AS ENUM('BADGE', 'TITLE', 'ACHIEVEMENT', 'SEASON')`);
        await queryRunner.query(`ALTER TABLE "reward" ALTER COLUMN "reward_type" TYPE "public"."reward_reward_type_enum" USING "reward_type"::"text"::"public"."reward_reward_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reward_reward_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_dd13e2801d2073391f346a58ae1" UNIQUE ("provider", "provider_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_dd13e2801d2073391f346a58ae1"`);
        await queryRunner.query(`CREATE TYPE "public"."reward_reward_type_enum_old" AS ENUM('badge', 'title', 'achievement', 'season')`);
        await queryRunner.query(`ALTER TABLE "reward" ALTER COLUMN "reward_type" TYPE "public"."reward_reward_type_enum_old" USING "reward_type"::"text"::"public"."reward_reward_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."reward_reward_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."reward_reward_type_enum_old" RENAME TO "reward_reward_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('mentee', 'mentor', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."user_provider_enum_old" AS ENUM('google', 'naver', 'kakao')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "provider" TYPE "public"."user_provider_enum_old" USING "provider"::"text"::"public"."user_provider_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_provider_enum_old" RENAME TO "user_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_dd13e2801d2073391f346a58ae1" UNIQUE ("provider", "provider_id")`);
        await queryRunner.query(`CREATE TYPE "public"."quest_difficulty_enum_old" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "difficulty" TYPE "public"."quest_difficulty_enum_old" USING "difficulty"::"text"::"public"."quest_difficulty_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."quest_difficulty_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."quest_difficulty_enum_old" RENAME TO "quest_difficulty_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."quest_quest_type_enum_old" AS ENUM('daily', 'weekly', 'event', 'normal')`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "quest_type" TYPE "public"."quest_quest_type_enum_old" USING "quest_type"::"text"::"public"."quest_quest_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."quest_quest_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."quest_quest_type_enum_old" RENAME TO "quest_quest_type_enum"`);
    }

}
