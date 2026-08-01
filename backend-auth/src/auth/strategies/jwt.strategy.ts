import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // token expired -> otomatis ditolak (401)
      secretOrKey: process.env.JWT_SECRET || 'rahasia_super_aman_ganti_di_env',
    });
  }

  // Dipanggil otomatis oleh Passport setelah token berhasil di-decode & verifikasi signature+expiry.
  // Return value di sini akan tersedia sebagai `request.user` di controller.
  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan atau token tidak valid');
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
