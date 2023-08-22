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
        super({ header: 'X-API-KEY', prefix: '', passReqToCallback: true },
        true,
        async (apiKey ,done, request) => {
            return this.validate(request,apiKey, done);
        });
    }
    async validate(request,apikey: string, done) {

        console.log(request.headers);
        console.log(1);
        return true;
    }
}
