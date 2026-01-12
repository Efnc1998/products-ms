import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  /**
   * The name of the product.
   * @example 'Iphone 15 Pro'
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The price of the product.
   * Must be a positive number with max 4 decimal places.
   * @example 999.99
   */
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  price: number;
}
