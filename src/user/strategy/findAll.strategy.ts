import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { JWT_CONFIG } from 'libs/config/src';
import { UserEntity } from 'libs/entities/src';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllStrategy extends PassportStrategy(Strategy, 'findAll') {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userEntity: Repository<UserEntity>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_CONFIG.secret,
        });
    }

    async validate(payload: { sub: number; email: string }) {
        const user = await this.userEntity.findOne({
            where: { id: payload.sub },
        });

        if (!user) {
            return;
        }

        return user;
    }
}
