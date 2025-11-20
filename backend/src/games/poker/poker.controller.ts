// games/poker/poker.controller.ts
import { Controller, Post, Body, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { PokerService } from './poker.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AccountsService } from '../../accounts/account.service';
import { PlayPokerDto } from '../dto/play-poker.dto';

@Controller('games/poker')
@UseGuards(JwtAuthGuard)
export class PokerController {
  constructor(
    private readonly pokerService: PokerService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('play')
  async play(@Body() playDto: PlayPokerDto, @Request() req) {
    try {
      const account = await this.accountsService.findByOwnerID(req.user.userId);
      if (!account) throw new BadRequestException('Cuenta no encontrada');

      const POKER_GAME_ID = 5;

      const result = await this.pokerService.play(
        account.OwnerID,
        playDto.betAmount,
        POKER_GAME_ID
      );

      return {
        success: true,
        message: result.won ? `¡Ganaste con ${result.rank}!` : 'No hubo suerte',
        result: result 
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}