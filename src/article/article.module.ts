import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, FollowsEntity, UserEntity } from 'libs/entities/src';

@Module({
    imports: [
        TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowsEntity]),
    ],
    providers: [ArticleService],
    controllers: [ArticleController],
})
export class ArticleModule {}
