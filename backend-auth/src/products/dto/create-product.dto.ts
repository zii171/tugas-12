import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong' })
  name: string;

  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  category: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
