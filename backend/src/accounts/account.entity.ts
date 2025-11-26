import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../users/user.entity";
import { Movement } from "../movements/movement.entity"

@Entity('Account')
export class Account {
    @PrimaryGeneratedColumn()
    AccountID: number;

    @Column()
    OwnerID: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    Balance: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'OwnerID' })
    owner: User;

    @OneToMany(() => Movement, movement => movement.account)
    movements: Movement[];
}