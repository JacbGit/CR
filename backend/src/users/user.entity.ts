import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn } from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    UserID: number;

    @Column({ length: 63 })
    Name: string;

    @Column({length: 63})
    Surname: string;

    @Column({length: 63, unique: true })
    Username: string;

    @Column({length: 63})
    Password: string;

    @Column()
    Status: number;

    @Column({length: 255, nullable:true})
    Photo: string;

    @Column()
    UserType: number;

    @CreateDateColumn({type: 'datetime'})
    CreatedAt: Date;
}