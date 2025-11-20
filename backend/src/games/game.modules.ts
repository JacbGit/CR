import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GamesService } from './game.service';
import { GamesController } from './game.controllers';

// --- TUS MÓDULOS DE JUEGOS ---
import { RouletteModule } from './roulette/roulette.module';
import { SlotsModule } from './slots/slots.module';         // <--- Nuevo
import { DiceModule } from './dice/dice.module';           // <--- Nuevo
import { BlackjackModule } from './blackjack/blackjack.module'; // <--- Nuevo
import { PokerModule } from './poker/poker.module';         // <--- Nuevo

@Module({
    imports: [
        TypeOrmModule.forFeature([Game]),
        // Aquí registramos todos los juegos para que NestJS active sus rutas
        RouletteModule,
        SlotsModule,      
        DiceModule,       
        BlackjackModule,  
        PokerModule, 
    ],
    controllers: [GamesController],
    providers: [GamesService],
    exports: [GamesService],
})
export class GamesModule {}