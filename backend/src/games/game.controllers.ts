import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { GamesService } from './game.service';
import { Game } from './game.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    // Obtener todos los juegos - PÚBLICO (sin JWT)
    @Get()
    async getAllGames(): Promise<Game[]> {
        return this.gamesService.findAll();
    }

    // Crear un juego - SOLO ADMIN
    @UseGuards(JwtAuthGuard)
    @Post()
    async createGame(@Body() body: any, @Request() req): Promise<any> {
        // Solo admins pueden crear juegos
        if (req.user.UserType !== 0 && req.user.UserType !== 2) {
            throw new UnauthorizedException('Solo administradores pueden crear juegos');
        }

        const newGame = await this.gamesService.create({
            Name: body.Name,
            ImagePath: body.ImagePath || null,
            Link: body.Link,
        });

        return {
            message: 'Juego creado correctamente',
            game: newGame
        };
    }
}