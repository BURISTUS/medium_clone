import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1675754811517 implements MigrationInterface {
    name = 'SeedDB1675754811517';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES ('react'), ('angular'), ('nestjs')`,
        );
        //password is 12345
        await queryRunner.query(
            `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$Q3URAKbffhNlUtYt1fhbQA$XZxyyjSpidjVgK8FAFg3ZmIyKFyT1BOdCl6n033Uzb4')`,
        );
        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('article', 'article', 'description', 'body', 'react,nestjs', 1)`,
        );
        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('article1', 'article1', 'description1', 'body1', 'react,nestjs', 1)`,
        );
    }

    public async down(): Promise<void> {}
}
