// games/poker/poker.service.ts
import { Injectable } from '@nestjs/common';
import { AccountsService } from '../../accounts/account.service';
import { MovementsService } from '../../movements/movement.service';

@Injectable()
export class PokerService {
  constructor(private accountsService: AccountsService, private movementsService: MovementsService) {}

  async play(accountID: number, betAmount: number, gameID: number) {
    const account = await this.accountsService.findByOwnerID(accountID);
    if (!account || Number(account.Balance) < betAmount) throw new Error('Saldo insuficiente');

    // 1. Simular Mano (Simplificado: generamos un "rank" aleatorio ponderado)
    // En un juego real programarías la baraja completa, aquí simularemos el resultado
    // para que sea fácil de implementar rápido.
    
    const rand = Math.random();
    let rank = 'Carta Alta';
    let multiplier = 0;

    if (rand > 0.99) { rank = 'Escalera Real'; multiplier = 250; }
    else if (rand > 0.95) { rank = 'Full House'; multiplier = 9; }
    else if (rand > 0.90) { rank = 'Color (Flush)'; multiplier = 6; }
    else if (rand > 0.80) { rank = 'Tercia'; multiplier = 3; }
    else if (rand > 0.60) { rank = 'Doble Par'; multiplier = 2; }
    else if (rand > 0.40) { rank = 'Par (Jacks+)'; multiplier = 1; } // Recuperas apuesta
    else { multiplier = -1; } // Pierdes (multiplicador negativo para logica abajo)

    const won = multiplier >= 0; // Si multiplier es -1, won es false? No, video poker "pagas" por ver.
    
    // Corrección lógica Video Poker: Tu pagas la entrada. Si ganas recibes PREMIO.
    // Si multiplier es 1, sales "tablas" (recuperas lo apostado).
    // Si multiplier es 0 (perdiste), pierdes la apuesta.
    
    let netChange = 0;
    if (multiplier === -1) {
        netChange = -betAmount; // Perdiste
    } else {
        // Ganancia neta = (Apuesta * Multiplicador) - Apuesta ORIGINAL (si la lógica es "te pago X veces")
        // Ejemplo Video Poker: Par paga 1 a 1 (recuperas).
        netChange = (betAmount * multiplier) - betAmount; 
        // Espera, Video Poker tabla usual:
        // Par J+: x1 (Devuelve tu moneda). Net: 0
        // Doble Par: x2 (Ganas 1 moneda). Net: +bet
        // Full: x9. Net: +8*bet
        
        // Ajuste para simplificar:
        if(multiplier === 1) netChange = 0; // Recuperas
        else netChange = (betAmount * multiplier) - betAmount;
    }
    
    // Si multiplier era -1, netChange ya es -betAmount. Si es 0 (nada), -betAmount.
    if (multiplier === -1) multiplier = 0; // Para mostrar en frontend

    const newBalance = Number(account.Balance) + netChange;
    await this.accountsService.updateBalance(account.AccountID, newBalance);
    await this.movementsService.createMovement(account.AccountID, netChange, gameID);

    return {
      won: netChange >= 0,
      rank,
      hand: ['🂡', '🂪', '🂫', '🂭', '🂮'], // Aquí podrías generar cartas random visuales
      amount: netChange,
      gameID: gameID,
      newBalance
    };
  }
}