import { IsArray, ValidateNested, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BetDetailDto {
  @IsString()
  betKey: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}

export class RoulettePlayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BetDetailDto)
  bets: BetDetailDto[];
}
