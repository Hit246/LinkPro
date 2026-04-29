'use client'

import { useState, useRef } from 'react'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AvatarUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
    const [preview, setPreview] = useState<string>('')
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleFile(file: File) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    async function handleUpload() {
        if (!fileInputRef.current?.files?.[0]) return

        const file = fileInputRef.current.files[0]
        const formData = new FormData()
        formData.append('file', file)

        setUploading(true)
        setError('')

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error)
                return
            }

            const save = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatarUrl: data.data.secure_url }),
            })

            if (!save.ok) {
                setError('Failed to save avatar')
                return
            }

            setPreview('')
            if (fileInputRef.current) fileInputRef.current.value = ''
            onUploadComplete?.()
        } catch {
            setError('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    function resetImage() {
        setPreview('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Avatar</h2>

            {error && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-6 flex items-center gap-6">

                {/* AVATAR PREVIEW */}
                <div className="relative">
                    <div className="h-28 w-28 overflow-hidden rounded-full border bg-gray-100">
                        {preview ? (
                            <img src={preview} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                <UploadCloud />
                            </div>
                        )}
                    </div>

                    {/* LOADING OVERLAY */}
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                            <Loader2 className="animate-spin text-white" />
                        </div>
                    )}

                    {/* REMOVE BUTTON */}
                    {preview && !uploading && (
                        <button
                            onClick={resetImage}
                            className="absolute -top-2 -right-2 rounded-full bg-white p-1 shadow hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* UPLOAD AREA */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50"
                >
                    <UploadCloud className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">
                        Click or drag image to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG • Max 5MB
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </div>

            {/* ACTION */}
            {preview && (
                <div className="mt-6">
                    <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full rounded-xl"
                    >
                        {uploading ? 'Uploading...' : 'Save Avatar'}
                    </Button>
                </div>
            )}
        </div>
    )
}