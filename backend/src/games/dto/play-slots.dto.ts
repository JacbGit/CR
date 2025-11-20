import { IsNumber, Min } from 'class-validator';

export class PlaySlotsDto {
  @IsNumber()
  @Min(0.01)
  betAmount: number;
}