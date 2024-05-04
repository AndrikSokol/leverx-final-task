import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tables1714672111455 implements MigrationInterface {
  name = 'Tables1714672111455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "birthdate" TIMESTAMP, "avatar" character varying, CONSTRAINT "REL_d752442f45f258a8bdefeebb2f" UNIQUE ("user_id"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "review" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "score" integer NOT NULL, "user_id" integer NOT NULL, "vinyl_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vinyl" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "author_name" character varying NOT NULL, "image" character varying, "price" integer NOT NULL, "link" character varying, CONSTRAINT "UQ_c3983f1ada198d3d8405ee69072" UNIQUE ("name"), CONSTRAINT "PK_a35da8699c1edabf461555e8737" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "total_price" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'proccess', CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "google_id" character varying, "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "password_hash" character varying, "role" character varying(10) NOT NULL DEFAULT 'User', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_vinyls_vinyl" ("orderId" integer NOT NULL, "vinylId" integer NOT NULL, CONSTRAINT "PK_a57aca2a1e7c4e1e6905a7792aa" PRIMARY KEY ("orderId", "vinylId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bde5eaa1823f637b1811caa086" ON "order_vinyls_vinyl" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b39361ae6083c692aa3f853e9e" ON "order_vinyls_vinyl" ("vinylId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_81446f2ee100305f42645d4d6c2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_aa52589eb9540029498b0b8a28a" FOREIGN KEY ("vinyl_id") REFERENCES "vinyl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_vinyls_vinyl" ADD CONSTRAINT "FK_bde5eaa1823f637b1811caa0862" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_vinyls_vinyl" ADD CONSTRAINT "FK_b39361ae6083c692aa3f853e9ec" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_vinyls_vinyl" DROP CONSTRAINT "FK_b39361ae6083c692aa3f853e9ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_vinyls_vinyl" DROP CONSTRAINT "FK_bde5eaa1823f637b1811caa0862"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_aa52589eb9540029498b0b8a28a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_81446f2ee100305f42645d4d6c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b39361ae6083c692aa3f853e9e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bde5eaa1823f637b1811caa086"`,
    );
    await queryRunner.query(`DROP TABLE "order_vinyls_vinyl"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "vinyl"`);
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
