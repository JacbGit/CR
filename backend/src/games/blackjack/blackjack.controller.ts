// games/blackjack/blackjack.controller.ts
import { Controller, Post, Body, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { BlackjackService } from './blackjack.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AccountsService } from '../../accounts/account.service';
import { PlayBlackjackDto } from '../dto/play-blackjack.dto';

@Controller('games/blackjack')
@UseGuards(JwtAuthGuard)
export class BlackjackController {
  constructor(
    private readonly blackjackService: BlackjackService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('play')
  async play(@Body() playDto: PlayBlackjackDto, @Request() req) {
    try {
      const account = await this.accountsService.findByOwnerID(req.user.userId);
      if (!account) throw new BadRequestException('Cuenta no encontrada');

      const BLACKJACK_GAME_ID = 4;

      const result = await this.blackjackService.play(
        account.OwnerID,
        playDto.betAmount,
        BLACKJACK_GAME_ID
      );

      return {
        success: true,
        message: result.won ? '¡Ganaste al Dealer!' : (result.push ? 'Empate' : 'Dealer gana'),
        result: result 
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}