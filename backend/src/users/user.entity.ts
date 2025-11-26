import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Transaction } from '../transactions/transaction.entity';
import { GameHistory } from '../game-history/game-history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'profile_picture' })
  profilePicture: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1000.00 })
  balance: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'varchar', length: 50, default: 'player' })
  role: string; // 'player', 'admin'

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => GameHistory, (gameHistory) => gameHistory.user)
  gameHistories: GameHistory[];
}
