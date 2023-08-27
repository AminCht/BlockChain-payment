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
            return await this.validate(request,apiKey, done);
        });
    }
    async validate(request, apikey: string, done) {
        const accessName = await this.getJson(request);
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
        const jsonData = await fs.readJsonSync('src/apikey/token.json');
        let url = request.originalUrl;
        
        if(url[url.length-1] != '/'){
            url = url + '/';
        }
        
        for (const item of jsonData) {
            for(const pattern of item.patterns){         
                if(pattern.urlPattern==url && pattern.method == request.method){
                    return item.accessName;                  
                }
                const patternRegex = pattern.urlPattern.replace(
                    /\{id\}/g,
                    '\\d+'
                  );
                  const regexPattern = new RegExp(`^${patternRegex}$`);
                  if (regexPattern.test(url)) {
                    return item.accessName;
                  }
            }
        }
    }

}
