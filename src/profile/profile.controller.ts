import { GetUser } from '@app/user/decorator';
import { JwtGuard } from '@app/user/guard';
import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { IProfileResponse } from './types';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get(':username')
    async getProfile(
        @GetUser('id') userId: number,
        @Param('username') username: string,
    ): Promise<IProfileResponse> {
        const profile = await this.profileService.getProfile(userId, username);
        return this.profileService.buildProfileResponse(profile);
    }

    @Post(':username/follow')
    @UseGuards(JwtGuard)
    async followingProfile(
        @GetUser('id') userId: number,
        @Param('username') username: string,
    ): Promise<IProfileResponse> {
        const follower = await this.profileService.followingProfile(
            userId,
            username,
        );

        return this.profileService.buildProfileResponse(follower);
    }

    @Delete(':username/follow')
    @UseGuards(JwtGuard)
    async unfollowProfile(
        @GetUser('id') userId: number,
        @Param('username') username: string,
    ): Promise<IProfileResponse> {
        console.log(userId);
        const follow = await this.profileService.unfollowProfile(
            userId,
            username,
        );
        return this.profileService.buildProfileResponse(follow);
    }
}
