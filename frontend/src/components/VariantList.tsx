"use client";

import { useWatch } from "react-hook-form";
import type {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import VariantRow from "./VariantRow";
import type { ProductSchema } from "@/schemas/productSchema";

type VariantErrors = FieldErrors<ProductSchema>;

export function VariantList({
  control,
  errors,
  fields,
  append,
  remove,
  isSubmitting,
  totalVariants,
  totalStock,
}: {
  control: Control<ProductSchema>;
  errors: VariantErrors;
  fields: FieldArrayWithId<ProductSchema, "variants", "id">[];
  append: UseFieldArrayAppend<ProductSchema, "variants">;
  remove: UseFieldArrayRemove;
  isSubmitting: boolean;
  totalVariants: number;
  totalStock: number;
}) {
  // Still watch to keep header realtime even if parent doesn't recompute fast
  useWatch({ control, name: "variants" });

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 justify-between">
        <div className="font-semibold text-gray-700">Variants</div>
        <div className="text-sm font-medium text-[#6C21E8]">
          Tổng variants: {totalVariants}{" "}
          <span className="text-gray-400">|</span> Tổng stock: {totalStock}
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="grid grid-cols-[40px_1fr_120px_120px_60px] gap-0 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 py-2 px-2">
          <div className="text-center">#</div>
          <div>Variant Name *</div>
          <div className="text-center">Extra Price</div>
          <div className="text-center">Stock *</div>
          <div className="text-center">Thao tác</div>
        </div>

        {fields.map((field, index) => (
          <VariantRow
            key={field.id}
            index={index}
            field={field}
            errors={errors}
            control={control}
            remove={remove}
            isSubmitting={isSubmitting}
            disableRemove={fields.length <= 1}
          />
        ))}
      </div>

      {/* Add variant */}
      <button
        type="button"
        onClick={() => append({ variantName: "", extraPrice: 0, stock: 0 })}
        className="mt-4 border border-dashed border-purple-400 text-purple-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-50"
      >
        <span className="mr-2">+</span> Thêm variant
      </button>
    </div>
  );
}

export default VariantList;
