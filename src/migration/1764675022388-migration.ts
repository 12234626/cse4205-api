import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764675022388 implements MigrationInterface {
    name = 'Migration1764675022388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_ed7fb581805bf7e002dd9426b79"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_dd13e2801d2073391f346a58ae1" UNIQUE ("provider", "provider_id")`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_ed7fb581805bf7e002dd9426b79" FOREIGN KEY ("user_user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_ed7fb581805bf7e002dd9426b79"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_dd13e2801d2073391f346a58ae1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_ed7fb581805bf7e002dd9426b79" FOREIGN KEY ("user_user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
