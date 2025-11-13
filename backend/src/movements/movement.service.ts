import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movement } from './movement.entity';

@Injectable()
export class MovementsService {
    constructor(
        @InjectRepository(Movement)
        private movementRepository: Repository<Movement>,
    ) {}

    async createMovement(accountID: number, balance: number, gameID?: number): Promise<Movement> {
        const newMovement = this.movementRepository.create({
            AccountID: accountID,
            Balance: balance,
            GameID: gameID,
        });

        return await this.movementRepository.save(newMovement);
    }

    async getMovementsByAccount(accountID: number): Promise<Movement[]> {
        return await this.movementRepository.find({
            where: { AccountID: accountID },
            order: { RegisteredAt: 'DESC' }
        });
    }
}