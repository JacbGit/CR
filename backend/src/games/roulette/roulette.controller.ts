import { Controller, Post, Get, Body, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { RouletteService } from './roulette.service';
import { PlayRouletteDto } from '../dto/play-roulette.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AccountsService } from '../../accounts/account.service';

@Controller('games/roulette')
@UseGuards(JwtAuthGuard)
export class RouletteController {
  constructor(
    private readonly rouletteService: RouletteService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('play')
  async play(@Body() playDto: PlayRouletteDto, @Request() req) {
    try {
      const account = await this.accountsService.findByOwnerID(req.user.userId);
      
      if (!account) {
        throw new BadRequestException('No se encontró cuenta para este usuario');
      }

      // ID estático por ahora (como lo tenías)
      const ROULETTE_GAME_ID = 1;

      const result = await this.rouletteService.play(
        account.OwnerID,
        playDto.betAmount,
        playDto.betType,
        ROULETTE_GAME_ID
      );

      return {
        success: true,
        message: result.won ? '¡Ganaste!' : 'Suerte para la próxima',
        // Aquí devolvemos el objeto con "amount" y "gameID"
        result: result 
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('history')
  async getHistory(@Request() req) {
    const account = await this.accountsService.findByOwnerID(req.user.userId);
    if (!account) throw new BadRequestException('Cuenta no encontrada');
    
    return {
      success: true,
      history: await this.rouletteService.getHistory(account.AccountID),
    };
  }
}