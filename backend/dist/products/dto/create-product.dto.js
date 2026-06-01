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
exports.CreateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_variant_dto_1 = require("./create-variant.dto");
/**
 * DTO tạo Product kèm danh sách Variants.
 */
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Áo thun basic",
        description: "Tên sản phẩm",
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)({ message: "productName phải là chuỗi" }),
    (0, class_validator_1.IsNotEmpty)({ message: "productName không được để trống" }),
    (0, class_validator_1.MaxLength)(100, { message: "productName không được vượt quá 100 ký tự" }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Áo thun cotton 100%",
        description: "Mô tả sản phẩm",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "description phải là chuỗi" }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 150000,
        description: "Giá gốc (>= 0)",
        minimum: 0,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: "basePrice phải là số" }),
    (0, class_validator_1.Min)(0, { message: "basePrice phải lớn hơn hoặc bằng 0" }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: create_variant_dto_1.CreateVariantDto,
        isArray: true,
        minLength: 1,
        description: "Danh sách variants",
    }),
    (0, class_validator_1.IsArray)({ message: "variants phải là mảng" }),
    (0, class_validator_1.ArrayMinSize)(1, { message: "variants phải có ít nhất 1 phần tử" }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_variant_dto_1.CreateVariantDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
