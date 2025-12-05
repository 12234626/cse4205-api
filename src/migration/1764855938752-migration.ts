import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764855938752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "FK_f67a5da6bff52297fc7e22ad408"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" DROP CONSTRAINT "FK_0073b5e875ab75c359a93343d19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_image" DROP CONSTRAINT "FK_a2e8c6b7ce5ce17395459eec448"`,
    );
    await queryRunner.query(`DROP TABLE "verification"`);
    await queryRunner.query(`DROP TABLE "verification_image"`);
    await queryRunner.query(
      `DROP TYPE "public"."verification_review_type_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."verification_review_type_enum" AS ENUM('mentor', 'community')`,
    );
    await queryRunner.query(
      `CREATE TABLE "verification_image" ("image_id" SERIAL NOT NULL, "verification_id" integer NOT NULL, "image_url" character varying(500) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "verification_verification_id" integer, CONSTRAINT "PK_b2bd3e115725f1ac2122158d0e4" PRIMARY KEY ("image_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "verification" ("verification_id" SERIAL NOT NULL, "user_quest_id" integer NOT NULL, "reviewer_id" integer NOT NULL, "review_type" "public"."verification_review_type_enum" NOT NULL, "vote" boolean NOT NULL, "comment" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_quest_user_quest_id" integer, "reviewer_user_id" integer, CONSTRAINT "PK_9e7eb9e23e11af4d8a03ee7ceca" PRIMARY KEY ("verification_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_image" ADD CONSTRAINT "FK_a2e8c6b7ce5ce17395459eec448" FOREIGN KEY ("verification_verification_id") REFERENCES "verification"("verification_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "FK_0073b5e875ab75c359a93343d19" FOREIGN KEY ("user_quest_user_quest_id") REFERENCES "user_quest"("user_quest_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification" ADD CONSTRAINT "FK_f67a5da6bff52297fc7e22ad408" FOREIGN KEY ("reviewer_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
