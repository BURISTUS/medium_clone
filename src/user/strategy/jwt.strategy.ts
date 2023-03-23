import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { JWT_CONFIG } from 'libs/config/src';
import { UserEntity } from 'libs/entities/src';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
        console.log(payload);
        const user = await this.userEntity.findOne({
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
