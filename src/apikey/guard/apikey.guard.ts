import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class ApiKeyAuthGuard extends AuthGuard('ApiKey-Strategy') {
    constructor() {
        super();
      }
    
      canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        request['access'] = 'amin';
        return super.canActivate(context);
      }
}