import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/account.module';
import { MovementsModule } from './movements/movement.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'nestuser',
      password: 'admin',
      database: 'DEV_CR',
      entities: [__dirname+'/**/*.entity{.ts,.js}'],
      synchronize: true,
      options:{
        encrypt: false,
        enableArithAbort: true,
      }
    }),
    UsersModule, AuthModule, AccountsModule, MovementsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
