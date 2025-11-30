import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764521694277 implements MigrationInterface {
    name = 'Migration1764521694277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token" ("token_id" SERIAL NOT NULL, "access_token" character varying(255) NOT NULL, "refresh_token" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_user_id" integer, CONSTRAINT "UQ_d5b9f4694521b7fbb121aff3857" UNIQUE ("access_token"), CONSTRAINT "UQ_b95cd28e9bf58b05f50e4ff9098" UNIQUE ("refresh_token"), CONSTRAINT "PK_cab3c454b0419a03584a3990ce0" PRIMARY KEY ("token_id"))`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_ed7fb581805bf7e002dd9426b79" FOREIGN KEY ("user_user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_ed7fb581805bf7e002dd9426b79"`);
        await queryRunner.query(`DROP TABLE "token"`);
    }

}
