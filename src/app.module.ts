import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initialDbConfiguration } from 'libs/config/src/postgres.config';
import {
    ArticleEntity,
    FollowsEntity,
    TagEntity,
    UserEntity,
} from 'libs/entities/src';
import { UserModule } from './user/user.module';
// import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { ArticleModule } from './article/article.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(initialDbConfiguration),
        TypeOrmModule.forFeature([
            TagEntity,
            UserEntity,
            ArticleEntity,
            FollowsEntity,
        ]),
        TagModule,
        UserModule,
        ArticleModule,
        ProfileModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
