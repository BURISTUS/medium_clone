import * as config from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IPostgresConfig } from './interfaces';
import {
    ArticleEntity,
    FollowsEntity,
    TagEntity,
    UserEntity,
} from 'libs/entities/src';
import { DataSource } from 'typeorm';
// import {} from '@app/entities';

export const POSTGRES_CONFIG = config.get<IPostgresConfig>('postgres');

export const initialDbConfiguration: TypeOrmModuleOptions = {
    type: 'postgres',
    host: POSTGRES_CONFIG.host,
    port: POSTGRES_CONFIG.port,
    username: POSTGRES_CONFIG.username,
    password: POSTGRES_CONFIG.password,
    database: POSTGRES_CONFIG.database,
    entities: [TagEntity, UserEntity, ArticleEntity, FollowsEntity],
    // migrations: ['./libs/migrations/**/*{.ts, .js}/'],
    migrations: ['./dist/libs/migrations/**/*{.ts,.js}'],
    logging: false,
    synchronize: POSTGRES_CONFIG.synchronize,
};

export const typeOrmConfig = new DataSource({
    type: 'postgres',
    host: POSTGRES_CONFIG.host,
    port: POSTGRES_CONFIG.port,
    username: POSTGRES_CONFIG.username,
    password: POSTGRES_CONFIG.password,
    database: POSTGRES_CONFIG.database,
    entities: [TagEntity, UserEntity, ArticleEntity, FollowsEntity],
    migrations: ['./dist/libs/migrations/**/*{.ts,.js}'],
    logging: false,
    synchronize: POSTGRES_CONFIG.synchronize,
});

export const seedConfig = new DataSource({
    type: 'postgres',
    host: POSTGRES_CONFIG.host,
    port: POSTGRES_CONFIG.port,
    username: POSTGRES_CONFIG.username,
    password: POSTGRES_CONFIG.password,
    database: POSTGRES_CONFIG.database,
    entities: [TagEntity, UserEntity, ArticleEntity, FollowsEntity],
    migrations: ['./dist/libs/seeds/**/*{.ts,.js}'],
    logging: false,
    synchronize: POSTGRES_CONFIG.synchronize,
});
