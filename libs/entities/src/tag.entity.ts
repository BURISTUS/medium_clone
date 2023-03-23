import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TableNames } from './enums';

@Entity({ name: TableNames.TAGS })
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
