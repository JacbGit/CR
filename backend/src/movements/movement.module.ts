import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './movement.entity';
import { MovementsService } from './movement.service';
import { MovementsController } from './movement.controller';
import { AccountsModule } from '../accounts/account.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movement]),
        AccountsModule,  // Importar para usar AccountsService
    ],
    controllers: [MovementsController],
    providers: [MovementsService],
    exports: [MovementsService],
})
export class MovementsModule {}