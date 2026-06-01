"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { useProducts } from "@/hooks/useProducts";
import ProductForm from "@/components/ProductForm";
import type { ProductSchema } from "@/schemas/productSchema";
import { Breadcrumb } from "@/components/Breadcrumb";

export default function AddProductPage() {
    const router = useRouter();
    const { add, isLoaded } = useProducts();
    const toast = useToast();

    if (!isLoaded) {
        return (
            <div className="min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-6">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <Breadcrumb
                    items={[{ label: "Dashboard" }, { label: "Thêm sản phẩm" }]}
                />

                <div className="mt-6">
                    <ProductForm
                        title="Thêm sản phẩm mới"
                        onSubmit={async (data: ProductSchema) => {
                            add(data);
                            toast.success("Thêm sản phẩm thành công");
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


