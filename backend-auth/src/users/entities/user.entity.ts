export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}