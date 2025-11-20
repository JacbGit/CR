import { Module } from '@nestjs/common';
import { DiceController } from './dice.controller';
import { DiceService } from './dice.service';
import { AccountsModule } from '../../accounts/account.module';
import { MovementsModule } from '../../movements/movement.module';

@Module({
  imports: [
    AccountsModule,
    MovementsModule,
  ],
  controllers: [DiceController],
  providers: [DiceService],
  exports: [DiceService],
})
export class DiceModule {}