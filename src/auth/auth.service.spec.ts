import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import DatabaseModule from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/User.entity';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
    let service: AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, TypeOrmModule.forFeature([User]),
                JwtModule.register({secret: process.env.JWT_SECRET,signOptions: { expiresIn: '20d' }})],
            providers: [AuthService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('signup', () => {
        const mockJson = jest.fn();
        const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        const mockRes: Response = {
            status: mockStatus,
        } as unknown as Response;

        it('should create a user and return access token', () => {
        const token = service.signUp({ username: 'foad', password: '1234' },mockRes);
            expect(token).not.toBeNull();
        });
    });
    describe('login', () => {
        it('should return access token to login', () => {
            const token = service.login({ username: 'foad', password: '1234' },);
            expect(token).not.toBeNull();
        });
    });
});
