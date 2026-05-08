import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  organization?: string;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory store for demo — replace with Prisma in production
const USERS: User[] = [
  {
    id: 'admin-001',
    name: 'KusMedios Admin',
    email: 'admin@kusmedios.com',
    password: bcrypt.hashSync('Admin1234!', 12),
    role: 'admin',
    organization: 'EstacionKusMedios',
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'operator-001',
    name: 'Operador Demo',
    email: 'operador@kusmedios.com',
    password: bcrypt.hashSync('Operador1234!', 12),
    role: 'operator',
    organization: 'EstacionKusMedios',
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'client-001',
    name: 'Cliente Demo',
    email: 'cliente@demo.com',
    password: bcrypt.hashSync('Cliente1234!', 12),
    role: 'client',
    organization: 'Radio Demo FM',
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | undefined> {
    return USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findById(id: string): Promise<User | undefined> {
    return USERS.find((u) => u.id === id);
  }

  async create(data: Partial<User>): Promise<User> {
    const user: User = {
      id: uuidv4(),
      name: data.name!,
      email: data.email!,
      password: data.password!,
      role: data.role || 'client',
      organization: data.organization,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    USERS.push(user);
    return user;
  }

  async updateRefreshToken(userId: string, token: string | null) {
    const user = USERS.find((u) => u.id === userId);
    if (!user) return;
    user.refreshToken = token ? await bcrypt.hash(token, 10) : null;
    user.updatedAt = new Date();
  }

  async findAll(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
    return USERS.map(({ password, refreshToken, ...u }) => u);
  }
}
