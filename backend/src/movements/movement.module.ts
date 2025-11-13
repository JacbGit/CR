import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './movement.entity';
import { MovementsService } from './movement.service';

@Module({
    imports: [TypeOrmModule.forFeature([Movement])],
    providers: [MovementsService],
    exports: [MovementsService],
})
export class MovementsModule {}