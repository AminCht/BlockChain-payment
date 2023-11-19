import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {

    constructor(@InjectRepository(User) private userRepo: Repository<User>,
                private authService: AuthService
    ){}

    async getProfile(userId: number){
        const profile = await this.userRepo.findOne({where:{id: userId}});
        delete profile.password;
        return profile;
    }

    async changePassword(userId: number, dto: ChangePasswordDto){
        const user = await this.userRepo.findOne({where: {id: userId}});
        const isMatch = await bcrypt.compare(dto.oldPassword, user.password); 
        if(isMatch){
            const hashPassword = await this.authService.hashPassword(dto.newPassword);
            user.password = hashPassword;
            await this.userRepo.save(user);
            return {'message': 'Password Has been Changed'}
        }
        throw new BadRequestException('Old Password is incorrect');
    }


}
