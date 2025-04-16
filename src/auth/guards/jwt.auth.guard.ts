import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      console.log(' JWT Token:', token);

      try {
        const decoded = this.jwtService.decode(token);
        console.log('Decoded JWT Payload:', decoded); // email, role
      } catch (e) {
        console.error('Error decoding JWT:', e);
      }
    } else {
      console.log(' JWT token not found');
    }

    if (err || !user) throw err || new UnauthorizedException();
    return user;
  }
}