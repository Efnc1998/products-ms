import { PaginationDto } from '@/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateProductDto } from '../../domain/dto/create-product.dto';
import { UpdateProductDto } from '../../domain/dto/update-product.dto';
import { ProductRepository } from '../../domain/ports/product.repository';
import { ProductsService } from '../../domain/ports/products.service';

@Injectable()
export class ProductsServiceImpl implements ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  private readonly logger = new Logger(ProductsServiceImpl.name);

  async create(createProductDto: CreateProductDto) {
    this.logger.log(`Creating product: ${JSON.stringify(createProductDto)}`);
    const product = await this.productRepository.create(createProductDto);
    this.logger.log(`Product created: ${JSON.stringify(product)}`);
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    this.logger.log(`Retrieving products - Page: ${page}, Limit: ${limit}`);

    const paginatedResult = await this.productRepository.findAll(paginationDto);

    this.logger.log(
      `Products retrieved: ${paginatedResult.data.length} items (Total: ${paginatedResult.meta.totalItems})`,
    );

    return paginatedResult;
  }

  async findOne(id: number) {
    this.logger.log(`Retrieving product with id: ${id}`);
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    this.logger.log(`Product found: ${JSON.stringify(product)}`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    this.logger.log(
      `Updating product with id: ${id}, data: ${JSON.stringify(updateProductDto)}`,
    );

    const product = await this.productRepository.update(id, updateProductDto);

    this.logger.log(`Product updated: ${JSON.stringify(product)}`);
    return product;
  }

  async remove(id: number) {
    await this.findOne(id);
    this.logger.log(`Soft deleting product with id: ${id}`);

    const product = await this.productRepository.remove(id);

    this.logger.log(`Product soft deleted with id: ${id}`);
    return product;
  }
}
