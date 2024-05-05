import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { IUser } from './types/user.interface';
import { GoogleAuthDto } from '@/auth/dto/google-auth.dto';
import { RegisterAuthDto } from '@/auth/dto/register-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: RegisterAuthDto | GoogleAuthDto) {
    if (dto instanceof RegisterAuthDto) {
      const newUser = new User({
        ...dto,
        email: dto.email.toLocaleLowerCase(),
        passwordHash: dto.password,
      });
      return await this.userRepository.save(newUser);
    }

    if (dto instanceof GoogleAuthDto) {
      const newUser = new User({
        ...dto,
        email: dto.email.toLocaleLowerCase(),
      });
      return await this.userRepository.save(newUser);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async save(user: IUser) {
    return await this.userRepository.save(user);
  }
}
