import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('Games')
export class Game {
    @PrimaryGeneratedColumn()
    GameID: number;

    @Column({ length: 31 })
    Name: string;

    @Column({ length: 255, nullable: true })
    ImagePath: string;

    @Column({ length: 255 })
    Link: string;
}