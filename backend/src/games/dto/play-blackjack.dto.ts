import { IsNumber, Min } from 'class-validator';

export class PlayBlackjackDto {
  @IsNumber()
  @Min(0.01)
  betAmount: number;
}