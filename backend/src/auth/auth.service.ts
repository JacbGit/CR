import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}

    
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            console.log('Usuario no encontrado');
            return null;
        }

        console.log('Usuario encontrado:', user);

        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (isPasswordValid) {
            // Excluimos el campo Password antes de devolver el usuario
            const { Password, ...result } = user;
            return result;
        }

        console.log('Contraseña incorrecta');
        return null;
    }

    async login(user: any) {
        const payload = { username: user.Username, sub: user.UserID, UserType: user.UserType };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
