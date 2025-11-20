import { IsNumber, Min } from 'class-validator';

export class PlayPokerDto {
  @IsNumber()
  @Min(0.01)
  betAmount: number;
}
