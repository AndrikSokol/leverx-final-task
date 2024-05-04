import { PROFILE_DATA } from '@/constants/profileData';
import { REVIEW_DATA } from '@/constants/reviewData';
import { USER_DATA } from '@/constants/userData';
import { VINYL_DATA } from '@/constants/vinylData';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Data1714672132117 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "user" (first_name, last_name, email, role, password_hash) VALUES 
        ${USER_DATA.map((user) => `('${user.firstName}', '${user.lastName}', '${user.email}','${user.role}', '${user.passwordHash}')`).join(',')}
      `);

    await queryRunner.query(`
        INSERT INTO profile (user_id, birthdate) VALUES 
        ${PROFILE_DATA.map((profile) => `(${profile.userId}, '${profile.birthdate}')`).join(',')}
      `);

    await queryRunner.query(`
      INSERT INTO vinyl ( name, description, author_name, price, link) VALUES 
      ${VINYL_DATA.map((vinyl) => `('${vinyl.name}', '${vinyl.description}', '${vinyl.authorName}', ${vinyl.price}, '${vinyl.link}')`).join(',')}
  `);

    await queryRunner.query(`
    INSERT INTO review (comment, score, user_id, vinyl_id) VALUES 
    ${REVIEW_DATA.map((review) => `('${review.comment}', ${review.score}, ${review.userId}, ${review.vinylId})`).join(',')}
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
