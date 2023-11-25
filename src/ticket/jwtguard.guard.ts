import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRoleGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = ['User', 'Admin']

    const request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'];

    if (!token) {
        throw new UnauthorizedException();
    }

    for (const role of roles) {
      try {
        const secretKey = role === 'Admin' ? process.env.JWT_SECRET_ADMIN : process.env.JWT_SECRET;
        const payload = this.jwtService.verify(token, { secret: secretKey });
        request.user = {
            role,
            id: payload.id,
            username: payload.username
        };
        return true;
      } catch (error) {
        continue;
      }
    }

    throw new UnauthorizedException();
  }
}
