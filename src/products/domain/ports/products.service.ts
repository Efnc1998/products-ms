import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto, PaginatedResponse } from '@/shared';
import { Product } from '../entities/product.entity';

export abstract class ProductsService {
  /**
   * Creates a new product.
   * @param createProductDto Data to create the product
   * @returns The created product
   */
  abstract create(createProductDto: CreateProductDto): Promise<Product>;

  /**
   * Retrieves a paginated list of products.
   * @param paginationDto Pagination options (page, limit)
   * @returns A paginated response containing the list of products and metadata
   */
  abstract findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Product>>;

  /**
   * Finds a product by its ID.
   * @param id The ID of the product
   * @returns The found product
   * @throws RpcException with NotFound status if product does not exist or is unavailable
   */
  abstract findOne(id: number): Promise<Product>;

  /**
   * Updates an existing product.
   * @param id The ID of the product to update
   * @param updateProductDto Data to update
   * @returns The updated product
   * @throws RpcException with NotFound status if product does not exist
   */
  abstract update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product>;

  /**
   * Soft deletes a product (sets available to false).
   * @param id The ID of the product to remove
   * @returns The updated/removed product
   * @throws RpcException with NotFound status if product does not exist
   */
  abstract remove(id: number): Promise<Product>;
}
