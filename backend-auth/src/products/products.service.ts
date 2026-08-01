import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// CATATAN: data disimpan di memory untuk kesederhanaan praktikum.
// Ganti dengan Repository<Product> dari TypeORM + MySQL untuk persisten.

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product dengan id ${id} tidak ditemukan`);
    }
    return product;
  }

  create(dto: CreateProductDto): Product {
    const product: Product = {
      id: this.nextId++,
      name: dto.name,
      price: dto.price,
      description: dto.description ?? '',
      category: dto.category,
      stock: dto.stock ?? 0,
      isAvailable: dto.isAvailable ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  update(id: number, dto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, dto, { updatedAt: new Date() });
    return product;
  }

  remove(id: number): { message: string } {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product dengan id ${id} tidak ditemukan`);
    }
    this.products.splice(index, 1);
    return { message: `Product dengan id ${id} berhasil dihapus` };
  }
}
