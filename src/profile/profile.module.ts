import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsEntity, UserEntity } from 'libs/entities/src';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, FollowsEntity])],
    providers: [ProfileService],
    controllers: [ProfileController],
})
export class ProfileModule {}
