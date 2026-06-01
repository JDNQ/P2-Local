import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { CreateVariantDto } from "./create-variant.dto";

/**
 * DTO tạo Product kèm danh sách Variants.
 */
export class CreateProductDto {
  @ApiProperty({
    example: "Áo thun basic",
    description: "Tên sản phẩm",
    maxLength: 100,
  })
  @IsString({ message: "productName phải là chuỗi" })
  @IsNotEmpty({ message: "productName không được để trống" })
  @MaxLength(100, { message: "productName không được vượt quá 100 ký tự" })
  productName!: string;

  @ApiPropertyOptional({
    example: "Áo thun cotton 100%",
    description: "Mô tả sản phẩm",
  })
  @IsOptional()
  @IsString({ message: "description phải là chuỗi" })
  description?: string;

  @ApiProperty({
    example: 150000,
    description: "Giá gốc (>= 0)",
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "basePrice phải là số" })
  @Min(0, { message: "basePrice phải lớn hơn hoặc bằng 0" })
  basePrice!: number;

  @ApiProperty({
    type: CreateVariantDto,
    isArray: true,
    minLength: 1,
    description: "Danh sách variants",
  })
  @IsArray({ message: "variants phải là mảng" })
  @ArrayMinSize(1, { message: "variants phải có ít nhất 1 phần tử" })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];
}
