import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from '../database/entities/User.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {AdminRequestDto, CreateAdminResponseDto, GetAllUsersResponseDto} from './dto/createAdmin.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwt: JwtService,
        private authService: AuthService,
    ){}
    
    public async createAdmin(dto: AdminRequestDto): Promise<CreateAdminResponseDto> {
        try{
            const hashedPassword = await this.authService.hashPassword(dto.password);
            const admin = this.userRepo.create({
                username: dto.username,
                password: hashedPassword,
                role: Role.ADMIN,
            });
            await this.userRepo.save(admin);
            return { message: 'You have successfully Signed Up' };
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('This UserName is already taken');
            }
            throw error;
        }
    }

    public async adminLogin(dto: AdminRequestDto):Promise<{ access_token: string }>{
        const admin = await this.userRepo.findOne({
            where:{
                username: dto.username,
                role: Role.ADMIN
            }
        });
        if(!admin){
            throw new UnauthorizedException('Credentials incorrect');
        }
        const isMatch = await bcrypt.compare(dto.password, admin.password);
        if(isMatch){
            return await this.signTokenForAdmin(admin.role, admin.id, admin.username)
        }
        throw new UnauthorizedException('Credentials incorrect');
    }

    public async deleteAdmin(id: number): Promise<{ message: string }> {
        const admin = await this.userRepo.findOne({
            where: {
                id: id,
                role: Role.ADMIN,
            },
        });
        if (admin) {
            await this.userRepo.delete({
                id: id,
            });
            return { message: 'Admin deleted' };
        }
        throw new NotFoundException('Admin not found');
    }
    public async getAllUsers(): Promise<GetAllUsersResponseDto[]> {
        return await this.getUsers(Role.USER);
    }

    public async getAllAdmins(): Promise<GetAllUsersResponseDto[]> {
        return await this.getUsers(Role.ADMIN);
    }

    public async getUsers(role: Role){
        const users = this.userRepo.find({
            where:{
                role: role
            }
        });
        return users;
    }
    private async signTokenForAdmin(role: string, id: number, username: string): Promise<{ access_token: string }> {
        const payload = {role: role, id: id, username: username};
        const token = await this.jwt.signAsync(payload);
        return { access_token: token };
    }
}