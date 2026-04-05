import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '@/config';
import { ProductsService } from './domain/ports/products.service';
import { ProductsServiceImpl } from './application/services/products.service.impl';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { ProductRepository } from './domain/ports/product.repository';
import { PrismaProductRepository } from './infrastructure/adapters/prisma-product.repository';
import { InventoryService } from './application/services/inventory.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'products-producer',
            brokers: envs.kafkaBrokers,
          },
          consumer: {
            groupId: 'products-producer-group',
          },
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    { provide: ProductsService, useClass: ProductsServiceImpl },
    { provide: ProductRepository, useClass: PrismaProductRepository },
    InventoryService,
  ],
})
export class ProductsModule {}
