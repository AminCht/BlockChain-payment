import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ApiKeyAuthGuard } from "./apikey.guard";
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from "../../auth/guards/jwt.guard";
import { Observable } from "rxjs";

@Injectable()
export class EitherGuard implements CanActivate {
  constructor(private readonly jwtAuthGuard: JwtAuthGuard, private readonly apiKeyAuthGuard: ApiKeyAuthGuard) {}

   canActivate(context: ExecutionContext){
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Api-Key ')) {
        return this.apiKeyAuthGuard.canActivate(context);
    }
    return this.jwtAuthGuard.canActivate(context);
  
    }
}
