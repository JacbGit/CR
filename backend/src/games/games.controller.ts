import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  DicePlayDto,
  SlotsPlayDto,
  PokerPlayDto,
  BlackjackActionDto,
} from './dto/game.dto';
import { RoulettePlayDto } from './roulette/roulette.dto';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('roulette/play')
  async playRoulette(@Request() req, @Body() playDto: RoulettePlayDto) {
    return await this.gamesService.playRoulette(req.user.userId, playDto);
  }

  @Post('dice/play')
  async playDice(@Request() req, @Body() playDto: DicePlayDto) {
    return await this.gamesService.playDice(req.user.userId, playDto);
  }

  @Post('slots/play')
  async playSlots(@Request() req, @Body() playDto: SlotsPlayDto) {
    return await this.gamesService.playSlots(req.user.userId, playDto);
  }
  @Post('poker/play')
  async playPoker(@Request() req, @Body() playDto: PokerPlayDto) {
    return await this.gamesService.playPoker(req.user.userId, playDto);
  }
  
  @Post('blackjack/action')
  async blackjackAction(@Request() req, @Body() actionDto: BlackjackActionDto) {
    return await this.gamesService.blackjackAction(req.user.userId, actionDto);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return await this.gamesService.getPlayerStats(req.user.userId);
  }
}
