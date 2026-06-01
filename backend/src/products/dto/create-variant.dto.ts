import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsNotEmpty, Min } from "class-validator";

/**
 * DTO cho từng Variant.
 * - variantName bắt buộc, có độ dài tự do (DB sẽ lưu theo schema)
 * - extraPrice mặc định 0
 * - stock mặc định 0 và min 0
 */
export class CreateVariantDto {
  @ApiProperty({
    example: "M - Trắng",
    description: "Tên variant",
  })
  @IsNotEmpty({ message: "Variant name là bắt buộc" })
  variantName!: string;

  @ApiProperty({
    example: 10000,
    required: false,
    default: 0,
    description: "Giá cộng thêm so với basePrice",
    minimum: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: "extraPrice phải là một số" })
  @Min(0)
  extraPrice: number = 0;

  @ApiProperty({
    example: 25,
    required: false,
    default: 0,
    description: "Số lượng tồn kho",
    minimum: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: "stock phải là số nguyên" })
  @Min(0, { message: "stock phải hơn hoặc bằng 0" })
  stock: number = 0;
}
