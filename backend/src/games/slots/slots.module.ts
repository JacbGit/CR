import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { AccountsModule } from '../../accounts/account.module';
import { MovementsModule } from '../../movements/movement.module';

@Module({
  imports: [
    AccountsModule,
    MovementsModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}