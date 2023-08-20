import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import DatabaseModule from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[DatabaseModule,TypeOrmModule.forFeature([User])],
      providers: [AdminService],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should create an admin', async () => {
    const adminDto = {username: 'aminadmin', password: '1234'};
    const response = await service.createAdmin(adminDto);
    expect(response.message).toEqual('You have successfully Signed Up');
  });
  it('shouldnt create an admin with exist username', async () => {
    const adminDto = {username: 'aminadmin', password: '1234'};
    const response = await service.createAdmin(adminDto);
    expect(response.message).toEqual('This UserName has already taken');
  });
  it('should log in admin', async()=>{
    const adminDto = {username: 'aminadmin', password: '1234'};
    const response = await service.adminLogin(adminDto);
    expect(response.access_token).not.toBeNull()
  });
  it('shouldnt log in admin for wrong', async()=>{
    const adminDto = {username: 'aminadmin1', password: '1234'};
    const response = await service.adminLogin(adminDto);
    expect(response.access_token).toBeNull()
  });
  it('shouldnt return all users', async()=>{
    const adminDto = {username: 'aminadmin1', password: '1234'};
    const response = await service.adminLogin(adminDto);
    expect(response.access_token).toBeNull()
  });

});
