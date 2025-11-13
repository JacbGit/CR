import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountsService } from './account.service';

@Module({
    imports: [TypeOrmModule.forFeature([Account])],
    providers: [AccountsService],
    exports: [AccountsService],
})
export class AccountsModule {}