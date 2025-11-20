// games/dice/dice.service.ts
import { Injectable } from '@nestjs/common';
import { AccountsService } from '../../accounts/account.service';
import { MovementsService } from '../../movements/movement.service';

@Injectable()
export class DiceService {
  constructor(
    private accountsService: AccountsService,
    private movementsService: MovementsService,
  ) {}

  async play(accountID: number, betAmount: number, betType: string, gameID: number) {
    // betType ejemplos: 'sum_7', 'sum_11', 'even', 'odd', 'low' (2-6), 'high' (8-12)
    
    const account = await this.accountsService.findByOwnerID(accountID);
    if (!account || Number(account.Balance) < betAmount) throw new Error('Saldo insuficiente');

    // Lanzar dados
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const sum = die1 + die2;

    let multiplier = 0;
    let won = false;

    // Evaluar apuesta
    if (betType === 'even' && sum % 2 === 0) { won = true; multiplier = 1; }
    else if (betType === 'odd' && sum % 2 !== 0) { won = true; multiplier = 1; }
    else if (betType === 'low' && sum < 7) { won = true; multiplier = 1; }
    else if (betType === 'high' && sum > 7) { won = true; multiplier = 1; }
    // Apuestas exactas (pagan más)
    else if (betType.startsWith('sum_')) {
        const target = parseInt(betType.split('_')[1]);
        if (sum === target) {
            won = true;
            // 7 es el más probable (paga 4x), 2 y 12 los menos (pagan 30x)
            multiplier = (target === 7) ? 4 : 10; 
        }
    }

    const winAmount = won ? betAmount * (multiplier + 1) : 0;
    const netChange = won ? winAmount - betAmount : -betAmount;

    // Persistencia
    const newBalance = Number(account.Balance) + netChange;
    await this.accountsService.updateBalance(account.AccountID, newBalance);
    await this.movementsService.createMovement(account.AccountID, netChange, gameID);

    return {
      won,
      dice: [die1, die2],
      sum,
      amount: netChange,
      gameID: gameID,
      newBalance
    };
  }
}