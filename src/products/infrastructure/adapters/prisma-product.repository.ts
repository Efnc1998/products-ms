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
  async onModuleInit() {
    await this.$connect();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.product.create({
      data: createProductDto,
    });
    return product;
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
      data: products,
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
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.product.update({
      where: { id },
      data: updateProductDto,
    });
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    return product;
  }
}
