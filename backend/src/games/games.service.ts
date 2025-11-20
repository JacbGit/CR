import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction, TransactionType, TransactionStatus } from '../transactions/transaction.entity';
import { GameHistory, GameType, GameResult } from '../game-history/game-history.entity';
import {
  PlaceBetDto,
  DicePlayDto,
  SlotsPlayDto,
  PokerPlayDto,
  BlackjackActionDto,
} from './dto/game.dto';
import { RoulettePlayDto } from './roulette/roulette.dto';
import { RouletteLogic } from './roulette/roulette.logic';
import { RED_NUMBERS, BLACK_NUMBERS } from './roulette/roulette.constants';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(GameHistory)
    private readonly gameHistoryRepository: Repository<GameHistory>,
    private readonly dataSource: DataSource,
  ) {}

  // ========== RULETA ==========
  async playRoulette(userId: string, playDto: RoulettePlayDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      
      // Validar apuestas
      const validation = RouletteLogic.validateBets(playDto.bets);
      if (!validation.valid) {
        throw new BadRequestException(validation.error);
      }

      // Calcular total apostado
      const totalBet = RouletteLogic.calculateTotalBet(playDto.bets);
      
      if (user.balance < totalBet) {
        throw new BadRequestException('Saldo insuficiente');
      }

      // Girar la ruleta
      const winningNumber = RouletteLogic.spin();
      
      // Calcular ganancias
      const { totalWinnings, winningBets } = RouletteLogic.calculateWinnings(
        winningNumber,
        playDto.bets
      );

      const balanceBefore = parseFloat(user.balance.toString());
      const balanceAfter = balanceBefore - totalBet + totalWinnings;
      const won = totalWinnings > 0;

      user.balance = balanceAfter;
      await manager.save(user);

      // Registrar transacción de apuesta
      const betTransaction = manager.create(Transaction, {
        userId,
        type: TransactionType.BET,
        amount: -totalBet,
        balanceBefore,
        balanceAfter: balanceBefore - totalBet,
        status: TransactionStatus.COMPLETED,
        gameType: GameType.ROULETTE,
      });
      await manager.save(betTransaction);

      // Si ganó, registrar transacción de ganancia
      if (won && totalWinnings > 0) {
        const winTransaction = manager.create(Transaction, {
          userId,
          type: TransactionType.WIN,
          amount: totalWinnings,
          balanceBefore: balanceBefore - totalBet,
          balanceAfter,
          status: TransactionStatus.COMPLETED,
          gameType: GameType.ROULETTE,
        });
        await manager.save(winTransaction);
      }

      // Registrar historial
      const gameHistory = manager.create(GameHistory, {
        userId,
        gameType: GameType.ROULETTE,
        betAmount: totalBet,
        winAmount: totalWinnings,
        result: won ? GameResult.WIN : GameResult.LOSS,
        balanceBefore,
        balanceAfter,
        gameData: {
          winningNumber,
          isRed: RED_NUMBERS.includes(winningNumber),
          isBlack: BLACK_NUMBERS.includes(winningNumber),
          bets: playDto.bets,
          winningBets,
        },
      });
      await manager.save(gameHistory);

      return {
        result: {
          won,
          winningNumber,
          isRed: RED_NUMBERS.includes(winningNumber),
          isBlack: BLACK_NUMBERS.includes(winningNumber),
          winningBets,
        },
        totalBet,
        totalWinnings,
        newBalance: balanceAfter,
      };
    });
  }

  // ========== DADOS ==========
  async playDice(userId: string, playDto: DicePlayDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      
      if (user.balance < playDto.amount) {
        throw new BadRequestException('Saldo insuficiente');
      }

      // Tirar dos dados
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const total = dice1 + dice2;

      // Lógica de Craps con múltiples tipos de apuestas
      let won = false;
      let winType = '';
      let multiplier = 1; // Por defecto paga 1:1

      const betType = playDto.betType || 'pass';

      switch (betType) {
        case 'pass':
          // PASS LINE: Gana con 7 u 11, pierde con 2, 3 o 12 (craps)
          if (total === 7 || total === 11) {
            won = true;
            winType = 'natural';
            multiplier = 1;
          } else if (total === 2 || total === 3 || total === 12) {
            won = false;
            winType = 'craps';
          } else {
            winType = 'point_established';
            won = Math.random() > 0.48;
            multiplier = 1;
          }
          break;

        case 'dont-pass':
          // DON'T PASS: Pierde con 7 u 11, gana con 2 o 3, empata con 12
          if (total === 7 || total === 11) {
            won = false;
            winType = 'seven_out';
          } else if (total === 2 || total === 3) {
            won = true;
            winType = 'craps';
            multiplier = 1;
          } else if (total === 12) {
            won = false;
            winType = 'push'; // Empate, no gana ni pierde
            multiplier = 0;
          } else {
            winType = 'point_established';
            won = Math.random() > 0.52;
            multiplier = 1;
          }
          break;

        case 'come':
          // COME: Similar a PASS pero solo después de establecer punto
          if (total === 7 || total === 11) {
            won = true;
            winType = 'natural';
            multiplier = 1;
          } else if (total === 2 || total === 3 || total === 12) {
            won = false;
            winType = 'craps';
          } else {
            won = Math.random() > 0.48;
            winType = 'come_point';
            multiplier = 1;
          }
          break;

        case 'dont-come':
          // DON'T COME: Opuesto a COME
          if (total === 7 || total === 11) {
            won = false;
            winType = 'seven_out';
          } else if (total === 2 || total === 3) {
            won = true;
            winType = 'craps';
            multiplier = 1;
          } else if (total === 12) {
            won = false;
            winType = 'push';
            multiplier = 0;
          } else {
            won = Math.random() > 0.52;
            winType = 'dont_come_point';
            multiplier = 1;
          }
          break;

        case 'field':
          // FIELD: Apuesta a 2, 3, 4, 9, 10, 11 o 12
          if (total === 2 || total === 12) {
            won = true;
            winType = 'field_double';
            multiplier = 2; // Paga 2:1
          } else if (total === 3 || total === 4 || total === 9 || total === 10 || total === 11) {
            won = true;
            winType = 'field';
            multiplier = 1;
          } else {
            won = false;
            winType = 'no_field';
          }
          break;

        case 'any-craps':
          // ANY CRAPS: Apuesta a 2, 3 o 12
          if (total === 2 || total === 3 || total === 12) {
            won = true;
            winType = 'craps';
            multiplier = 7; // Paga 7:1
          } else {
            won = false;
            winType = 'no_craps';
          }
          break;

        case 'any-seven':
          // ANY SEVEN: Apuesta a que salga 7
          if (total === 7) {
            won = true;
            winType = 'seven';
            multiplier = 4; // Paga 4:1
          } else {
            won = false;
            winType = 'no_seven';
          }
          break;

        default:
          // Pass por defecto
          if (total === 7 || total === 11) {
            won = true;
            multiplier = 1;
          } else if (total === 2 || total === 3 || total === 12) {
            won = false;
          } else {
            won = Math.random() > 0.48;
            multiplier = 1;
          }
      }

      const winAmount = won ? playDto.amount * multiplier : 0;

      const balanceBefore = parseFloat(user.balance.toString());
      const balanceAfter = balanceBefore - playDto.amount + winAmount;

      user.balance = balanceAfter;
      await manager.save(user);

      // Transacciones
      const betTransaction = manager.create(Transaction, {
        userId,
        type: TransactionType.BET,
        amount: -playDto.amount,
        balanceBefore,
        balanceAfter: balanceBefore - playDto.amount,
        status: TransactionStatus.COMPLETED,
        gameType: GameType.DICE,
      });
      await manager.save(betTransaction);

      if (won && winAmount > 0) {
        const winTransaction = manager.create(Transaction, {
          userId,
          type: TransactionType.WIN,
          amount: winAmount,
          balanceBefore: balanceBefore - playDto.amount,
          balanceAfter,
          status: TransactionStatus.COMPLETED,
          gameType: GameType.DICE,
        });
        await manager.save(winTransaction);
      }

      // Historial
      const gameHistory = manager.create(GameHistory, {
        userId,
        gameType: GameType.DICE,
        betAmount: playDto.amount,
        winAmount,
        result: won ? GameResult.WIN : GameResult.LOSS,
        balanceBefore,
        balanceAfter,
        gameData: {
          dice1,
          dice2,
          total,
          betType,
          winType,
          multiplier,
        },
      });
      await manager.save(gameHistory);

      return {
        result: {
          won,
          dice1,
          dice2,
          total,
          betType,
          winType,
          multiplier,
        },
        betAmount: playDto.amount,
        winAmount,
        newBalance: balanceAfter,
      };
    });
  }

  // ========== TRAGAMONEDAS ==========
  async playSlots(userId: string, playDto: SlotsPlayDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      
      if (user.balance < playDto.amount) {
        throw new BadRequestException('Saldo insuficiente');
      }

      // Símbolos con probabilidades balanceadas
      const symbols = ['CHERRY', 'CHERRY', 'LEMON', 'LEMON', 'ORANGE', 'ORANGE', 'GRAPE', 'STAR', 'DIAMOND', 'SEVEN'];
      const reels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];

      // Verificar combinaciones ganadoras
      let multiplier = 0;
      let won = false;
      let winType = '';

      if (reels[0] === reels[1] && reels[1] === reels[2]) {
        // Tres iguales - JACKPOT
        won = true;
        winType = 'triple';
        if (reels[0] === 'SEVEN') {
          multiplier = 100; // Jackpot máximo
          winType = 'jackpot';
        } else if (reels[0] === 'DIAMOND') {
          multiplier = 50;
        } else if (reels[0] === 'STAR') {
          multiplier = 25;
        } else if (reels[0] === 'GRAPE') {
          multiplier = 15;
        } else {
          multiplier = 10; // Frutas comunes
        }
      } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
        // Dos iguales
        won = true;
        winType = 'double';
        multiplier = 2;
      }

      const winAmount = won ? playDto.amount * multiplier : 0;
      const balanceBefore = parseFloat(user.balance.toString());
      const balanceAfter = balanceBefore - playDto.amount + winAmount;

      user.balance = balanceAfter;
      await manager.save(user);

      // Transacciones
      const betTransaction = manager.create(Transaction, {
        userId,
        type: TransactionType.BET,
        amount: -playDto.amount,
        balanceBefore,
        balanceAfter: balanceBefore - playDto.amount,
        status: TransactionStatus.COMPLETED,
        gameType: GameType.SLOTS,
      });
      await manager.save(betTransaction);

      if (won && winAmount > 0) {
        const winTransaction = manager.create(Transaction, {
          userId,
          type: TransactionType.WIN,
          amount: winAmount,
          balanceBefore: balanceBefore - playDto.amount,
          balanceAfter,
          status: TransactionStatus.COMPLETED,
          gameType: GameType.SLOTS,
        });
        await manager.save(winTransaction);
      }

      // Historial
      const gameHistory = manager.create(GameHistory, {
        userId,
        gameType: GameType.SLOTS,
        betAmount: playDto.amount,
        winAmount,
        result: won ? GameResult.WIN : GameResult.LOSS,
        balanceBefore,
        balanceAfter,
        gameData: {
          symbols: reels,
          multiplier,
          winType,
        },
      });
      await manager.save(gameHistory);

      return {
        result: {
          won,
          symbols: reels,
          multiplier,
          winType,
        },
        betAmount: playDto.amount,
        winAmount,
        newBalance: balanceAfter,
      };
    });
  }

  // ========== BlackJack ==========
  async blackjackAction(userId: string, actionDto: BlackjackActionDto) {
    // Implementación simplificada de Blackjack
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      
      if (user.balance < 10) { // Apuesta mínima de 10
        throw new BadRequestException('Saldo insuficiente');
      }

      const betAmount = 10;

      // Crear mazo y barajar
      const deck = this.createDeck();
      const shuffled = this.shuffleDeck(deck);

      // Repartir cartas
      const playerCards = [shuffled.pop(), shuffled.pop()];
      const dealerCards = [shuffled.pop(), shuffled.pop()];

      const playerScore = this.calculateBlackjackScore(playerCards);
      const dealerScore = this.calculateBlackjackScore(dealerCards);

      // Dealer juega (se planta en 17+)
      let finalDealerCards = [...dealerCards];
      let finalDealerScore = dealerScore;
      
      while (finalDealerScore < 17 && shuffled.length > 0) {
        finalDealerCards.push(shuffled.pop());
        finalDealerScore = this.calculateBlackjackScore(finalDealerCards);
      }

      // Determinar ganador
      let won = false;
      let result = GameResult.LOSS;
      let multiplier = 0;

      if (playerScore > 21) {
        // Jugador se pasó
        won = false;
      } else if (finalDealerScore > 21) {
        // Dealer se pasó
        won = true;
        multiplier = 1;
        result = GameResult.WIN;
      } else if (playerScore === 21 && playerCards.length === 2) {
        // Blackjack natural
        won = true;
        multiplier = 1.5;
        result = GameResult.WIN;
      } else if (playerScore > finalDealerScore) {
        won = true;
        multiplier = 1;
        result = GameResult.WIN;
      } else if (playerScore === finalDealerScore) {
        result = GameResult.DRAW;
        multiplier = 0; // Empate, se devuelve la apuesta
      }

      const winAmount = won ? betAmount * multiplier : 0;
      const balanceBefore = parseFloat(user.balance.toString());
      const balanceAfter = balanceBefore - betAmount + winAmount;

      user.balance = balanceAfter;
      await manager.save(user);

      // Transacciones
      const betTransaction = manager.create(Transaction, {
        userId,
        type: TransactionType.BET,
        amount: -betAmount,
        balanceBefore,
        balanceAfter: balanceBefore - betAmount,
        status: TransactionStatus.COMPLETED,
        gameType: GameType.BLACKJACK,
      });
      await manager.save(betTransaction);

      if (won && winAmount > 0) {
        const winTransaction = manager.create(Transaction, {
          userId,
          type: TransactionType.WIN,
          amount: winAmount,
          balanceBefore: balanceBefore - betAmount,
          balanceAfter,
          status: TransactionStatus.COMPLETED,
          gameType: GameType.BLACKJACK,
        });
        await manager.save(winTransaction);
      }

      // Historial
      const gameHistory = manager.create(GameHistory, {
        userId,
        gameType: GameType.BLACKJACK,
        betAmount,
        winAmount,
        result,
        balanceBefore,
        balanceAfter,
        gameData: {
          playerCards,
          dealerCards: finalDealerCards,
          playerScore,
          dealerScore: finalDealerScore,
          action: actionDto.action,
        },
      });
      await manager.save(gameHistory);

      return {
        result: {
          won,
          playerCards,
          dealerCards: finalDealerCards,
          playerScore,
          dealerScore: finalDealerScore,
          outcome: result,
        },
        betAmount,
        winAmount,
        newBalance: balanceAfter,
      };
    });
  }
  
  // ========== Póker (Video Poker - 5 cartas) ==========
  async playPoker(userId: string, playDto: PokerPlayDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      
      if (user.balance < playDto.amount) {
        throw new BadRequestException('Saldo insuficiente');
      }

      // Crear y barajar mazo
      const deck = this.createDeck();
      const shuffled = this.shuffleDeck(deck);

      // Repartir 5 cartas
      const hand = [
        shuffled.pop(),
        shuffled.pop(),
        shuffled.pop(),
        shuffled.pop(),
        shuffled.pop(),
      ];

      // Si hay cartas para mantener, reemplazar las otras
      const cardsToKeep = playDto.cardsToKeep || [];
      for (let i = 0; i < 5; i++) {
        if (!cardsToKeep.includes(i) && shuffled.length > 0) {
          hand[i] = shuffled.pop();
        }
      }

      // Evaluar mano de poker
      const handRank = this.evaluatePokerHand(hand);
      const multipliers = {
        'Royal Flush': 250,
        'Straight Flush': 50,
        'Four of a Kind': 25,
        'Full House': 9,
        'Flush': 6,
        'Straight': 4,
        'Three of a Kind': 3,
        'Two Pair': 2,
        'Pair (Jacks or Better)': 1,
        'High Card': 0,
      };

      const multiplier = multipliers[handRank] || 0;
      const won = multiplier > 0;
      const winAmount = won ? playDto.amount * multiplier : 0;

      const balanceBefore = parseFloat(user.balance.toString());
      const balanceAfter = balanceBefore - playDto.amount + winAmount;

      user.balance = balanceAfter;
      await manager.save(user);

      // Transacciones
      const betTransaction = manager.create(Transaction, {
        userId,
        type: TransactionType.BET,
        amount: -playDto.amount,
        balanceBefore,
        balanceAfter: balanceBefore - playDto.amount,
        status: TransactionStatus.COMPLETED,
        gameType: GameType.POKER,
      });
      await manager.save(betTransaction);

      if (won && winAmount > 0) {
        const winTransaction = manager.create(Transaction, {
          userId,
          type: TransactionType.WIN,
          amount: winAmount,
          balanceBefore: balanceBefore - playDto.amount,
          balanceAfter,
          status: TransactionStatus.COMPLETED,
          gameType: GameType.POKER,
        });
        await manager.save(winTransaction);
      }

      // Historial
      const gameHistory = manager.create(GameHistory, {
        userId,
        gameType: GameType.POKER,
        betAmount: playDto.amount,
        winAmount,
        result: won ? GameResult.WIN : GameResult.LOSS,
        balanceBefore,
        balanceAfter,
        gameData: {
          hand,
          handRank,
          multiplier,
          cardsKept: cardsToKeep,
        },
      });
      await manager.save(gameHistory);

      return {
        result: {
          won,
          hand,
          handRank,
          multiplier,
        },
        betAmount: playDto.amount,
        winAmount,
        newBalance: balanceAfter,
      };
    });
  }

  // ========== Métodos Helper para Blackjack ==========
  private createDeck(): string[] {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    for (const suit of suits) {
      for (const value of values) {
        deck.push(`${value}${suit}`);
      }
    }
    
    return deck;
  }

  private shuffleDeck(deck: string[]): string[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private calculateBlackjackScore(cards: string[]): number {
    let score = 0;
    let aces = 0;

    for (const card of cards) {
      const value = card.slice(0, -1); // Remover el palo
      
      if (value === 'A') {
        aces++;
        score += 11;
      } else if (['J', 'Q', 'K'].includes(value)) {
        score += 10;
      } else {
        score += parseInt(value);
      }
    }

    // Ajustar aces si es necesario
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  }

  // ========== Métodos Helper para Poker ==========
  private evaluatePokerHand(hand: string[]): string {
    // Separar valores y palos
    const values = hand.map(card => card.slice(0, -1));
    const suits = hand.map(card => card.slice(-1));

    // Convertir valores a números para comparación
    const valueMap = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
    const numericValues = values.map(v => valueMap[v]).sort((a, b) => b - a);

    // Contar frecuencias
    const valueCounts = {};
    numericValues.forEach(v => {
      valueCounts[v] = (valueCounts[v] || 0) + 1;
    });

    const counts = Object.values(valueCounts).sort((a: number, b: number) => b - a);
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = this.isStraight(numericValues);

    // Evaluar mano
    if (isFlush && isStraight && numericValues[0] === 14 && numericValues[4] === 10) {
      return 'Royal Flush';
    }
    if (isFlush && isStraight) {
      return 'Straight Flush';
    }
    if (counts[0] === 4) {
      return 'Four of a Kind';
    }
    if (counts[0] === 3 && counts[1] === 2) {
      return 'Full House';
    }
    if (isFlush) {
      return 'Flush';
    }
    if (isStraight) {
      return 'Straight';
    }
    if (counts[0] === 3) {
      return 'Three of a Kind';
    }
    if (counts[0] === 2 && counts[1] === 2) {
      return 'Two Pair';
    }
    if (counts[0] === 2 && numericValues[0] >= 11) {
      return 'Pair (Jacks or Better)';
    }
    
    return 'High Card';
  }

  private isStraight(values: number[]): boolean {
    // Verificar escalera normal
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] - values[i + 1] !== 1) {
        // Verificar escalera baja con As (A-2-3-4-5)
        if (!(values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2)) {
          return false;
        }
      }
    }
    return true;
  }


  // Método helper para obtener estadísticas del jugador
  async getPlayerStats(userId: string) {
    const totalGames = await this.gameHistoryRepository.count({ where: { userId } });
    const wins = await this.gameHistoryRepository.count({
      where: { userId, result: GameResult.WIN },
    });
    const losses = await this.gameHistoryRepository.count({
      where: { userId, result: GameResult.LOSS },
    });

    const gameHistories = await this.gameHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const totalBet = gameHistories.reduce((sum, game) => sum + parseFloat(game.betAmount.toString()), 0);
    const totalWon = gameHistories.reduce((sum, game) => sum + parseFloat(game.winAmount.toString()), 0);

    return {
      totalGames,
      wins,
      losses,
      winRate: totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : 0,
      totalBet,
      totalWon,
      netProfit: totalWon - totalBet,
    };
  }
}
