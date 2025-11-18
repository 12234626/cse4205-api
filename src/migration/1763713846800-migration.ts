import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1763713846800 implements MigrationInterface {
  name = 'Migration1763713846800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."verification_review_type_enum" AS ENUM('community', 'guardian')`,
    );
    await queryRunner.query(
      `CREATE TABLE "verification" ("verification_id" character varying(255) NOT NULL, "user_quest_id" character varying(255) NOT NULL, "reviewer_id" character varying(255) NOT NULL, "review_type" "public"."verification_review_type_enum" NOT NULL, "vote" boolean NOT NULL, "comment" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9e7eb9e23e11af4d8a03ee7ceca" PRIMARY KEY ("verification_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_quest_image" ("image_id" character varying(255) NOT NULL, "verification_id" character varying(255) NOT NULL, "image_url" character varying(500) NOT NULL, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_92933eb23e6df4444c2b92638bd" PRIMARY KEY ("image_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_reward" ("user_reward_id" character varying(255) NOT NULL, "user_id" character varying(255) NOT NULL, "reward_id" character varying(255) NOT NULL, "awarded_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c85339b04d66c1f2241e16671d" PRIMARY KEY ("user_reward_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_quest_status_enum" AS ENUM('pending', 'completed', 'verified')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_quest" ("user_quest_id" character varying(255) NOT NULL, "user_id" character varying(255) NOT NULL, "quest_id" character varying(255) NOT NULL, "assigned_date" date NOT NULL, "status" "public"."user_quest_status_enum" NOT NULL DEFAULT 'pending', "completed_at" TIMESTAMP, CONSTRAINT "PK_a8dc8dc1f5c277b5d2444bac512" PRIMARY KEY ("user_quest_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_provider_enum" AS ENUM('google', 'kakao', 'naver')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('guardian', 'ward')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("user_id" character varying(255) NOT NULL, "username" character varying(100) NOT NULL, "email" character varying(255), "provider" "public"."user_provider_enum" NOT NULL, "provider_id" character varying(255) NOT NULL, "age" integer, "level" integer NOT NULL DEFAULT '1', "exp" integer NOT NULL DEFAULT '0', "streak" integer NOT NULL DEFAULT '0', "avatar_url" character varying(500), "role" "public"."user_role_enum" NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "last_login_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reward_reward_type_enum" AS ENUM('badge', 'title', 'achievement', 'season')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reward" ("reward_id" character varying(255) NOT NULL, "title" character varying(200) NOT NULL, "description" text NOT NULL, "icon_url" character varying(500) NOT NULL, "reward_type" "public"."reward_reward_type_enum" NOT NULL, CONSTRAINT "PK_19c79baf8bd899116136887cc86" PRIMARY KEY ("reward_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."quest_quest_type_enum" AS ENUM('daily', 'weekly', 'event', 'normal')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."quest_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`,
    );
    await queryRunner.query(
      `CREATE TABLE "quest" ("quest_id" character varying(255) NOT NULL, "title" character varying(200) NOT NULL, "description" text NOT NULL, "category" character varying(100) NOT NULL, "quest_type" "public"."quest_quest_type_enum" NOT NULL, "exp_reward" integer NOT NULL, "level_required" integer NOT NULL, "difficulty" "public"."quest_difficulty_enum" NOT NULL, CONSTRAINT "PK_56fc81bbec2ca2ec6ba47a4e2d2" PRIMARY KEY ("quest_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "guardian_relationship" ("guardian_id" character varying(255) NOT NULL, "ward_id" character varying(255) NOT NULL, CONSTRAINT "PK_8097a7357432740130080038c01" PRIMARY KEY ("guardian_id", "ward_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "FK_86d1facc7f5e8bdede6c668fc0b" FOREIGN KEY ("user_quest_id") REFERENCES "user_quest"("user_quest_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "FK_3026413a73124ebf4f0febed6c9" FOREIGN KEY ("reviewer_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quest_image" ADD CONSTRAINT "FK_91f8ae7909e4b23746af283df1e" FOREIGN KEY ("verification_id") REFERENCES "verification"("verification_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_reward" ADD CONSTRAINT "FK_e1af1d9aa9a9f2483339a7fd681" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_reward" ADD CONSTRAINT "FK_610e50c29c8f4ef953f444481d2" FOREIGN KEY ("reward_id") REFERENCES "reward"("reward_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quest" ADD CONSTRAINT "FK_9edd92a2287c93b164656e1d97f" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quest" ADD CONSTRAINT "FK_a96235c755bbc9b487ca95f63fd" FOREIGN KEY ("quest_id") REFERENCES "quest"("quest_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardian_relationship" ADD CONSTRAINT "FK_eeffd9faf063b841e9c5dd3404d" FOREIGN KEY ("guardian_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardian_relationship" ADD CONSTRAINT "FK_8cd6169614463bbe436621fafc8" FOREIGN KEY ("ward_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guardian_relationship" DROP CONSTRAINT "FK_8cd6169614463bbe436621fafc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardian_relationship" DROP CONSTRAINT "FK_eeffd9faf063b841e9c5dd3404d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quest" DROP CONSTRAINT "FK_a96235c755bbc9b487ca95f63fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quest" DROP CONSTRAINT "FK_9edd92a2287c93b164656e1d97f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_reward" DROP CONSTRAINT "FK_610e50c29c8f4ef953f444481d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_reward" DROP CONSTRAINT "FK_e1af1d9aa9a9f2483339a7fd681"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quest_image" DROP CONSTRAINT "FK_91f8ae7909e4b23746af283df1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "FK_3026413a73124ebf4f0febed6c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "FK_86d1facc7f5e8bdede6c668fc0b"`,
    );
    await queryRunner.query(`DROP TABLE "guardian_relationship"`);
    await queryRunner.query(`DROP TABLE "quest"`);
    await queryRunner.query(`DROP TYPE "public"."quest_difficulty_enum"`);
    await queryRunner.query(`DROP TYPE "public"."quest_quest_type_enum"`);
    await queryRunner.query(`DROP TABLE "reward"`);
    await queryRunner.query(`DROP TYPE "public"."reward_reward_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
    await queryRunner.query(`DROP TABLE "user_quest"`);
    await queryRunner.query(`DROP TYPE "public"."user_quest_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_reward"`);
    await queryRunner.query(`DROP TABLE "user_quest_image"`);
    await queryRunner.query(`DROP TABLE "verification"`);
    await queryRunner.query(
      `DROP TYPE "public"."verification_review_type_enum"`,
    );
  }
}
