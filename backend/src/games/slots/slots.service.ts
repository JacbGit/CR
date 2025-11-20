// games/slots/slots.service.ts
import { Injectable } from '@nestjs/common';
import { AccountsService } from '../../accounts/account.service';
import { MovementsService } from '../../movements/movement.service';

@Injectable()
export class SlotsService {
  // Símbolos con sus probabilidades o valores visuales
  private readonly SYMBOLS = ['🍒', '🍋', '🍇', '🍊', '🔔', '💎', '7️⃣'];

  constructor(
    private accountsService: AccountsService,
    private movementsService: MovementsService,
  ) {}

  async play(accountID: number, betAmount: number, gameID: number) {
    // 1. Validar saldo
    const account = await this.accountsService.findByOwnerID(accountID);
    if (!account || Number(account.Balance) < betAmount) {
      throw new Error('Saldo insuficiente');
    }

    // 2. Girar los 3 carretes
    const reel1 = this.SYMBOLS[Math.floor(Math.random() * this.SYMBOLS.length)];
    const reel2 = this.SYMBOLS[Math.floor(Math.random() * this.SYMBOLS.length)];
    const reel3 = this.SYMBOLS[Math.floor(Math.random() * this.SYMBOLS.length)];
    const result = [reel1, reel2, reel3];

    // 3. Calcular ganancia
    let multiplier = 0;
    let won = false;

    // Caso: 3 Iguales (Jackpot)
    if (reel1 === reel2 && reel2 === reel3) {
        won = true;
        // Si son 7s paga más (ej. 50x), si son cerezas paga menos (ej. 10x)
        multiplier = reel1 === '7️⃣' ? 50 : 10; 
    } 
    // Caso: 2 Iguales (Premio consuelo)
    else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
        won = true;
        multiplier = 2; 
    }

    const winAmount = won ? betAmount * multiplier : 0;
    const netChange = won ? winAmount - betAmount : -betAmount; // Lo que sube o baja el saldo

    // 4. Actualizar BD
    const newBalance = Number(account.Balance) + netChange;
    await this.accountsService.updateBalance(account.AccountID, newBalance);
    await this.movementsService.createMovement(account.AccountID, netChange, gameID);

    // 5. Retorno estándar
    return {
      won,
      result, // ['🍒', '🍒', '🔔']
      amount: netChange, // REQUERIDO
      gameID: gameID,    // REQUERIDO
      newBalance,
      winAmount
    };
  }
}