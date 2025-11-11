import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameHistory, GameType } from './game-history.entity';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory)
    private readonly gameHistoryRepository: Repository<GameHistory>,
  ) {}

  async findAll(userId: string, limit: number = 50): Promise<GameHistory[]> {
    return await this.gameHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByGameType(
    userId: string,
    gameType: GameType,
    limit: number = 50,
  ): Promise<GameHistory[]> {
    return await this.gameHistoryRepository.find({
      where: { userId, gameType },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: string, userId: string): Promise<GameHistory> {
    const gameHistory = await this.gameHistoryRepository.findOne({
      where: { id, userId },
    });

    if (!gameHistory) {
      throw new NotFoundException('Historial de juego no encontrado');
    }

    return gameHistory;
  }

  async getStatsByGame(userId: string, gameType: GameType) {
    const games = await this.gameHistoryRepository.find({
      where: { userId, gameType },
    });

    const totalGames = games.length;
    const wins = games.filter((g) => g.result === 'win').length;
    const losses = games.filter((g) => g.result === 'loss').length;
    const draws = games.filter((g) => g.result === 'draw').length;

    const totalBet = games.reduce(
      (sum, g) => sum + parseFloat(g.betAmount.toString()),
      0,
    );
    const totalWon = games.reduce(
      (sum, g) => sum + parseFloat(g.winAmount.toString()),
      0,
    );

    return {
      gameType,
      totalGames,
      wins,
      losses,
      draws,
      winRate: totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : 0,
      totalBet,
      totalWon,
      netProfit: totalWon - totalBet,
    };
  }

  async getRecentGames(userId: string, limit: number = 10): Promise<GameHistory[]> {
    return await this.gameHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
