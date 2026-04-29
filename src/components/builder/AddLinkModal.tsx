'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaLinkedin,
    FaLink,
} from 'react-icons/fa'

const ICON_OPTIONS = [
    { value: 'instagram', icon: FaInstagram, name: 'Instagram' },
    { value: 'youtube', icon: FaYoutube, name: 'YouTube' },
    { value: 'twitter', icon: FaTwitter, name: 'Twitter' },
    { value: 'linkedin', icon: FaLinkedin, name: 'LinkedIn' },
    { value: 'custom', icon: FaLink, name: 'Custom' },
]

export function AddLinkModal({ isOpen, onClose, onLinkAdded }: AddLinkModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        icon: 'custom',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()
            if (!response.ok) {
                setError(data.error)
                return
            }

            setFormData({ title: '', url: '', icon: 'custom' })
            onLinkAdded()
            onClose()
        } catch {
            setError('Failed to create link')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Link">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ERROR */}
                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* TITLE */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        Title
                    </label>
                    <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="My YouTube Channel"
                        required
                        className="mt-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* URL */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        URL
                    </label>
                    <Input
                        type="url"
                        value={formData.url}
                        onChange={(e) =>
                            setFormData({ ...formData, url: e.target.value })
                        }
                        placeholder="https://..."
                        required
                        className="mt-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* ICON PICKER (🔥 UPGRADE) */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        Icon
                    </label>

                    <div className="mt-3 grid grid-cols-5 gap-2">
                        {ICON_OPTIONS.map((opt) => {
                            const Icon = opt.icon

                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, icon: opt.value })
                                    }
                                    className={`flex flex-col items-center justify-center rounded-xl border p-3 transition ${formData.icon === opt.value
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="mt-1 text-xs">{opt.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-xl"
                    >
                        {loading ? 'Adding...' : 'Add Link'}
                    </Button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-300 py-2 font-semibold text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    )
}