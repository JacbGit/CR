import { Body,Controller,Get ,Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get()
    getAllUsers(): Promise<User[]>{
        return this.usersService.findAll();
    }

    @Get(':username')
    async getUserByUsername(@Param('username') username: string): Promise<User | null> {
        return this.usersService.findByUsername(username);
    }

    @Post('register')
    async registerUser(@Body() body: any): Promise<any> {
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
}
