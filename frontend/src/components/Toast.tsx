"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

export type ToastPayload = {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
};

type ToastContextValue = {
    push: (payload: Omit<ToastPayload, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ToastColors: Record<ToastType, { container: string; title: string; border: string }> = {
    success: {
        container: "bg-emerald-50",
        title: "text-emerald-700",
        border: "border-emerald-200",
    },
    error: {
        container: "bg-red-50",
        title: "text-red-700",
        border: "border-red-200",
    },
    info: {
        container: "bg-purple-50",
        title: "text-[#6C21E8]",
        border: "border-purple-200",
    },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastPayload[]>([]);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (payload: Omit<ToastPayload, "id">) => {
            const id = crypto.randomUUID();
            const toast: ToastPayload = { ...payload, id };

            setToasts((prev) => [toast, ...prev].slice(0, 5));

            window.setTimeout(() => {
                remove(id);
            }, 3000);
        },
        [remove],
    );

    const value = useMemo<ToastContextValue>(() => ({ push }), [push]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-[360px] max-w-[calc(100vw-2rem)]">
                {toasts.map((t) => {
                    const colors = ToastColors[t.type];
                    return (
                        <div
                            key={t.id}
                            className={`rounded-lg border px-4 py-3 shadow-sm ${colors.container} ${colors.border}`}
                            role="status"
                            aria-live="polite"
                        >
                            <div className={`font-semibold text-sm ${colors.title}`}>{t.title}</div>
                            {t.message ? (
                                <div className="text-xs text-gray-600 mt-1">{t.message}</div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return {
        success: (title: string, message?: string) => ctx.push({ type: "success", title, message }),
        error: (title: string, message?: string) => ctx.push({ type: "error", title, message }),
        info: (title: string, message?: string) => ctx.push({ type: "info", title, message }),
    };
}

