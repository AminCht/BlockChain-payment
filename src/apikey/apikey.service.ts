import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ApiKey} from '../database/entities/apikey.entity';
import {ApiKeyRequestDto, ApiKeyUpdateDto} from './dto/apikey.dto';
import {User} from '../database/entities/User.entity';
import * as crypto from 'crypto';
import {EndPointAccess} from '../database/entities/endpoint_acess.entity';

@Injectable()
export class ApikeyService {
    constructor(@InjectRepository(ApiKey) private apiKeyRepo: Repository<ApiKey>,
        @InjectRepository(EndPointAccess) private endPointsRepo: Repository<EndPointAccess>,
    ) {}
    public async getApiKeys(userId: number): Promise<ApiKey[]> {
        const apiKeys = await this.apiKeyRepo.find({
            where: { user: { id: userId } },
            relations: ['accesses'],
        });
        return apiKeys;
    }
    public async getApiKeysById(userId: number, apiKeyId: number): Promise<ApiKey> {
        const apiKey = await this.apiKeyRepo.findOne({
            where: { user: { id: userId }, id: apiKeyId },
            relations: ['accesses'],
        });
        return apiKey;
    }
    public async deleteApiKey(userId: number, apiKeyId: number) {
        const deletedApiKey = await this.apiKeyRepo.delete({ user: { id: userId }, id: apiKeyId  });
        if (deletedApiKey.affected == 0) {
            throw new NotFoundException(`apiKey with id ${apiKeyId} not found`);
        }
        return { message: `apiKey with id ${apiKeyId} deleted` };
    }
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

    public async updateApiKey(userId: number, apiKeyUpdateDto: ApiKeyUpdateDto, id: number): Promise<ApiKey> {
        let endPoints;
        const apikey = await this.apiKeyRepo.findOneById(id);
        if (apikey) {
            if (apiKeyUpdateDto.endPointList) {
                endPoints = await this.getEndPoints(apiKeyUpdateDto.endPointList);
            }
            const updatedApiKey = this.apiKeyRepo.save({
                id: apikey.id,
                accesses: endPoints,
                status: apiKeyUpdateDto.status,
                expireTime: apiKeyUpdateDto.expireDate,
            });
            return updatedApiKey;
        }
    }
    private async getEndPoints(ids: number[]): Promise<EndPointAccess[]> {
        const endPoints = await this.endPointsRepo.findByIds(ids);
        if (endPoints.length != ids.length) {
            throw new NotFoundException("all or some of the endpoints could not be found");
        }
        return endPoints;
    }
    private generateRandomHashedString(): string {
        const randomBytes = crypto.randomBytes(25);
        const hash = crypto.createHash('sha256').update(randomBytes).digest('hex');
        return hash;
    }

}
