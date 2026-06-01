import { z } from "zod";

// Schema Variant dùng cho useFieldArray
export const variantSchema = z.object({
  variantName: z.string().min(1, "Variant name là bắt buộc"),
  extraPrice: z.number().min(0).default(0),
  stock: z.number().min(0, "stock phải hơn hoặc bằng 0"),
});

// Schema Product dùng cho toàn form
export const productSchema = z.object({
  productName: z
    .string()
    .min(1, "Product name là bắt buộc")
    .max(100, "Product name không được vượt quá 100 ký tự"),
  description: z.string().optional(),
  basePrice: z.number().min(0, "Base price phải lớn hơn hoặc bằng 0"),
  variants: z.array(variantSchema).min(1),
});

// Type infer từ schema
export type VariantSchema = z.infer<typeof variantSchema>;
export type ProductSchema = z.infer<typeof productSchema>;
