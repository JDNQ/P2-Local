"use client";

import { Controller } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFieldArrayRemove,
} from "react-hook-form";
import type { ProductSchema } from "@/schemas/productSchema";

export default function VariantRow({
  index,
  field,
  errors,
  control,
  remove,
  isSubmitting,
  disableRemove,
}: {
  index: number;
  field: any;
  errors: FieldErrors<ProductSchema>;
  control: Control<ProductSchema>;
  remove: UseFieldArrayRemove;
  isSubmitting: boolean;
  disableRemove: boolean;
}) {
  const variantError = (errors?.variants as any)?.[index] as any;

  return (
    <div className="grid grid-cols-[40px_1fr_120px_120px_60px] border-b border-gray-100 px-2 py-3">
      <div className="text-center text-gray-500 flex items-center justify-center">
        {index + 1}
      </div>

      {/* Variant Name */}
      <div className="pr-2">
        <Controller
          name={`variants.${index}.variantName`}
          control={control}
          render={({ field: rhfField }) => (
            <div>
              <input
                {...rhfField}
                className={`border rounded px-3 py-1.5 w-full text-sm ${
                  variantError?.variantName
                    ? "border-red-500 ring-1 ring-red-300"
                    : "border-gray-300"
                } focus:outline-none focus:ring-1 ${
                  variantError?.variantName
                    ? "focus:ring-red-300"
                    : "focus:ring-[#6C21E8]"
                }`}
              />
              {variantError?.variantName?.message ? (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {variantError.variantName.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      {/* Extra Price */}
      <div className="px-1">
        <Controller
          name={`variants.${index}.extraPrice`}
          control={control}
          render={({ field: rhfField }) => (
            <div>
              <input
                type="number"
                value={rhfField.value ?? 0}
                // Spec yêu cầu: input number phải dùng `valueAsNumber: true`.
                // Với Controller, dùng `e.target.valueAsNumber` để đảm bảo kiểu number.
                onChange={(e) => rhfField.onChange(e.target.valueAsNumber)}
                className={`border rounded px-3 py-1.5 w-full text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#6C21E8] ${
                  variantError?.extraPrice
                    ? "border-red-500 ring-1 ring-red-300 focus:ring-red-300"
                    : ""
                }`}
              />
              {variantError?.extraPrice?.message ? (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {variantError.extraPrice.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      {/* Stock */}
      <div className="px-1">
        <Controller
          name={`variants.${index}.stock`}
          control={control}
          render={({ field: rhfField }) => (
            <div>
              <input
                type="number"
                value={
                  typeof rhfField.value === "number" &&
                  Number.isFinite(rhfField.value)
                    ? rhfField.value
                    : ""
                }
                onChange={(e) => rhfField.onChange(e.target.valueAsNumber)}
                onBlur={(e) => {
                  // Nếu người dùng xoá hết ô -> valueAsNumber thành NaN, map về 0.
                  if (Number.isNaN(e.target.valueAsNumber))
                    rhfField.onChange(0);
                }}
                className={`border rounded px-3 py-1.5 w-full text-sm ${
                  variantError?.stock
                    ? "border-red-500 ring-1 ring-red-300"
                    : "border-gray-300"
                } focus:outline-none focus:ring-1 ${
                  variantError?.stock
                    ? "focus:ring-red-300"
                    : "focus:ring-[#6C21E8]"
                }`}
              />
              {/* Stock phải >= 0 (Zod check nested variants) */}
              {variantError?.stock?.message ? (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {variantError.stock.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      {/* Remove */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            if (!disableRemove) remove(index);
          }}
          disabled={disableRemove || isSubmitting}
          title={
            disableRemove
              ? "Không thể xóa khi chỉ còn 1 variant"
              : "Xóa variant"
          }
          className={`p-2 rounded hover:bg-red-50 ${
            disableRemove ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span style={{ color: disableRemove ? "#9CA3AF" : "#ef4444" }}>
            🗑️
          </span>
        </button>
      </div>
    </div>
  );
}
