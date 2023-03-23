import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowsEntity, UserEntity } from 'libs/entities/src';
import { Repository } from 'typeorm';
import { IProfileResponse, ProfileType } from './types';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowsEntity)
        private readonly followRepository: Repository<FollowsEntity>,
    ) {}

    async getProfile(userId: number, username: string): Promise<ProfileType> {
        const profile = await this.userRepository.findOne({
            where: {
                username,
            },
        });

        if (!profile) {
            throw new HttpException(
                "Can't find user with this username",
                HttpStatus.NOT_FOUND,
            );
        }

        const follow = await this.followRepository.findOne({
            where: {
                followerId: userId,
                followingId: profile.id,
            },
        });

        return { ...profile, following: Boolean(follow) };
    }

    async followingProfile(
        userId: number,
        username: string,
    ): Promise<ProfileType> {
        const profile = await this.userRepository.findOne({
            where: {
                username,
            },
        });

        if (!profile) {
            throw new HttpException(
                "Can't find user with this username",
                HttpStatus.NOT_FOUND,
            );
        }

        if (profile.id === userId) {
            throw new HttpException(
                "Can't follow youself",
                HttpStatus.BAD_REQUEST,
            );
        }

        const follow = await this.followRepository.findOne({
            where: {
                followerId: userId,
                followingId: profile.id,
            },
        });

        if (!follow) {
            const createFollow = new FollowsEntity();
            createFollow.followerId = userId;
            createFollow.followingId = profile.id;
            await this.followRepository.save(createFollow);
        }

        return { ...profile, following: true };
    }

    async unfollowProfile(
        userId: number,
        username: string,
    ): Promise<ProfileType> {
        const profile = await this.userRepository.findOne({
            where: {
                username,
            },
        });

        if (!profile) {
            throw new HttpException(
                "Can't find user with this username",
                HttpStatus.NOT_FOUND,
            );
        }

        if (profile.id === userId) {
            throw new HttpException(
                "Can't unfollow youself",
                HttpStatus.BAD_REQUEST,
            );
        }

        const follow = await this.followRepository.findOne({
            where: {
                followerId: userId,
                followingId: profile.id,
            },
        });

        if (!follow) {
            throw new HttpException(
                "You don't follow this profile",
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.followRepository.delete({
            followerId: userId,
            followingId: profile.id,
        });

        return { ...profile, following: false };
    }

    buildProfileResponse(profile: ProfileType): IProfileResponse {
        delete profile.email;
        return { profile };
    }
}
