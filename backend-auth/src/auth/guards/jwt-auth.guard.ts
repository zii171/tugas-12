import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard ini memicu JwtStrategy di atas. Ditempel dengan @UseGuards(JwtAuthGuard)
// di controller/route yang ingin diproteksi. Kalau token tidak ada / invalid /
// expired, Passport otomatis melempar 401 Unauthorized sebelum masuk ke handler.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
