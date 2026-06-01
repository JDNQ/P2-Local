"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/Toast";
import { useProducts } from "@/hooks/useProducts";
import ProductForm from "@/components/ProductForm";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { Product } from "@/hooks/useProducts";
import type { ProductSchema } from "@/schemas/productSchema";

function mapProductToInitialValues(p: Product): ProductSchema {
    return {
        productName: p.productName,
        description: p.description,
        basePrice: p.basePrice,
        variants: p.variants,
    };
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const toast = useToast();
    const { getById, update, isLoaded } = useProducts();

    const product = id ? getById(id) : undefined;

    useEffect(() => {
        if (!isLoaded) return;
        if (id && !product) {
            router.push("/dashboard");
        }
    }, [id, isLoaded, product, router]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-6">Đang tải...</div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <Breadcrumb
                    items={[
                        { label: "Dashboard" },
                        { label: `Chỉnh sửa: ${product.productName}` },
                    ]}
                />

                <div className="mt-6">
                    <ProductForm
                        title="Chỉnh sửa sản phẩm"
                        initialValues={mapProductToInitialValues(product)}
                        onSubmit={async (data: ProductSchema) => {
                            if (!id) return;
                            update(id, data);
                            toast.success("Đã cập nhật thành công");
                            setTimeout(() => {
                                router.push("/dashboard");
                            }, 1500);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}


