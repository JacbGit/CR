import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GameType } from './game-history.entity';

@Controller('game-history')
@UseGuards(JwtAuthGuard)
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Get()
  async findAll(@Request() req, @Query('limit') limit?: number) {
    return await this.gameHistoryService.findAll(req.user.userId, limit || 50);
  }

  @Get('recent')
  async getRecent(@Request() req, @Query('limit') limit?: number) {
    return await this.gameHistoryService.getRecentGames(req.user.userId, limit || 10);
  }

  @Get('game/:gameType')
  async findByGameType(
    @Request() req,
    @Param('gameType') gameType: GameType,
    @Query('limit') limit?: number,
  ) {
    return await this.gameHistoryService.findByGameType(
      req.user.userId,
      gameType,
      limit || 50,
    );
  }

  @Get('game/:gameType/stats')
  async getStatsByGame(
    @Request() req,
    @Param('gameType') gameType: GameType,
  ) {
    return await this.gameHistoryService.getStatsByGame(req.user.userId, gameType);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return await this.gameHistoryService.findOne(id, req.user.userId);
  }
}
