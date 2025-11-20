import { Injectable } from '@nestjs/common';
import { AccountsService } from '../../accounts/account.service';
import { MovementsService } from '../../movements/movement.service';

@Injectable()
export class RouletteService {
  private readonly RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  private readonly BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  constructor(
    private accountsService: AccountsService,
    private movementsService: MovementsService,
  ) {}

  private spinWheel(): number {
    return Math.floor(Math.random() * 37);
  }

  private isRed(num: number): boolean {
    return this.RED_NUMBERS.includes(num);
  }

  private isBlack(num: number): boolean {
    return this.BLACK_NUMBERS.includes(num);
  }

  private calculateWin(betType: string, betAmount: number, winningNumber: number): { won: boolean; winAmount: number } {
    let multiplier = 0;
    let won = false;

    // Conversión segura de tipo de apuesta a número si es posible
    const betNumber = Number(betType);

    if (!isNaN(betNumber)) {
      if (betNumber === winningNumber) {
        won = true;
        multiplier = 35;
      }
    }
    else if (betType === 'red') {
      won = this.isRed(winningNumber);
      multiplier = 1;
    }
    else if (betType === 'black') {
      won = this.isBlack(winningNumber);
      multiplier = 1;
    }
    else if (betType === 'even') {
      won = winningNumber !== 0 && winningNumber % 2 === 0;
      multiplier = 1;
    }
    else if (betType === 'odd') {
      won = winningNumber !== 0 && winningNumber % 2 !== 0;
      multiplier = 1;
    }
    else if (betType === 'low') {
      won = winningNumber >= 1 && winningNumber <= 18;
      multiplier = 1;
    }
    else if (betType === 'high') {
      won = winningNumber >= 19 && winningNumber <= 36;
      multiplier = 1;
    }
    // Docenas y Columnas (multiplicador 2)
    else if (['1st12', '2nd12', '3rd12', 'col1', 'col2', 'col3'].includes(betType)) {
         multiplier = 2;
         if (betType === '1st12') won = winningNumber >= 1 && winningNumber <= 12;
         else if (betType === '2nd12') won = winningNumber >= 13 && winningNumber <= 24;
         else if (betType === '3rd12') won = winningNumber >= 25 && winningNumber <= 36;
         else if (betType === 'col1') won = winningNumber % 3 === 1 && winningNumber !== 0;
         else if (betType === 'col2') won = winningNumber % 3 === 2 && winningNumber !== 0;
         else if (betType === 'col3') won = winningNumber % 3 === 0 && winningNumber !== 0;
    }

    const winAmount = won ? betAmount * (multiplier + 1) : 0;
    return { won, winAmount };
  }

  async play(accountID: number, betAmount: number, betType: string, gameID: number) {
    // 1. Validar saldo
    const account = await this.accountsService.findByOwnerID(accountID);

    if (!account) {
      throw new Error('Cuenta no encontrada');
    }

    if (Number(account.Balance) < betAmount) {
      throw new Error('Saldo insuficiente');
    }

    // 2. Lógica del juego
    const winningNumber = this.spinWheel();
    const { won, winAmount } = this.calculateWin(betType, betAmount, winningNumber);

    // 3. Calcular el cambio neto (Amount)
    // Si gana: gana el premio menos lo que apostó (neto) O recibe el premio total y restamos la apuesta.
    // Simplificación: netChange es lo que se suma/resta al saldo final.
    const netChange = won ? winAmount - betAmount : -betAmount;

    // 4. Actualizar BD (usando tus servicios actuales)
    const newBalance = Number(account.Balance) + netChange;
    await this.accountsService.updateBalance(account.AccountID, newBalance);
    
    // Registrar movimiento
    await this.movementsService.createMovement(
      account.AccountID,
      netChange,
      gameID
    );

    // 5. Retorno con la estructura solicitada
    return {
      // Datos clave para el frontend/usuario
      won,
      winningNumber,
      // AQUÍ ESTÁ LO QUE PEDISTE:
      amount: netChange,  // Esto es lo que ganaste/perdiste (+10 o -10)
      gameID: gameID,     // El ID del juego
      // Datos extra útiles
      newBalance,
      betType,
      winAmount
    };
  }

  async getHistory(accountID: number) {
    return await this.movementsService.getMovementsByAccount(accountID);
  }
}