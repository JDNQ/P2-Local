"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ConfirmState = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
};

type ConfirmContextValue = {
    open: (args: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm: () => void;
        onCancel?: () => void;
    }) => void;
    close: () => void;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<ConfirmState>({
        isOpen: false,
        title: "",
        message: "",
    });

    const close = useCallback(() => {
        setState((prev) => ({ ...prev, isOpen: false, onConfirm: undefined, onCancel: undefined }));
    }, []);

    const open = useCallback(
        (args: {
            title: string;
            message: string;
            confirmText?: string;
            cancelText?: string;
            onConfirm: () => void;
            onCancel?: () => void;
        }) => {
            setState({
                isOpen: true,
                title: args.title,
                message: args.message,
                confirmText: args.confirmText,
                cancelText: args.cancelText,
                onConfirm: args.onConfirm,
                onCancel: args.onCancel,
            });
        },
        [],
    );

    const value = useMemo<ConfirmContextValue>(() => ({ open, close }), [open, close]);

    const confirm = () => {
        const handler = state.onConfirm;
        close();
        handler?.();
    };

    const cancel = () => {
        const handler = state.onCancel;
        close();
        handler?.();
    };

    return (
        <ConfirmContext.Provider value={value}>
            {children}

            {state.isOpen ? (
                <div className="fixed inset-0 z-[120] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={cancel}
                        aria-hidden="true"
                    />

                    <div className="relative w-full max-w-md rounded-xl bg-white shadow-lg border border-gray-200 px-6 py-5">
                        <div className="font-semibold text-gray-900 text-base">{state.title}</div>
                        <div className="text-sm text-gray-700 mt-2">{state.message}</div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={cancel}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                {state.cancelText ?? "Hủy"}
                            </button>
                            <button
                                type="button"
                                onClick={confirm}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                {state.confirmText ?? "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) {
        throw new Error("useConfirm must be used within ConfirmDialogProvider");
    }

    return {
        confirm: (args: {
            title: string;
            message: string;
            confirmText?: string;
            cancelText?: string;
            onConfirm: () => void;
            onCancel?: () => void;
        }) => {
            ctx.open(args);
        },
    };
}

