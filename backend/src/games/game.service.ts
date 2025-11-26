import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';


@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
    ) {}

    // Obtener todos los juegos
    async findAll(): Promise<Game[]> {
        return await this.gameRepository.find({});
    }

    // Crear un juego (solo admin)
    async create(gameData: Partial<Game>): Promise<Game> {
        const newGame = this.gameRepository.create(gameData);
        return await this.gameRepository.save(newGame);
    }
}