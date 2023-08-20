import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import DatabaseModule from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';
import {JwtAdminStrategy} from "../auth/strategy/jwt.admin.startegy";
import {JwtModule} from "@nestjs/jwt";
import {AuthService} from "../auth/auth.service";
import {BadRequestException, ForbiddenException} from "@nestjs/common";

describe('AdminService', () => {
    let service: AdminService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, TypeOrmModule.forFeature([User]),
                JwtModule.register({secret: process.env.JWT_SECRET,signOptions: { expiresIn: '20d' }})],
            providers: [AdminService, JwtAdminStrategy, AuthService],
        }).compile();

        service = module.get<AdminService>(AdminService);
    });
    describe('createAdmin', () => {
        it('should create an admin', async () => {
            const adminDto = { username: 'aminadmin', password: '1234' };
            const response = await service.createAdmin(adminDto);
            expect(response.message).toEqual('You have successfully Signed Up');
        });
        it('shouldnt create an admin with exist username', async () => {
            const adminDto = { username: 'aminadmin', password: '1234' };
            try{
                await service.createAdmin(adminDto)
                fail('Expected an exception to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('This UserName is already taken');
            }
        });
    });
    describe('adminLogin', () => {
        it('should log in', async () => {
            const adminDto = { username: 'aminadmin', password: '1234' };
            const response = await service.adminLogin(adminDto);
            expect(response.access_token).not.toBeNull();
        });
        it('shouldnt login admin with wrong credentials', async () => {
            const adminDto = { username: 'aminadmin1', password: '1234' };
            try {
                await service.adminLogin(adminDto);
                fail('Expected an exception to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(ForbiddenException);
                expect(error.message).toBe('Credentials incorrect');
            }
        });
    });
    describe('deleteAdmin', () => {});
    describe('getAllUsers',()=>{
      it('should return all users', async () => {
        const adminDto = { username: 'aminadmin', password: '1234' };
        const response = await service.adminLogin(adminDto);
        expect(response.access_token).toBeNull();
      });
    })

});
