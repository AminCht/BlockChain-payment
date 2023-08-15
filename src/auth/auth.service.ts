import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
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

    public async signUp(dto: AuthDto, res: Response) {
        try {
            const hashPassword = await this.hashPassword(dto.password);
            const user = this.userRepo.create({
                username: dto.username,
                password: hashPassword,
            });
            await this.userRepo.save(user);
            return this.signToken(user.id, user.username, res);
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

    public async login(dto: AuthDto, res: Response) {
        const user = await this.userRepo.findOne({
            where: {
                username: dto.username,
            },
        });
        if (user) {
            const isMatch = await bcrypt.compare(dto.password, user.password);
            if(isMatch){
                return this.signToken(user.id, user.username, res);
            }
        }
        throw new ForbiddenException('username or password is incorrect');
        
    }
    private async signToken(id: number, username: string, res: Response) {
        console.log('user')
        const payload = { username:username, id:id };
        const token = await this.jwt.signAsync(payload);
        this.setCookie(res, token);
        console.log('user');
        return { access_token: token };
    }


    async hashPassword(password: string){
        const hashRounds = 20

        const saltRounds = 10
        
        return await bcrypt.hash(password,saltRounds);
    }

    setCookie(res: Response, token: string){
        res.cookie('accessToken', token, {
            httpOnly: true,
        });
    }
}
