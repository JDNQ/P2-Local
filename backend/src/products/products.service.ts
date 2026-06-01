import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create product + nested variants.
   */
  async create(createDto: CreateProductDto) {
    // Ensure variants minLength=1 is enforced at DTO level.
    // Still keep a guard for safety.
    if (!createDto.variants?.length) {
      throw new BadRequestException("variants is required");
    }

    return this.prisma.product.create({
      data: {
        productName: createDto.productName,
        description: createDto.description,
        basePrice: createDto.basePrice,
        variants: {
          create: createDto.variants.map((v) => ({
            variantName: v.variantName,
            extraPrice: v.extraPrice ?? 0,
            stock: v.stock ?? 0,
          })),
        },
        // createdAt/updatedAt handled by Prisma defaults
      },
      include: { variants: true },
    });
  }

  /**
   * Get all products (with variants).
   */
  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { id: "desc" },
      include: { variants: true },
    });
  }

  /**
   * Get product by id (with variants).
   */
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  /**
   * Update product + variants.
   * Strategy: easiest and safe for dynamic form => delete old variants and create new.
   */
  async update(id: number, updateDto: CreateProductDto) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("Product not found");

    // Transaction for consistency.
    return this.prisma.$transaction(async (tx) => {
      await tx.variant.deleteMany({ where: { productId: id } });

      const updated = await tx.product.update({
        where: { id },
        data: {
          productName: updateDto.productName,
          description: updateDto.description,
          basePrice: updateDto.basePrice,
          variants: {
            create: updateDto.variants.map((v) => ({
              variantName: v.variantName,
              extraPrice: v.extraPrice ?? 0,
              stock: v.stock ?? 0,
            })),
          },
        },
        include: { variants: true },
      });

      return updated;
    });
  }

  /**
   * Delete product (and variants via cascade).
   */
  async remove(id: number) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("Product not found");

    await this.prisma.product.delete({ where: { id } });
    return { deleted: true };
  }
}
