import { Body,Controller,Get ,Param, Post, UseGuards, Request, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers(@Request() req): Promise<User[]>{
        if (req.user.UserType == 0) {
            return this.usersService.findAll();
        }
        throw new UnauthorizedException('Solo administradores pueden acceder');
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username')
    async getUserByUsername(@Param('username') username: string, @Request() req): Promise<User | null> {
        if (req.user.UserType == 0 || req.user.username == username) {
            return this.usersService.findByUsername(username);
        }
        throw new UnauthorizedException('Solo los usuarios pueden acceder a su informacion');
    }

    @Post('register')
    async registerUser(@Body() body: any): Promise<any> {
        const existingUser = await this.usersService.findByUsername(body.Username);
        if (existingUser) {
            throw new BadRequestException('El usuario ya existe');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(body.Password, saltRounds);

        const newUser = {
            Name: body.Name,
            Surname: body.Surname,
            Username: body.Username,
            Password: hashedPassword,
            Status: 1,        // puedes poner valores por defecto
            Photo: body.Photo || null,
            UserType: body.UserType || 1,
        };

        const createdUser = await this.usersService.create(newUser);
        const { Password, ...safeUser } = createdUser;

        return { message: 'Usuario registrado correctamente', user: safeUser };
    }

    @UseGuards(JwtAuthGuard)
    @Post('register/admin')
    async registerAdmin(@Body() body: any, @Request() req): Promise<any> {
        const existingUser = await this.usersService.findByUsername(body.Username);
        if (existingUser) {
            throw new BadRequestException('El usuario ya existe');
        }

        if (req.user.UserType == 0) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(body.Password, saltRounds);

            const newUser = {
                Name: body.Name,
                Surname: body.Surname,
                Username: body.Username,
                Password: hashedPassword,
                Status: 1,        // puedes poner valores por defecto
                Photo: body.Photo || null,
                UserType: body.UserType || 0,
            };

            const createdUser = await this.usersService.create(newUser);
            const { Password, ...safeUser } = createdUser;

            return { message: 'Usuario registrado correctamente', user: safeUser };
        }
        throw new UnauthorizedException('Solo los admins pueden levantar admins');
    }
}
