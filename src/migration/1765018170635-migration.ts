import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765018170635 implements MigrationInterface {
    name = 'Migration1765018170635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "consent_request_image" ("consent_request_image_id" SERIAL NOT NULL, "image_url" character varying(500) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "consent_request_consent_request_id" integer, CONSTRAINT "PK_f031f9839f94fba973de268e6e3" PRIMARY KEY ("consent_request_image_id"))`);
        await queryRunner.query(`CREATE TABLE "consent_review" ("consent_review_id" SERIAL NOT NULL, "comment" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "reviewer_user_id" integer, "consent_request_consent_request_id" integer, CONSTRAINT "PK_215745aee1606cdddca4fe779d3" PRIMARY KEY ("consent_review_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."consent_request_request_type_enum" AS ENUM('MENTOR', 'COMMUNITY')`);
        await queryRunner.query(`CREATE TABLE "consent_request" ("consent_request_id" SERIAL NOT NULL, "request_type" "public"."consent_request_request_type_enum" NOT NULL, "title" character varying(200), "content" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "author_user_id" integer, "user_quest_user_quest_id" integer, CONSTRAINT "UQ_789ad90028214b5824b673cda33" UNIQUE ("user_quest_user_quest_id", "request_type"), CONSTRAINT "PK_4dc882bccb8782e6a12366f03a6" PRIMARY KEY ("consent_request_id"))`);
        await queryRunner.query(`ALTER TABLE "consent_request_image" ADD CONSTRAINT "FK_f875e303c423c7b20a982da6bd2" FOREIGN KEY ("consent_request_consent_request_id") REFERENCES "consent_request"("consent_request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consent_review" ADD CONSTRAINT "FK_57df43e6d2a52902861b789d13c" FOREIGN KEY ("reviewer_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consent_review" ADD CONSTRAINT "FK_c9de044328bc27d8bd27ba21b98" FOREIGN KEY ("consent_request_consent_request_id") REFERENCES "consent_request"("consent_request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consent_request" ADD CONSTRAINT "FK_fbca929a03ea442ab3be572148a" FOREIGN KEY ("author_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consent_request" ADD CONSTRAINT "FK_89cb92159d1c31a687649f820bb" FOREIGN KEY ("user_quest_user_quest_id") REFERENCES "user_quest"("user_quest_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consent_request" DROP CONSTRAINT "FK_89cb92159d1c31a687649f820bb"`);
        await queryRunner.query(`ALTER TABLE "consent_request" DROP CONSTRAINT "FK_fbca929a03ea442ab3be572148a"`);
        await queryRunner.query(`ALTER TABLE "consent_review" DROP CONSTRAINT "FK_c9de044328bc27d8bd27ba21b98"`);
        await queryRunner.query(`ALTER TABLE "consent_review" DROP CONSTRAINT "FK_57df43e6d2a52902861b789d13c"`);
        await queryRunner.query(`ALTER TABLE "consent_request_image" DROP CONSTRAINT "FK_f875e303c423c7b20a982da6bd2"`);
        await queryRunner.query(`DROP TABLE "consent_request"`);
        await queryRunner.query(`DROP TYPE "public"."consent_request_request_type_enum"`);
        await queryRunner.query(`DROP TABLE "consent_review"`);
        await queryRunner.query(`DROP TABLE "consent_request_image"`);
    }

}
