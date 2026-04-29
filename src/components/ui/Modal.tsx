'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    // ESC key support
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
        }

        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BACKDROP */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* MODAL */}
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-[scaleIn_0.2s_ease]">

                {/* HEADER */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* CONTENT */}
                <div>{children}</div>
            </div>
        </div>
    )
}