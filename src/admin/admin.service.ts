import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from '../database/entities/User.entity';
import { LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository, SelectQueryBuilder } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {AdminRequestDto, CreateAdminResponseDto, GetAllUsersResponseDto} from './dto/createAdmin.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../pagination/pagination.dto';
import { Withdraw } from '../database/entities/withdraw.entity';
import { Pagination } from '../pagination/pagination';
import { Wallet } from '../database/entities/Wallet.entity';
import { Transaction } from '../database/entities/Transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { GetTransactionResponseDto } from './dto/transaction.dto';
import { GetWalletResponseDto } from './dto/wallet.dto';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Withdraw) private withdrawRepo: Repository<Withdraw>,
        @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
        @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
        private jwt: JwtService,
        private authService: AuthService,
        private transactionService: TransactionService
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

    public async getAllWithdraws(paginationDto: PaginationDto<any>){
        return await Pagination.paginate(this.withdrawRepo, paginationDto);
    }

    public async getWallets(paginationDto: PaginationDto<any>){
        return await Pagination.paginate(this.walletRepo, paginationDto, this.getWalletMapper);
    }
    public async getTransactions(paginationDto: PaginationDto<any>){
        return await Pagination.paginate(this.transactionRepo, paginationDto, this.getTransactionmapper, [{name: 'currency', type: 'left'}]);
    }

    public getTransactionmapper(data){
        const getTransactioResponseDto = GetTransactionResponseDto.ResponseToDto(data)
        return getTransactioResponseDto;
    }
    public getWalletMapper(data){
        const getWalletRespnseDto = GetWalletResponseDto.ResponseToDto(data);
        return getWalletRespnseDto;
    }
}
