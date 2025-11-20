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
  @IsString()
  @IsOptional()
  betType?: 'pass' | 'dont-pass' | 'come' | 'dont-come' | 'field' | 'any-craps' | 'any-seven'; // Tipo de apuesta en Craps

  @IsNumber()
  @IsOptional()
  prediction?: number; // suma predicha de los dados (para compatibilidad)
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
