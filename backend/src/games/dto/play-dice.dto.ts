import { IsNumber, IsString, Min, IsIn } from 'class-validator';

export class PlayDiceDto {
  @IsNumber()
  @Min(1)
  betAmount: number;

  // Validamos que el tipo de apuesta sea uno de los permitidos en tu servicio
  @IsString()
  @IsIn([
    'sum_2', 'sum_3', 'sum_4', 'sum_5', 'sum_6', 'sum_7', 
    'sum_8', 'sum_9', 'sum_10', 'sum_11', 'sum_12', 
    'even', 'odd', 'low', 'high'
  ])
  betType: string;
}