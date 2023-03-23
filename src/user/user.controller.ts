import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    UseGuards,
    Put,
} from '@nestjs/common';
import { UserEntity } from 'libs/entities/src';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { IUserResponse } from './types/userResponse.interface';
import { UserService } from './user.service';
import { Request } from 'express';
import { GetUser } from './decorator';
import { JwtGuard } from './guard';
import { EditUserDto } from './dto/edit-user.dto';
import { UpdateResult } from 'typeorm';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('users')
    async createUser(
        @Body('user') createUserDto: CreateUserDto,
    ): Promise<IUserResponse> {
        const user = await this.userService.createUser(createUserDto);
        return await this.userService.buildUserResponse(user);
    }

    @Post('users/login')
    async loginUser(
        @Body('user') loginUserDto: LoginUserDto,
    ): Promise<IUserResponse> {
        const user = await this.userService.loginUser(loginUserDto);
        return await this.userService.buildUserResponse(user);
    }

    @UseGuards(JwtGuard)
    @Get('user')
    async getUser(@GetUser() user: UserEntity): Promise<IUserResponse> {
        return await this.userService.buildUserResponse(user);
    }

    @UseGuards(JwtGuard)
    @Put('user')
    async editUser(
        @GetUser('id') userId: number,
        @Body('user') editUserDto: EditUserDto,
    ): Promise<IUserResponse> {
        const user = await this.userService.editUser(userId, editUserDto);
        return await this.userService.buildUserResponse(user);
    }
}
// 15 урок дальше
