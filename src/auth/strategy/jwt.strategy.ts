import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/User.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req.cookies['accessToken'], // Extract token from cookie
            ]),
            secretOrKey: process.env.JWT_SECRET,
        });
    }
    async validate(payload: { username: string; id: number }) {
        const user = await this.userRepo.findOne({
            where: {
                id: payload.id,
            },
        });
        if (!user) {
            throw new UnauthorizedException('invalid token');
        }
        delete user.password;
        return user;
    }
}
