import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    findAll(): Promise<User[]>{
        return this.userRepository.find();
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { Username: username } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(userData);
        return this.userRepository.save(newUser);
    }

}
