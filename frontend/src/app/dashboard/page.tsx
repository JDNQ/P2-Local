"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useConfirm } from "@/components/ConfirmDialog";
import { Breadcrumb } from "@/components/Breadcrumb";

function formatMoney(n: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(n);
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-pulse">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="h-5 bg-gray-100 rounded w-2/3" />
                            <div className="mt-3 h-8 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>

                <div className="mt-8 space-y-3 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 bg-white border border-gray-200 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const { products, isLoaded, remove } = useProducts();
    const confirm = useConfirm();

    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalVariants = products.reduce(
            (sum, p) => sum + (p.variants?.length ?? 0),
            0,
        );
        const totalStock = products.reduce(
            (sum, p) =>
                sum +
                (p.variants ?? []).reduce(
                    (s, v) => s + (Number(v.stock) || 0),
                    0,
                ),
            0,
        );

        const avgPrice =
            totalProducts === 0
                ? 0
                : products.reduce((sum, p) => sum + (Number(p.basePrice) || 0), 0) /
                totalProducts;

        return { totalProducts, totalVariants, totalStock, avgPrice };
    }, [products]);

    if (!isLoaded) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <Breadcrumb items={[{ label: "Dashboard" }]} />
                        <h1 className="font-bold text-2xl text-[#6C21E8] mt-2">Dashboard</h1>
                    </div>

                    <Link
                        href="/add"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6C21E8] text-white font-semibold hover:bg-[#5a18c9]"
                    >
                        + Thêm mới
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-500">Tổng sản phẩm</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalProducts}
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-500">Tổng variants</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalVariants}
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-500">Tổng stock</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalStock}
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-500">Giá trung bình</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatMoney(stats.avgPrice)}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-gray-800 mb-3">Danh sách sản phẩm</h2>

                    {products.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-600">
                            Chưa có sản phẩm. Hãy bấm “Thêm mới”.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {products.map((p) => {
                                const totalStock = (p.variants ?? []).reduce(
                                    (sum, v) => sum + (Number(v.stock) || 0),
                                    0,
                                );

                                return (
                                    <div
                                        key={p.id}
                                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 text-lg truncate">
                                                    {p.productName}
                                                </h3>

                                                {p.description ? (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {p.description}
                                                    </p>
                                                ) : null}

                                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                                                    <div className="text-gray-600">
                                                        Giá:{" "}
                                                        <span className="font-semibold">
                                                            {formatMoney(Number(p.basePrice) || 0)}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-600">
                                                        Variants:{" "}
                                                        <span className="font-semibold">
                                                            {p.variants?.length ?? 0}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-600 col-span-2 sm:col-span-1">
                                                        Tổng stock:{" "}
                                                        <span className="font-semibold">{totalStock}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => router.push(`/edit/${p.id}`)}
                                                    className="px-3 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        confirm.confirm({
                                                            title: "Xác nhận xóa",
                                                            message: `Bạn có chắc muốn xóa “${p.productName}”?`,
                                                            confirmText: "Xóa",
                                                            cancelText: "Hủy",
                                                            onConfirm: () => {
                                                                remove(p.id);
                                                                router.refresh();
                                                            },
                                                        });
                                                    }}
                                                    className="px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 font-semibold"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


