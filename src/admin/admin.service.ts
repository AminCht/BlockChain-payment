import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminRequestDto } from './dto/createAdmin.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwt: JwtService,
        private authService: AuthService
    ){}
    
    async createAdmin(dto: CreateAdminRequestDto){
        try{
            const hashedPassword = await this.authService.hashPassword(dto.password);
            const admin = this.userRepo.create({
                username: dto.username,
                password: hashedPassword
            });
            await this.userRepo.save(admin);
        } catch(error){
            if (error.code === '23505') {
                throw new ForbiddenException('This UserName has already taken');
            }
            throw error;
        }
    }

}
