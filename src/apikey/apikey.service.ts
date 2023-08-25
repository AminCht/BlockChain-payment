import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../database/entities/apikey.entity';
import { ApiKeyRequestDto, ApiKeyUpdateDto } from './dto/apikey.dto';
import { User } from '../database/entities/User.entity';
import * as crypto from 'crypto';
import { EndPointAccess } from '../database/entities/endpoint_acess.entity';
@Injectable()
export class ApikeyService {
    constructor(@InjectRepository(ApiKey) private apiKeyRepo: Repository<ApiKey>,
        @InjectRepository(EndPointAccess) private endPointsRepo: Repository<EndPointAccess>,
    ) {}
    public async getApiKeys() {}
    public async createApiKey(user: User, apiKeyRequestDto: ApiKeyRequestDto): Promise<ApiKey> {
        const endPoints = await this.getEndPoints(apiKeyRequestDto.endPointList);
        const createdApiKey = this.apiKeyRepo.create({
            user: user,
            accesses: endPoints,
            expireTime: apiKeyRequestDto.expireDate,
            key: this.generateRandomHashedString(),
        });
        delete createdApiKey.user;
        const savedApiKey = this.apiKeyRepo.save(createdApiKey);
        return savedApiKey;
    }

    public async updateApiKey(userId: number, apiKeyUpdateDto: ApiKeyUpdateDto, id: number) {
        const apikey = await this.apiKeyRepo.findOne({
            where:{
                id: id
            }
        });
        if(apikey){
            if(apiKeyUpdateDto.endPointList){
                const endPoints = await this.getEndPoints(apiKeyUpdateDto.endPointList);
                const updatedApiKey = this.apiKeyRepo.create({
                    id: apikey.id,
                    accesses: endPoints,
                    ...apiKeyUpdateDto,
                });
                await this.apiKeyRepo.save(updatedApiKey);
                return this.getApiKeyFromDb(id);
            }
            const updatedApiKey = this.apiKeyRepo.create({
                id: apikey.id,
                ...apiKeyUpdateDto,
            });
            await this.apiKeyRepo.save(updatedApiKey);
            return this.getApiKeyFromDb(id);  
        }         
        throw new NotFoundException(`api-key with id ${id} not found`);        
    }
    private async getApiKeyFromDb(id: number){
        const updatedApiKeyinDB = await this.apiKeyRepo.findOne({
            where:{
                id: id
            }, relations:['accesses']
        });
        return updatedApiKeyinDB;
    }
    //todo optimize it to be done with one query and use end point repo
    private async getEndPoints(ids: number[]): Promise<EndPointAccess[]> {
        const endPointAccessPromises = ids.map(endPointId =>
            this.endPointsRepo.findOne({
                where: { id: endPointId },
            }),
        );
        return await Promise.all(endPointAccessPromises);
    }
    private generateRandomHashedString(): string {
        const randomBytes = crypto.randomBytes(25);
        const hash = crypto.createHash('sha256').update(randomBytes).digest('hex');
        return hash;
    }

}
