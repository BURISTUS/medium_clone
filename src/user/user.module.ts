import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'libs/entities/src';
import { JwtModule } from '@nestjs/jwt';
import { FindAllStrategy, JwtStrategy } from './strategy';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({})],
    providers: [UserService, JwtStrategy, FindAllStrategy],
    controllers: [UserController],
})
export class UserModule {}
