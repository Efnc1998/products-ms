import { Module } from '@nestjs/common';
import { ProductsService } from './domain/ports/products.service';
import { ProductsServiceImpl } from './application/services/products.service.impl';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { ProductRepository } from './domain/ports/product.repository';
import { PrismaProductRepository } from './infrastructure/adapters/prisma-product.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: ProductsService,
      useClass: ProductsServiceImpl,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductsModule {}
