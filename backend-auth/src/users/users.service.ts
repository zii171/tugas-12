import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, Role } from './entities/user.entity';

// CATATAN: menyimpan data di memory (array) untuk kesederhanaan praktikum.
// Untuk produksi/persisten, ganti dengan Repository<User> dari TypeORM + MySQL.

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;
  private readonly SALT_ROUNDS = 10;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async create(email: string, name: string, plainPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);

    console.log('🔒 Password asli:', plainPassword);
    console.log('🔒 Password ter-hash (bcrypt):', hashedPassword);

    const user: User = {
      id: this.nextId++,
      email,
      name,
      password: hashedPassword,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
