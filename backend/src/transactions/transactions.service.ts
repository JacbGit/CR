import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(userId: string, limit: number = 50): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    return transaction;
  }

  async getTransactionsSummary(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { userId },
    });

    const totalDeposits = transactions
      .filter((t) => t.type === 'deposit')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalWithdrawals = transactions
      .filter((t) => t.type === 'withdrawal')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalBets = transactions
      .filter((t) => t.type === 'bet')
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);

    const totalWins = transactions
      .filter((t) => t.type === 'win')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    return {
      totalTransactions: transactions.length,
      totalDeposits,
      totalWithdrawals,
      totalBets,
      totalWins,
      netProfit: totalWins - totalBets,
    };
  }
}
