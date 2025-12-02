import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764691045986 implements MigrationInterface {
    name = 'Migration1764691045986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7d083a2e96803139a208af36ccc"`);
        await queryRunner.query(`CREATE TYPE "public"."mentor_request_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "mentor_request" ("mentor_request_id" SERIAL NOT NULL, "status" "public"."mentor_request_status_enum" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "mentee_user_id" integer, "mentor_user_id" integer, CONSTRAINT "PK_810f44ff56db44262d8a9162024" PRIMARY KEY ("mentor_request_id"))`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "comment" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7d083a2e96803139a208af36ccc" FOREIGN KEY ("mentor_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_request" ADD CONSTRAINT "FK_0efa2ce6b939f8afc952faa382b" FOREIGN KEY ("mentee_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_request" ADD CONSTRAINT "FK_29051d73a77a27a25dd1ee31fbe" FOREIGN KEY ("mentor_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor_request" DROP CONSTRAINT "FK_29051d73a77a27a25dd1ee31fbe"`);
        await queryRunner.query(`ALTER TABLE "mentor_request" DROP CONSTRAINT "FK_0efa2ce6b939f8afc952faa382b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7d083a2e96803139a208af36ccc"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "comment" character varying(500)`);
        await queryRunner.query(`DROP TABLE "mentor_request"`);
        await queryRunner.query(`DROP TYPE "public"."mentor_request_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7d083a2e96803139a208af36ccc" FOREIGN KEY ("mentor_user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
