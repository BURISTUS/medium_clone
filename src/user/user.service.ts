import {
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JWT_CONFIG } from 'libs/config/src';
import { UserEntity } from 'libs/entities/src';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { IUserResponse } from './types/userResponse.interface';
import * as argon from 'argon2';
import { UserType } from './types/user.type';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwt: JwtService,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({
            where: {
                email: createUserDto.email,
            },
        });

        const userByUsername = await this.userRepository.findOne({
            where: {
                username: createUserDto.username,
            },
        });

        if (userByEmail || userByUsername) {
            throw new HttpException(
                'Email or username are taken',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        return await this.userRepository.save(newUser);
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                email: loginUserDto.email,
            },
            select: ['id', 'username', 'email', 'bio', 'image', 'password'],
        });

        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const arePasswordMatches = await argon.verify(
            user.password,
            loginUserDto.password,
        );

        if (!arePasswordMatches) {
            throw new ForbiddenException('Credentials incorrect');
        }

        return user;
    }

    async editUser(
        userId: number,
        editUserDto: EditUserDto,
    ): Promise<UserEntity> {
        console.log(editUserDto);
        const updateResult = await this.userRepository.update(
            userId,
            editUserDto,
        );

        if (!updateResult) {
            throw new ForbiddenException('Problem during update result');
        }

        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        return user;
    }

    async buildUserResponse(user: UserType): Promise<IUserResponse> {
        return {
            user: {
                ...user,
                token: await this.signToken(user.id, user.username, user.email),
            },
        };
    }

    async signToken(
        userId: number,
        username: string,
        email: string,
    ): Promise<string> {
        const payload = {
            sub: userId,
            username,
            email,
        };

        const secret = JWT_CONFIG.secret;

        const token = await this.jwt.signAsync(payload, {
            expiresIn: JWT_CONFIG.expiresIn,
            secret: secret,
        });

        return token;
    }
}
