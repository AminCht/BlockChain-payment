import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from '../database/entities/User.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminRequestDto } from './dto/createAdmin.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwt: JwtService,
        private authService: AuthService
    ){}
    
    public async createAdmin(dto: AdminRequestDto): Promise< { message: string }>{
        try{
            const hashedPassword = await this.authService.hashPassword(dto.password);
            const admin = this.userRepo.create({
                username: dto.username,
                password: hashedPassword
            });
            await this.userRepo.save(admin);
            return {message: 'You have successfully Signed Up'}
        } catch(error){
            if (error.code === '23505') {
                throw new ForbiddenException('This UserName has already taken');
            }
            throw error;
        }
    }

    public async adminLogin(dto: AdminRequestDto):Promise<{ access_token: string }>{
        const admin = await this.userRepo.findOne({
            where:{
                username: dto.username
            }
        });
        if(!admin){
            throw new ForbiddenException('Credentials incorrect');
        }
        const isMatch = await bcrypt.compare(dto.password, admin.password);
        if(isMatch){
            return await this.signTokenForAdmin(admin.role, admin.id, admin.username)
        }
    }

    public async deleteAdmin(id: number, user:User): Promise <void>{
        if(user.role == Role.ADMIN){
            await this.userRepo.delete({
                id: id
            });
        }
        throw new ForbiddenException('Only Admins can delete admins');
    }


    public async getAllUsers(user: User): Promise <User[]>{
        if(user.role == Role.ADMIN){
            const users = this.userRepo.find();
            return users;
        }
        throw new ForbiddenException('Only Admins can see All users');
    }

    private async signTokenForAdmin(role: string, id: number, username: string): Promise<{ access_token: string }> {
        const payload = {role: role, id: id, username: username};
        const token = await this.jwt.signAsync(payload);
        return { access_token: token };
    }
}
