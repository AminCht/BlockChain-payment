import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../../database/entities/apikey.entity';
import { Request } from 'express';
import  Strategy  from 'passport-headerapikey';
import * as fs from 'fs-extra';


@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'ApiKey-Strategy') {
    constructor(@InjectRepository(ApiKey) private apikeyRepo: Repository<ApiKey>) {
        super({ header: 'Authorization', prefix: 'Api-Key ', passReqToCallback: true },
        true,
        async (apiKey ,done, request) => {
            return this.validate(request,apiKey, done);
        });
    }
    async validate(request, apikey: string, done) {
        const accessName = await this.getJson(request);
        console.log(accessName);
        const key = await this.apikeyRepo.createQueryBuilder('apikey')
        .leftJoinAndSelect('apikey.accesses', 'accesses')
        .where('apikey.key = :key', { key: apikey }).andWhere('accesses.name= :name', {name: accessName})
        .leftJoinAndSelect('apikey.user', 'user')
        .getOne();   
        if(!key){
            return done(null, false)
        }
        return done(null, key);       
        
    }
    async getJson(request){
        const jsonData = await fs.readJson('src/apikey/access.json');
        let url = request.originalUrl;
        if(url[url.length-1] != '/'){
            url = url + '/';
        }
        console.log(url);
        
        for (const item of jsonData) {
            console.log(item);
            for(const pattern of item.patterns){         
                if(pattern.urlPattern==url && pattern.method == request.method){
                    console.log('gooz');
                    return item.accessName;                  
                }
                const patternRegex = pattern.urlPattern.replace(
                    /\{id\}/g,
                    '\\d+' // Regular expression to match any numeric value
                  );
                  const regexPattern = new RegExp(`^${patternRegex}$`);
                  if (regexPattern.test(url)) {
                    return item.accessName;
                  }
            }
        }
    }

}
