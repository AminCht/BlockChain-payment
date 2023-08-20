import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Role, User } from '../../database/entities/User.entity';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req.cookies['accessToken'], // Extract token from cookie
            ]),
            secretOrKey: process.env.JWT_SECRET_ADMIN,
        });
    }
    async validate(payload: { role: string, username: string; id: number }) {
        const user = await this.userRepo.findOne({
            where: {
                id: payload.id,
            },
        });
        if (payload.role == Role.USER) {
            throw new UnauthorizedException('Unauthorized');
        }
        delete user.password;
        return user;
    }
}
