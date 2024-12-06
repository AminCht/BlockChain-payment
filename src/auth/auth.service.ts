import {ForbiddenException, BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../database/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwt: JwtService,
    ) {}

    public async signUp(dto: AuthDto): Promise<{ message: string }> {
        try {
            const hashPassword = await this.hashPassword(dto.password);
            const user = this.userRepo.create({
                username: dto.username,
                password: hashPassword,
            });
            await this.userRepo.save(user);
            return { message: 'You have been registered successfully' };
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('This UserName has already taken');
            }
            throw error;
        }
    }

    public async login(dto: AuthDto): Promise<{ access_token: string }> {
        const user = await this.userRepo.findOne({
            where: {
                username: dto.username,
            },
        });
        if (!user) {
            throw new NotFoundException();
        }
        if (user) {
            const isMatch = await bcrypt.compare(dto.password, user.password);
            if(isMatch){
                return await this.signToken(user.id, user.username);
            }
        }
        throw new UnauthorizedException('Credentials incorrect');
    }
    private async signToken(id: number, username: string): Promise<{ access_token:string }> {
        const payload = { username: username, id: id };
        const token = await this.jwt.signAsync(payload);
        return { access_token: token };
    }
    public async hashPassword(password: string):Promise<string>{
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
}
