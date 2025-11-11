import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { TransactionsModule } from './transactions/transactions.module';
import { GameHistoryModule } from './game-history/game-history.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuración de TypeORM con PostgreSQL
    TypeOrmModule.forRoot(typeOrmConfig),
    
    // Módulos de la aplicación
    UsersModule,
    AuthModule,
    GamesModule,
    TransactionsModule,
    GameHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
