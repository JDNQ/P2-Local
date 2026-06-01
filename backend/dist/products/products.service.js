"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create product + nested variants.
     */
    async create(createDto) {
        // Ensure variants minLength=1 is enforced at DTO level.
        // Still keep a guard for safety.
        if (!createDto.variants?.length) {
            throw new common_1.BadRequestException("variants is required");
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
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { variants: true },
        });
        if (!product)
            throw new common_1.NotFoundException("Product not found");
        return product;
    }
    /**
     * Update product + variants.
     * Strategy: easiest and safe for dynamic form => delete old variants and create new.
     */
    async update(id, updateDto) {
        const exists = await this.prisma.product.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException("Product not found");
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
    async remove(id) {
        const exists = await this.prisma.product.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException("Product not found");
        await this.prisma.product.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
