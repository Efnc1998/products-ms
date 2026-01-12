import { PaginationDto, PaginatedResponse } from '@/shared';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export abstract class ProductRepository {
  /**
   * Persists a new product in the data store.
   * @param createProductDto Data to create the product
   * @returns The created product entity
   */
  abstract create(createProductDto: CreateProductDto): Promise<Product>;

  /**
   * Retrieves a paginated list of products from the data store.
   * @param paginationDto Pagination options (page, limit)
   * @returns A paginated response containing the list of products and metadata
   */
  abstract findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Product>>;

  /**
   * Finds a product by its ID in the data store.
   * @param id The ID of the product
   * @returns The found product authentication or null if not found
   */
  abstract findOne(id: number): Promise<Product | null>;

  /**
   * Updates an existing product in the data store.
   * @param id The ID of the product to update
   * @param updateProductDto Data to update
   * @returns The updated product entity
   */
  abstract update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product>;

  /**
   * Soft deletes a product from the data store.
   * @param id The ID of the product to remove
   * @returns The soft-deleted product entity
   */
  abstract remove(id: number): Promise<Product>;
}
