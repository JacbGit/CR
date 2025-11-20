// games/blackjack/blackjack.service.ts
import { Injectable } from '@nestjs/common';
import { AccountsService } from '../../accounts/account.service';
import { MovementsService } from '../../movements/movement.service';

@Injectable()
export class BlackjackService {
  constructor(private accountsService: AccountsService, private movementsService: MovementsService) {}

  // Función auxiliar para sacar carta (1-11, simplificado)
  private drawCard() {
    // J,Q,K valen 10. A vale 11 (simplificación: siempre 11 salvo que te pases, aquí simple random)
    const cards = [2,3,4,5,6,7,8,9,10,10,10,10,11]; 
    return cards[Math.floor(Math.random() * cards.length)];
  }

  // Simular una mano (llegar a >= 17)
  private playHand() {
    let hand: number[] = [];
    let sum = 0;
    while (sum < 17) {
      const card = this.drawCard();
      hand.push(card);
      sum += card;
    }
    return { hand, sum };
  }

  async play(accountID: number, betAmount: number, gameID: number) {
    const account = await this.accountsService.findByOwnerID(accountID);
    if (!account || Number(account.Balance) < betAmount) throw new Error('Saldo insuficiente');

    // 1. Juega el Usuario
    const player = this.playHand();
    
    // 2. Juega el Dealer
    const dealer = this.playHand();

    let won = false;
    let push = false; // Empate

    // 3. Reglas
    if (player.sum > 21) {
        won = false; // Te pasaste (Bust)
    } else if (dealer.sum > 21) {
        won = true; // Dealer se pasó
    } else if (player.sum > dealer.sum) {
        won = true; // Tienes más que el dealer
    } else if (player.sum === dealer.sum) {
        push = true; // Empate
    }

    let netChange = 0;
    if (won) netChange = betAmount; // Ganas 1:1 (te devuelven tu apuesta + ganancia)
    else if (push) netChange = 0;   // Te devuelven tu apuesta (cambio 0)
    else netChange = -betAmount;    // Pierdes

    // Persistencia
    const newBalance = Number(account.Balance) + netChange;
    await this.accountsService.updateBalance(account.AccountID, newBalance);
    // Solo registramos movimiento si no fue empate (o si quieres registrar 0)
    if(netChange !== 0) {
        await this.movementsService.createMovement(account.AccountID, netChange, gameID);
    }

    return {
      won,
      push,
      playerHand: player,
      dealerHand: dealer,
      amount: netChange,
      gameID: gameID,
      newBalance
    };
  }
}