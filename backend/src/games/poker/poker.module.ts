import { Module } from '@nestjs/common';
import { PokerController } from './poker.controller';
import { PokerService } from './poker.service';
import { AccountsModule } from '../../accounts/account.module';
import { MovementsModule } from '../../movements/movement.module';

@Module({
  imports: [
    AccountsModule,
    MovementsModule,
  ],
  controllers: [PokerController],
  providers: [PokerService],
  exports: [PokerService],
})
export class PokerModule {}