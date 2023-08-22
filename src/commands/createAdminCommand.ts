import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  User } from '../database/entities/User.entity';
import { AdminService } from '../admin/admin.service';
import { AdminRequestDto } from '../admin/dto/createAdmin.dto';

@Command({ name: 'create-admin' })
export class CreateAdminCommand extends CommandRunner {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private adminService: AdminService
  ) {
        super();
    }
    async run(
        passedParams: string[],
        options?: Record<string, any>,
    ): Promise<void> {
        const admin = new AdminRequestDto();
        admin.username = passedParams[0];
        admin.password = passedParams[1];
        await this.adminService.createAdmin(admin);
    }
    
}
