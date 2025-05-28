import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // No roles specified, access granted
    }
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: UserRole[] } }>();
    const user = request.user;
    // user object is populated by JwtAuthGuard from the JWT payload
    return requiredRoles.some((role) => user?.role?.includes(role));
  }
}
