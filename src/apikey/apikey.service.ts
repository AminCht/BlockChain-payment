import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../database/entities/apikey.entity';
import { ApiKeyRequestDto, ApiKeyUpdateDto } from './dto/apikey.dto';
import { User } from '../database/entities/User.entity';
@Injectable()
export class ApikeyService {
    constructor(@InjectRepository(ApiKey) private apiKeyRepo: Repository<ApiKey>) {}
    public async getApiKeys() {}
    public async createApiKey(user: User, apiKeyRequestDto: ApiKeyRequestDto) {
        const endPoints = await this.getEndPoints(apiKeyRequestDto.apiList);
        const createdApiKey = this.apiKeyRepo.create({
            user: user,
            accesses: endPoints,
            expireTime: apiKeyRequestDto.expireDate,
        });
        const savedApiKey = this.apiKeyRepo.save(createdApiKey);
        return savedApiKey;
    }

    public async updateApiKey(user: User, apiKeyUpdateDto: ApiKeyUpdateDto){
        const endPoints = await this.getEndPoints(apiKeyUpdateDto.apiList);
        try {
            const updatedApiKey = await this.apiKeyRepo.update(
                {
                    expireTime: apiKeyUpdateDto.expireDate,
                    status: apiKeyUpdateDto.status,
                    accesses: endPoints,
                },
                { user: user, id: apiKeyUpdateDto.id },
            );
            if (updatedApiKey.affected == 1) {
                return apiKeyUpdateDto;
            }
            throw new NotFoundException(`api-key with id ${apiKeyUpdateDto.id} not found`);}
        catch (error){
            console.log('update faild');
            throw new InternalServerErrorException();
        }
    }
    public async getEndPoints(ids: number[]): Promise<ApiKey[]> {
        const endPointAccessPromises = ids.map(apiId =>
            this.apiKeyRepo.findOne({
                where: { id: apiId },
            }),
        );
        return await Promise.all(endPointAccessPromises);
    }

}
