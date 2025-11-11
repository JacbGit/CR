import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum GameType {
  ROULETTE = 'roulette',
  POKER = 'poker',
  SLOTS = 'slots',
  BLACKJACK = 'blackjack',
  DICE = 'dice',
}

export enum GameResult {
  WIN = 'win',
  LOSS = 'loss',
  DRAW = 'draw',
}

@Entity('game_history')
export class GameHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: GameType,
    name: 'game_type',
  })
  gameType: GameType;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'bet_amount' })
  betAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'win_amount' })
  winAmount: number;

  @Column({
    type: 'enum',
    enum: GameResult,
  })
  result: GameResult;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'balance_before' })
  balanceBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'balance_after' })
  balanceAfter: number;

  @Column({ type: 'jsonb', nullable: true, name: 'game_data' })
  gameData: any; // Detalles específicos del juego (números de ruleta, cartas, etc.)

  @Column({ type: 'integer', default: 0 })
  duration: number; // Duración en segundos

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.gameHistories)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
