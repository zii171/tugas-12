import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // ===== REGISTER =====
  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      // 409 Conflict jika email sudah terdaftar
      throw new ConflictException('Email sudah terdaftar');
    }

    const user = await this.usersService.create(dto.email, dto.name, dto.password);

    // Jangan pernah kembalikan field password ke response
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // ===== LOGIN =====
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Payload JWT: jangan masukkan data sensitif (password)
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password, ...safeUser } = user;
    return {
      accessToken,
      user: safeUser,
    };
  }
}
