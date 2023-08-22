import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../../database/entities/apikey.entity';
import { Request } from 'express';
import  Strategy  from 'passport-headerapikey';


@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'ApiKey-Strategy') {
    constructor(@InjectRepository(ApiKey) private apikeyRepo: Repository<ApiKey>) {
        super({ header: 'X-API-KEY', prefix: 'Api-Key ', passReqToCallback: true },
        true,
        async (apiKey ,done, request) => {
            return this.validate(request,apiKey, done);
        });
    }
    async validate(request, apikey: string, done) {
        console.log(apikey);
        const parts = request.originalUrl.split('/')
        const access = parts[parts.length - 1];
        console.log(access)
        const key = await this.apikeyRepo.createQueryBuilder('apikey')
        .leftJoinAndSelect('apikey.accesses', 'accesses')
        .where('apikey.key = :key', { key: apikey }).andWhere('accesses.name= :name', {name: access})
        .leftJoinAndSelect('apikey.user', 'user')
        .getOne();   
        if(!key){
            return done(null, false)
        }
        return done(key, true);       
        
    }
}
