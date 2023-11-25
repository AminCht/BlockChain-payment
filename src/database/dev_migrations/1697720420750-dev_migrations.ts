import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1697720420750 implements MigrationInterface {
    name = 'DevMigrations1697720420750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Messages" ("id" SERIAL NOT NULL, "senderId" integer NOT NULL, "recieverId" integer NOT NULL, "text" character varying NOT NULL, "ticketId" integer, CONSTRAINT "PK_ecc722506c4b974388431745e8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Tickets" ("id" SERIAL NOT NULL, "subject" character varying NOT NULL, CONSTRAINT "PK_6533595a87a7d0e3b7ed082b2aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "currencies" ALTER COLUMN "decimals" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Messages" ADD CONSTRAINT "FK_44d2fa230557ece0dae02ef723c" FOREIGN KEY ("ticketId") REFERENCES "Tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Messages" DROP CONSTRAINT "FK_44d2fa230557ece0dae02ef723c"`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "currencies" ALTER COLUMN "decimals" SET DEFAULT '18'`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`DROP TABLE "Tickets"`);
        await queryRunner.query(`DROP TABLE "Messages"`);
    }

}
