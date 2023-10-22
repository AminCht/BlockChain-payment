import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {

    constructor(@InjectRepository(User) private userRepo: Repository<User>){}

    async getProfile(userId: number){
        const profile = await this.userRepo.findOne({where:{id: userId}});
        delete profile.password;
        return profile;
    }

}
