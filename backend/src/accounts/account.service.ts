import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) {}

    async createAccount(ownerID: number, initialBalance: number = 100): Promise<Account> {
        const newAccount = this.accountRepository.create({
            OwnerID: ownerID,
            Balance: initialBalance,
        });

        return await this.accountRepository.save(newAccount);
    }

    async findByOwnerID(ownerID: number): Promise<Account | null> {
        return await this.accountRepository.findOne({
            where: { OwnerID: ownerID }
        });
    }

    async updateBalance(accountID: number, newBalance: number): Promise<Account | null> {
        await this.accountRepository.update(accountID, { Balance: newBalance });
        return await this.accountRepository.findOne({ where: { AccountID: accountID } });
    }
}