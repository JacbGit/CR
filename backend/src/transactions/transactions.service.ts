import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from './transaction.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
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

  async deposit(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }

    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      
      const balanceBefore = parseFloat(user.balance.toString());
      const balanceAfter = balanceBefore + amount;

      user.balance = balanceAfter;
      await manager.save(user);

      const transaction = manager.create(Transaction, {
        userId,
        type: TransactionType.DEPOSIT,
        amount,
        balanceBefore,
        balanceAfter,
        status: TransactionStatus.COMPLETED,
      });
      await manager.save(transaction);

      return {
        message: 'Depósito exitoso',
        amount,
        newBalance: balanceAfter,
        transaction,
      };
    });
  }
}
