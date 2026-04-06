import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  name: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  stock: number;
}
