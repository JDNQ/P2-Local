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
exports.CreateVariantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * DTO cho từng Variant.
 * - variantName bắt buộc, có độ dài tự do (DB sẽ lưu theo schema)
 * - extraPrice mặc định 0
 * - stock mặc định 0 và min 0
 */
class CreateVariantDto {
    constructor() {
        this.extraPrice = 0;
        this.stock = 0;
    }
}
exports.CreateVariantDto = CreateVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "M - Trắng",
        description: "Tên variant",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Variant name là bắt buộc" }),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10000,
        required: false,
        default: 0,
        description: "Giá cộng thêm so với basePrice",
        minimum: 0,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "extraPrice phải là một số" }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "extraPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25,
        required: false,
        default: 0,
        description: "Số lượng tồn kho",
        minimum: 0,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: "stock phải là số nguyên" }),
    (0, class_validator_1.Min)(0, { message: "stock phải hơn hoặc bằng 0" }),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "stock", void 0);
