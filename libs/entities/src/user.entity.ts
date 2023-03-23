import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TableNames } from './enums';
import * as argon from 'argon2';
import { ArticleEntity } from './article.entity';

@Entity({ name: TableNames.USERS })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    image: string;

    @Column({ select: false })
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon.hash(this.password);
    }

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[];

    @ManyToMany(() => ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[];
}
