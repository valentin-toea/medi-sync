import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info?: { message?: string }) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err || new UnauthorizedException(info?.message || 'User not authorized')
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user; // This will be attached to request.user
  }
}
