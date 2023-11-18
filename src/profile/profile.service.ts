import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';

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
        const hashPassword = await this.authService.hashPassword(dto.newPassword);
        const user = await this.userRepo.findOne({where: {id: userId}});
        user.password = hashPassword;
        await this.userRepo.save(user);
        return {'message': 'Password Has been Changed'}
    }


}
