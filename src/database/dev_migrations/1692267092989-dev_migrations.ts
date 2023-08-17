import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1692267092989 implements MigrationInterface {
    name = 'DevMigrations1692267092989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "network" character varying NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_71016f972669774c1ec89b266bd" UNIQUE ("network", "symbol"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency_user" ("currenciesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_ff10a169857b57c992b84d79288" PRIMARY KEY ("currenciesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fb9a5ea3c401ba6124b9940094" ON "currency_user" ("currenciesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8b9c94bd2378f5616d3df600c" ON "currency_user" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "currency_user" ADD CONSTRAINT "FK_fb9a5ea3c401ba6124b99400940" FOREIGN KEY ("currenciesId") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "currency_user" ADD CONSTRAINT "FK_b8b9c94bd2378f5616d3df600c4" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency_user" DROP CONSTRAINT "FK_b8b9c94bd2378f5616d3df600c4"`);
        await queryRunner.query(`ALTER TABLE "currency_user" DROP CONSTRAINT "FK_fb9a5ea3c401ba6124b99400940"`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8b9c94bd2378f5616d3df600c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb9a5ea3c401ba6124b9940094"`);
        await queryRunner.query(`DROP TABLE "currency_user"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
    }

}
