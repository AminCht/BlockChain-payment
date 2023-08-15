import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwt: JwtService
        ){}

    async signUp(dto: AuthDto){
        try{
            const hashPassword = await this.hashPassword(dto.password)
            const user = this.userRepo.create({
                username: dto.username,
                password: hashPassword
            });
            await this.userRepo.save(user);
            return this.signToken(user.id,user.username);
        } catch(error){
            if(error.code === 'P2002'){
                throw new ForbiddenException('This UserName has already taken');
            }
        }
    }

    async login(dto: AuthDto){
        const hashPassword = await this.hashPassword(dto.password);
        const user = await this.userRepo.findOne({
            where:{
                username: dto.username,
                password: hashPassword
            }
        });
        if(!user){
            throw new ForbiddenException('Username or password is incorrect');
        }
        return this.signToken(user.id, user.username);
    }


    async signToken(id: number, username: string){
        const payload = { username:username, id:id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20 };
        const token = await this.jwt.signAsync(payload);
        return {accesstoken: token};
    }


    async hashPassword(password: string){
        const hashRounds = 20
        const saltRounds = 10
        for (let i = 0; i < hashRounds; i++) {
            password = await bcrypt.hash(password, saltRounds);
        }
        return password;
    }


}
