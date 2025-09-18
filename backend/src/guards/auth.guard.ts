import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { AuthService } from '@/services/auth.service';
import { JwtService } from '@/libs/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectPinoLogger(AuthGuard.name)
    private readonly logger: PinoLogger,
    private authService: AuthService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('No authorization header found');
      throw new UnauthorizedException('No authorization header found');
    }

    const token = this.jwtService.extractTokenFromHeader(authHeader);
    if (!token) {
      this.logger.warn('Invalid authorization header format');
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const user = await this.authService.validateToken(token);
      // @ts-ignore
      request.user = user;
      
      this.logger.debug(`Authentication successful for user: ${user.address}`);
      return true;
    } catch (error) {
      this.logger.warn(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

// Decorator to mark routes as public (skip authentication)
import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata('isPublic', true);