import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764351384673 implements MigrationInterface {
    name = 'Migration1764351384673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_reward" DROP CONSTRAINT "FK_e1af1d9aa9a9f2483339a7fd681"`);
        await queryRunner.query(`ALTER TABLE "user_reward" DROP CONSTRAINT "FK_610e50c29c8f4ef953f444481d2"`);
        await queryRunner.query(`ALTER TABLE "verification_image" DROP CONSTRAINT "PK_b2bd3e115725f1ac2122158d0e4"`);
        await queryRunner.query(`ALTER TABLE "verification_image" DROP COLUMN "image_id"`);
        await queryRunner.query(`ALTER TABLE "reward" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD "user_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD "reward_reward_id" integer`);
        await queryRunner.query(`ALTER TABLE "quest" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_quest" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "verification_image" ADD "verification_image_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification_image" ADD CONSTRAINT "PK_d690b3bb191aa92875856238f7a" PRIMARY KEY ("verification_image_id")`);
        await queryRunner.query(`ALTER TABLE "verification_image" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD CONSTRAINT "FK_a33adddfef52572a97383c7ff97" FOREIGN KEY ("user_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD CONSTRAINT "FK_9f7904fafbaa35d1f65749e2b81" FOREIGN KEY ("reward_reward_id") REFERENCES "reward"("reward_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_reward" DROP CONSTRAINT "FK_9f7904fafbaa35d1f65749e2b81"`);
        await queryRunner.query(`ALTER TABLE "user_reward" DROP CONSTRAINT "FK_a33adddfef52572a97383c7ff97"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "verification_image" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "verification_image" DROP CONSTRAINT "PK_d690b3bb191aa92875856238f7a"`);
        await queryRunner.query(`ALTER TABLE "verification_image" DROP COLUMN "verification_image_id"`);
        await queryRunner.query(`ALTER TABLE "user_quest" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "quest" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user_reward" DROP COLUMN "reward_reward_id"`);
        await queryRunner.query(`ALTER TABLE "user_reward" DROP COLUMN "user_user_id"`);
        await queryRunner.query(`ALTER TABLE "user_reward" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "reward" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "verification_image" ADD "image_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification_image" ADD CONSTRAINT "PK_b2bd3e115725f1ac2122158d0e4" PRIMARY KEY ("image_id")`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD CONSTRAINT "FK_610e50c29c8f4ef953f444481d2" FOREIGN KEY ("reward_id") REFERENCES "reward"("reward_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_reward" ADD CONSTRAINT "FK_e1af1d9aa9a9f2483339a7fd681" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
