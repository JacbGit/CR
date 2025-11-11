import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';
import { GameHistory } from '../game-history/game-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Transaction, GameHistory]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
