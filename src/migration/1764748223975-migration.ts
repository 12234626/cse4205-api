import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764748223975 implements MigrationInterface {
    name = 'Migration1764748223975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."verification_review_type_enum" RENAME TO "verification_review_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."verification_review_type_enum" AS ENUM('mentor', 'community', 'guideline')`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "review_type" TYPE "public"."verification_review_type_enum" USING "review_type"::"text"::"public"."verification_review_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."verification_review_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."verification_review_type_enum_old" AS ENUM('mentor', 'community')`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "review_type" TYPE "public"."verification_review_type_enum_old" USING "review_type"::"text"::"public"."verification_review_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."verification_review_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."verification_review_type_enum_old" RENAME TO "verification_review_type_enum"`);
    }

}
