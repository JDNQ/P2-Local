"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/schemas/productSchema";
import { VariantList } from "./VariantList";
import type { ProductSchema } from "@/schemas/productSchema";

export default function ProductForm({
  title,
  initialValues,
  onSubmit,
}: {
  title: string;
  initialValues?: Partial<ProductSchema>;
  onSubmit: (values: ProductSchema) => Promise<void> | void;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      description: "",
      basePrice: 0,
      variants: [{ variantName: "", extraPrice: 0, stock: 0 }],
      ...(initialValues ?? {}),
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const totalVariants = fields.length;

  const watchedVariants = watch("variants");
  const totalStock = useMemo(() => {
    return (watchedVariants ?? []).reduce(
      (sum: number, v: any) => sum + (Number(v?.stock) || 0),
      0,
    );
  }, [watchedVariants]);

  // Description is optional -> send undefined when user leaves it empty
  useEffect(() => {
    const desc = watch("description");
    if (desc === "") setValue("description", undefined);
  }, [watch, setValue]);

  // When initial values change (edit page), reset form
  useEffect(() => {
    if (!initialValues) return;
    reset({
      productName: initialValues.productName ?? "",
      description: initialValues.description ?? "",
      basePrice: initialValues.basePrice ?? 0,
      variants:
        initialValues.variants && initialValues.variants.length > 0
          ? initialValues.variants
          : [{ variantName: "", extraPrice: 0, stock: 0 }],
    });
  }, [initialValues, reset]);

  const productName = watch("productName") ?? "";
  const charCount = productName.length;

  const [submitMsg, setSubmitMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmitInternal = async (values: ProductSchema) => {
    setSubmitMsg(null);
    try {
      await onSubmit(values);
    } catch {
      setSubmitMsg({
        type: "error",
        text: "Lưu sản phẩm thất bại",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="font-bold text-xl text-[#6C21E8] mb-6">{title}</h1>

      {submitMsg ? (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${submitMsg.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
            }`}
          role="status"
          aria-live="polite"
        >
          {submitMsg.text}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmitInternal)}
        className="bg-white rounded-xl shadow-sm px-6 py-6"
      >
        {/* Product Name */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <label className="font-medium text-sm text-gray-700">
              Product Name *
            </label>
            <div className="text-xs text-gray-400">{charCount}/100</div>
          </div>

          <input
            {...register("productName")}
            placeholder="Nhập tên sản phẩm (tối đa 100 ký tự)"
            className={`border rounded-lg px-4 py-2 w-full mt-1 ${errors.productName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 ${errors.productName ? "ring-red-300" : "focus:ring-[#6C21E8]"
              }`}
          />

          {errors.productName ? (
            <p className="text-red-500 text-sm mt-1 font-medium">
              {errors.productName.message}
            </p>
          ) : null}
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="font-medium text-sm text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Mô tả sản phẩm (không bắt buộc)"
            className="border rounded-lg px-4 py-2 w-full min-h-[100px] resize-y border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#6C21E8] mt-1"
          />
        </div>

        {/* Base Price */}
        <div className="mb-6">
          <label className="font-medium text-sm text-gray-700">
            Base Price *
          </label>
          <input
            type="number"
            {...register("basePrice", { valueAsNumber: true })}
            placeholder="Nhập giá gốc (>= 0)"
            className={`border rounded-lg px-4 py-2 w-full mt-1 ${errors.basePrice ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 ${errors.basePrice ? "ring-red-300" : "focus:ring-[#6C21E8]"
              }`}
          />

          {errors.basePrice ? (
            <p className="text-red-500 text-sm mt-1 font-medium">
              {errors.basePrice.message}
            </p>
          ) : null}
        </div>

        {/* Variants */}
        <VariantList
          control={control}
          errors={errors}
          fields={fields}
          append={append}
          remove={remove}
          isSubmitting={isSubmitting}
          totalVariants={totalVariants}
          totalStock={totalStock}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full mt-6 bg-[#6C21E8] hover:bg-[#5a18c9] transition-all duration-200 text-white font-semibold text-base py-3 rounded-lg flex items-center justify-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {isSubmitting ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : null}
          {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
      </form>
    </div>
  );
}

