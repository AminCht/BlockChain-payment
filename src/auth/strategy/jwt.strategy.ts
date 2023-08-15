import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(User) private userRepo: Repository<User>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }
    async validate(payload:{
        username: string, id: number
    }){
        const user = await this.userRepo.findOne({
            where:{
                id: payload.id
            }
        });
        if(!user){
            throw new UnauthorizedException('invalid token')
        }
        delete user.password
        return user;
    }
}