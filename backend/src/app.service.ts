import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: '🎰 Bienvenido a Casino Royal API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        users: '/api/users',
        games: '/api/games',
        transactions: '/api/transactions',
        history: '/api/game-history',
      },
    };
  }
}
