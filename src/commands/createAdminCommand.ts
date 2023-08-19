import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from '../database/entities/User.entity';

@Command({ name: 'create-admin' })
export class CreateWalletCommand extends CommandRunner {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
        super();
    }
    async run(
        passedParams: string[],
        options?: Record<string, any>,
    ): Promise<void> {
        const user = this.userRepo.create({
            username: passedParams[0],
            password: passedParams[1],
            role: Role.ADMIN
        });
        await this.userRepo.save(user);
        
    }
    
}
