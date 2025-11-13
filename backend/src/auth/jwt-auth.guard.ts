import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            if (info?.message === 'No auth token') {
                throw new UnauthorizedException('Token de autenticación requerido');
            }
            if (info?.message === 'jwt expired') {
                throw new UnauthorizedException('El token ha expirado');
            }
            if (info?.message === 'jwt malformed') {
                throw new UnauthorizedException('Token inválido');
            }
            if (info?.message === 'invalid signature') {
                throw new UnauthorizedException('Firma del token inválida');
            }
            
            throw err || new UnauthorizedException('No autorizado');
        }
        return user;
    }
}