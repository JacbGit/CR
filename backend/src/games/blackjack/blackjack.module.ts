import { Module } from '@nestjs/common';
import { BlackjackController } from './blackjack.controller';
import { BlackjackService } from './blackjack.service';
import { AccountsModule } from '../../accounts/account.module';
import { MovementsModule } from '../../movements/movement.module';

@Module({
  imports: [
    AccountsModule,
    MovementsModule,
  ],
  controllers: [BlackjackController],
  providers: [BlackjackService],
  exports: [BlackjackService],
})
export class BlackjackModule {}