import { IsNumber, IsString, IsEnum, Min, IsOptional, IsArray } from 'class-validator';
import { GameType } from '../../game-history/game-history.entity';

export class PlaceBetDto {
  @IsEnum(GameType)
  gameType: GameType;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  gameData?: any; // Datos específicos del juego
}

// Ruleta
export class RoulettePlayDto extends PlaceBetDto {
  @IsString()
  betType: string; // 'number', 'color', 'odd-even', 'high-low', etc.

  @IsOptional()
  value?: any; // número específico, 'red', 'black', 'odd', 'even', etc.
}

// Dados
export class DicePlayDto extends PlaceBetDto {
  @IsNumber()
  @Min(2)
  prediction: number; // suma predicha de los dados
}

// Blackjack
export class BlackjackActionDto {
  @IsString()
  @IsEnum(['hit', 'stand', 'double', 'split'])
  action: string;
  
  @IsString()
  gameId: string;
}

// Poker
export class PokerPlayDto extends PlaceBetDto {
  @IsOptional()
  @IsArray()
  cardsToKeep?: number[]; // índices de cartas a mantener (0-4)
}

// Slots
export class SlotsPlayDto extends PlaceBetDto {
  @IsOptional()
  @IsNumber()
  lines?: number; // número de líneas a apostar (1-9)
}
