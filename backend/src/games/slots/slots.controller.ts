// games/slots/slots.controller.ts
import { Controller, Post, Body, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AccountsService } from '../../accounts/account.service';
import { PlaySlotsDto } from '../dto/play-slots.dto';

@Controller('games/slots')
@UseGuards(JwtAuthGuard)
export class SlotsController {
  constructor(
    private readonly slotsService: SlotsService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('play')
  async play(@Body() playDto: PlaySlotsDto, @Request() req) {
    try {
      const account = await this.accountsService.findByOwnerID(req.user.userId);
      if (!account) throw new BadRequestException('Cuenta no encontrada');

      const SLOTS_GAME_ID = 2; // ID fijo para Tragamonedas

      const result = await this.slotsService.play(
        account.OwnerID,
        playDto.betAmount,
        SLOTS_GAME_ID
      );

      return {
        success: true,
        message: result.won ? '¡JACKPOT o Premio!' : 'Sigue intentando',
        result: result 
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}