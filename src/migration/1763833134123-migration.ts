import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763833134123 implements MigrationInterface {
    name = 'Migration1763833134123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reward" ("reward_id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "description" text NOT NULL, "icon_url" character varying(500) NOT NULL, "reward_type" "public"."reward_reward_type_enum" NOT NULL, CONSTRAINT "PK_19c79baf8bd899116136887cc86" PRIMARY KEY ("reward_id"))`);
        await queryRunner.query(`CREATE TABLE "user_reward" ("user_reward_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "reward_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c85339b04d66c1f2241e16671d" PRIMARY KEY ("user_reward_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "provider" "public"."user_provider_enum" NOT NULL, "provider_id" character varying(255) NOT NULL, "role" "public"."user_role_enum" NOT NULL, "username" character varying(15) NOT NULL, "age" integer, "level" integer NOT NULL DEFAULT '1', "exp" integer NOT NULL DEFAULT '0', "streak" integer NOT NULL DEFAULT '0', "avatar_url" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "mentor_user_id" integer, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "quest" ("quest_id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "description" text NOT NULL, "category" character varying(100) NOT NULL, "quest_type" "public"."quest_quest_type_enum" NOT NULL, "exp_reward" integer NOT NULL, "level_required" integer NOT NULL, "difficulty" "public"."quest_difficulty_enum" NOT NULL, CONSTRAINT "PK_56fc81bbec2ca2ec6ba47a4e2d2" PRIMARY KEY ("quest_id"))`);
        await queryRunner.query(`CREATE TABLE "user_quest" ("user_quest_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "quest_id" integer NOT NULL, "status" "public"."user_quest_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "completed_at" TIMESTAMP, "user_user_id" integer, "quest_quest_id" integer, CONSTRAINT "PK_a8dc8dc1f5c277b5d2444bac512" PRIMARY KEY ("user_quest_id"))`);
        await queryRunner.query(`CREATE TABLE "verification_image" ("image_id" SERIAL NOT NULL, "verification_id" integer NOT NULL, "image_url" character varying(500) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "verification_verification_id" integer, CONSTRAINT "PK_b2bd3e115725f1ac2122158d0e4" PRIMARY KEY ("image_id"))`);
        await queryRunner.query(`CREATE TABLE "verification" ("verification_id" SERIAL NOT NULL, "user_quest_id" integer NOT NULL, "reviewer_id" integer NOT NULL, "review_type" "public"."verification_review_type_enum" NOT NULL, "vote" boolean NOT NULL, "comment" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_quest_user_quest_id" integer, "reviewer_user_id" integer, CONSTRAINT "PK_9e7eb9e23e11af4d8a03ee7ceca" PRIMARY KEY ("verification_id"))`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD CONSTRAINT "FK_e1af1d9aa9a9f2483339a7fd681" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD CONSTRAINT "FK_610e50c29c8f4ef953f444481d2" FOREIGN KEY ("reward_id") REFERENCES "reward"("reward_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7d083a2e96803139a208af36ccc" FOREIGN KEY ("mentor_user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD CONSTRAINT "FK_ca9db3b2384551bfa8e2f410f90" FOREIGN KEY ("user_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD CONSTRAINT "FK_24e549e2a47abf793c628fc4c9e" FOREIGN KEY ("quest_quest_id") REFERENCES "quest"("quest_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification_image" ADD CONSTRAINT "FK_a2e8c6b7ce5ce17395459eec448" FOREIGN KEY ("verification_verification_id") REFERENCES "verification"("verification_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "FK_0073b5e875ab75c359a93343d19" FOREIGN KEY ("user_quest_user_quest_id") REFERENCES "user_quest"("user_quest_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "FK_f67a5da6bff52297fc7e22ad408" FOREIGN KEY ("reviewer_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "FK_f67a5da6bff52297fc7e22ad408"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "FK_0073b5e875ab75c359a93343d19"`);
        await queryRunner.query(`ALTER TABLE "verification_image" DROP CONSTRAINT "FK_a2e8c6b7ce5ce17395459eec448"`);
        await queryRunner.query(`ALTER TABLE "user_quest" DROP CONSTRAINT "FK_24e549e2a47abf793c628fc4c9e"`);
        await queryRunner.query(`ALTER TABLE "user_quest" DROP CONSTRAINT "FK_ca9db3b2384551bfa8e2f410f90"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7d083a2e96803139a208af36ccc"`);
        await queryRunner.query(`ALTER TABLE "user_reward" DROP CONSTRAINT "FK_610e50c29c8f4ef953f444481d2"`);
        await queryRunner.query(`ALTER TABLE "user_reward" DROP CONSTRAINT "FK_e1af1d9aa9a9f2483339a7fd681"`);
        await queryRunner.query(`DROP TABLE "verification"`);
        await queryRunner.query(`DROP TABLE "verification_image"`);
        await queryRunner.query(`DROP TABLE "user_quest"`);
        await queryRunner.query(`DROP TABLE "quest"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_reward"`);
        await queryRunner.query(`DROP TABLE "reward"`);
    }

}
