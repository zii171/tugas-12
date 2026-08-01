import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // dibutuhkan supaya JwtAuthGuard dapat memverifikasi token
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
