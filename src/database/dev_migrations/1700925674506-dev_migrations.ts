import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1700925674506 implements MigrationInterface {
    name = 'DevMigrations1700925674506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Messages" ("id" SERIAL NOT NULL, "senderId" integer NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "ticketId" integer, CONSTRAINT "PK_ecc722506c4b974388431745e8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Tickets" ("id" SERIAL NOT NULL, "subject" character varying NOT NULL, "status" integer NOT NULL DEFAULT '0', "userId" integer, CONSTRAINT "PK_6533595a87a7d0e3b7ed082b2aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "currencies" ALTER COLUMN "decimals" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Messages" ADD CONSTRAINT "FK_44d2fa230557ece0dae02ef723c" FOREIGN KEY ("ticketId") REFERENCES "Tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Tickets" ADD CONSTRAINT "FK_f2074c269d97f7a06dda867c964" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tickets" DROP CONSTRAINT "FK_f2074c269d97f7a06dda867c964"`);
        await queryRunner.query(`ALTER TABLE "Messages" DROP CONSTRAINT "FK_44d2fa230557ece0dae02ef723c"`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "currencies" ALTER COLUMN "decimals" SET DEFAULT '18'`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "description"`);
        await queryRunner.query(`DROP TABLE "Tickets"`);
        await queryRunner.query(`DROP TABLE "Messages"`);
    }

}
