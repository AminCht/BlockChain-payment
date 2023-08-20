import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from '../database/entities/User.entity';
import { ForbiddenException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Command({ name: 'create-admin' })
export class CreateAdminCommand extends CommandRunner {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private authService: AuthService
  ) {
        super();
    }
    async run(
        passedParams: string[],
        options?: Record<string, any>,
    ): Promise<void> {
        const hashedPassword = await this.authService.hashPassword(passedParams[1]);
        try{
            const user = this.userRepo.create({
                username: passedParams[0],
                password: hashedPassword,
                role: Role.ADMIN,
            });
            await this.userRepo.save(user);
        } catch(error){
            if (error.code === '23505') {
                throw new ForbiddenException('This UserName has already taken');
            }
            throw error;
        }
        
    }
    
}
