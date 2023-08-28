import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../../database/entities/apikey.entity';
import  Strategy  from 'passport-headerapikey';
import * as fs from 'fs-extra';


@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'ApiKey-Strategy') {
    constructor(@InjectRepository(ApiKey) private apikeyRepo: Repository<ApiKey>) {
        super({ header: 'Authorization', prefix: 'Api-Key ', passReqToCallback: true },
            true,
            async (apiKey ,done, request) => {
                return await this.validate({ url:request.originalUrl, method: request.method}, apiKey, done);
            });
    }
    private jsonData = fs.readJsonSync('src/apikey/access.json');
    async validate(partialReq: { url: string; method: string }, apikey: string, done) {
        const accessName = await this.checkUrl(partialReq);
        const key = await this.apikeyRepo
            .createQueryBuilder('apikey')
            .leftJoinAndSelect('apikey.accesses', 'accesses')
            .where('apikey.key = :key', { key: apikey }).andWhere('accesses.name= :name', {name: accessName})
            .leftJoinAndSelect('apikey.user', 'user')
            .getOne();
        if(!key){
            return done(null, false);
        }
        return done(null, key);
    }
    async checkUrl(partialReq: { url: string; method: string }){
        if (partialReq.url[partialReq.url.length - 1] != '/') {
            partialReq.url = partialReq.url + '/';
        }

        for (const item of this.jsonData) {
            for(const pattern of item.patterns){
                if(pattern.urlPattern==partialReq.url && pattern.method == partialReq.method){
                    return item.accessName;}
            }
            }
    }
}
