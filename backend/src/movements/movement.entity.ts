import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Account } from "../accounts/account.entity";

@Entity('Movements')
export class Movement {
    @PrimaryGeneratedColumn()
    MovementID: number;

    @Column({ type: 'int' })
    AccountID: number;

    @Column({ nullable: true, type: 'int' })
    GameID: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    Balance: number;

    @CreateDateColumn({ type: 'datetime' })
    RegisteredAt: Date;

    @ManyToOne(() => Account, account => account.movements)
    @JoinColumn({ name: 'AccountID' })
    account: Account;
}