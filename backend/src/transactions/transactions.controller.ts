import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(@Request() req, @Query('limit') limit?: number) {
    return await this.transactionsService.findAll(req.user.userId, limit || 50);
  }

  @Get('summary')
  async getSummary(@Request() req) {
    return await this.transactionsService.getTransactionsSummary(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return await this.transactionsService.findOne(id, req.user.userId);
  }
}
