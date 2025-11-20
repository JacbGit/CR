import { Module } from '@nestjs/common';
import { RouletteController } from './roulette.controller';
import { RouletteService } from './roulette.service';
import { AccountsModule } from '../../accounts/account.module';
import { MovementsModule } from '../../movements/movement.module';

@Module({
  imports: [
    AccountsModule,
    MovementsModule,
  ],
  controllers: [RouletteController],
  providers: [RouletteService],
  exports: [RouletteService],
})
export class RouletteModule {}