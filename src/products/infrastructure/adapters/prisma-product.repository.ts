import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../../domain/ports/product.repository';
import { CreateProductDto } from '../../domain/dto/create-product.dto';
import { UpdateProductDto } from '../../domain/dto/update-product.dto';
import { Product } from '../../domain/entities/product.entity';
import { PaginationDto, PaginatedResponse } from '@/shared';

@Injectable()
export class PrismaProductRepository
  extends PrismaClient
  implements OnModuleInit, ProductRepository
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.product.create({
      data: createProductDto,
    });
    return {
      ...product,
      price: Number(product.price),
    } as Product;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Product>> {
    const { page, limit } = paginationDto;
    const totalPage = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPage / limit);

    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: products.map(p => ({ ...p, price: Number(p.price) } as Product)),
      meta: {
        totalItems: totalPage,
        currentPage: page,
        lastPage,
      },
    };
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });
    return product ? { ...product, price: Number(product.price) } as Product : null;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.product.update({
      where: { id },
      data: updateProductDto,
    });
    return { ...product, price: Number(product.price) } as Product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.product.update({
      where: { id },
      data: { available: false },
    });
    return { ...product, price: Number(product.price) };
  }

  /**
   * Ajusta el stock de un producto atómicamente usando la operación `increment` de Prisma.
   * `increment` positivo suma, negativo resta — garantiza operación atómica en BD.
   */
  async adjustStock(id: number, increment: number): Promise<Product> {
    const product = await this.product.update({
      where: { id },
      data: { stock: { increment } },
    });
    return { ...product, price: Number(product.price) };
  }
}
