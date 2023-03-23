import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TableNames } from './enums';

@Entity({ name: TableNames.FOLLOWS })
export class FollowsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    followerId: number;

    @Column()
    followingId: number;
}
