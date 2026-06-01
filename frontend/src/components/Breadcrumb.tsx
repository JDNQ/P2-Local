"use client";

import React from "react";

export type BreadcrumbItem = {
    label: string;
};

export function Breadcrumb({
    items,
}: {
    items: BreadcrumbItem[];
}): React.JSX.Element {
    return (
        <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
                {items.map((item, idx) => (
                    <li
                        key={`${item.label}-${idx}`}
                        className="flex items-center gap-2"
                    >
                        <span>{item.label}</span>
                        {idx < items.length - 1 ? (
                            <span className="text-gray-400">/</span>
                        ) : null}
                    </li>
                ))}
            </ol>
        </nav>
    );
}


