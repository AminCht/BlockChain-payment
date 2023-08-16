import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../database/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwt: JwtService,
    ) {}

    public async signUp(dto: AuthDto) {
        try {
            const hashPassword = await this.hashPassword(dto.password);
            const user = this.userRepo.create({
                username: dto.username,
                password: hashPassword,
            });
            await this.userRepo.save(user);
            return {"message": "You have been reistered successfully"}
        } catch (error) {
            if (error.code === '23505') {
                throw new ForbiddenException('This UserName has already taken');
            }
            if(error.code == "ECONNRESET" ){
                return 'connection timeout';
            }
             else if(error.code == "ENOTFOUND"){
                return 'no connection';
            }
        }
    }

    public async login(dto: AuthDto) {
        const user = await this.userRepo.findOne({
            where: {
                username: dto.username,
            },
        });
        if (user) {
            const isMatch = await bcrypt.compare(dto.password, user.password);
            if(isMatch){
                return this.signToken(user.id, user.username);
            }
        }
        throw new ForbiddenException('username or password is incorrect');
    }
    private async signToken(id: number, username: string) {
        console.log('user')
        const payload = { username:username, id:id };
        const token = await this.jwt.signAsync(payload);
        console.log('user');
        return { access_token: token };
    }


    async hashPassword(password: string){
        const hashRounds = 20

        const saltRounds = 10
        
        return await bcrypt.hash(password,saltRounds);
    }

    
}
