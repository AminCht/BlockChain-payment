import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../database/entities/apikey.entity';
import { ApiKeyRequestDto, ApiKeyUpdateDto } from './dto/apikey.dto';
import { User } from '../database/entities/User.entity';
import * as crypto from 'crypto';
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
            key: this.generateRandomHashedString(),
        });
        const savedApiKey = this.apiKeyRepo.save(createdApiKey);
        return savedApiKey;
    }

    public async updateApiKey(user: User, apiKeyUpdateDto: ApiKeyUpdateDto){
        const endPoints = await this.getEndPoints(apiKeyUpdateDto.apiList);
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
            throw new NotFoundException(`api-key with id ${apiKeyUpdateDto.id} not found`);

    }
    //todo optimize it to be done with one query and use end point repo
    private async getEndPoints(ids: number[]): Promise<ApiKey[]> {
        const endPointAccessPromises = ids.map(apiId =>
            this.apiKeyRepo.findOne({
                where: { id: apiId },
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
