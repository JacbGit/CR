// games/dice/dice.controller.ts
import { Controller, Post, Body, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { DiceService } from './dice.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AccountsService } from '../../accounts/account.service';
import { PlayDiceDto } from '../dto/play-dice.dto';

@Controller('games/dice')
@UseGuards(JwtAuthGuard)
export class DiceController {
  constructor(
    private readonly diceService: DiceService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('play')
  async play(@Body() playDto: PlayDiceDto, @Request() req) {
    try {
      const account = await this.accountsService.findByOwnerID(req.user.userId);
      if (!account) throw new BadRequestException('Cuenta no encontrada');

      const DICE_GAME_ID = 3;

      const result = await this.diceService.play(
        account.OwnerID,
        playDto.betAmount,
        playDto.betType, // Ej: 'sum_7', 'even', 'low'
        DICE_GAME_ID
      );

      return {
        success: true,
        message: result.won ? '¡Dados ganadores!' : 'La casa gana',
        result: result 
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}