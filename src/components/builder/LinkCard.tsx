'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
    GripVertical,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
} from 'lucide-react'
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

interface Link {
    id: string
    title: string
    url: string
    icon: string
    isActive: boolean
}

interface LinkCardProps {
    link: Link
    onDelete: (id: string) => void
    onToggle: (id: string, isActive: boolean) => void
}

export function LinkCard({ link, onDelete, onToggle }: LinkCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: link.id })
    const [isEditing, setIsEditing] = useState(false)
    const [editedLink, setEditedLink] = useState(link)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    async function handleSave() {
        setSaving(true)
        setError('')

        try {
            const response = await fetch(`/api/links/${link.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editedLink.title,
                    url: editedLink.url,
                    icon: editedLink.icon,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error)
                return
            }

            setIsEditing(false)
        } catch (err) {
            setError('Failed to save')
        } finally {
            setSaving(false)
        }
    }

    if (isEditing) {
        return (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-4">

                <input
                    type="text"
                    value={editedLink.title}
                    onChange={(e) =>
                        setEditedLink({ ...editedLink, title: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Title"
                />

                <input
                    type="url"
                    value={editedLink.url}
                    onChange={(e) =>
                        setEditedLink({ ...editedLink, url: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="URL"
                />

                {/* ICON PICKER */}
                <div className="grid grid-cols-5 gap-2">
                    {ICON_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                setEditedLink({ ...editedLink, icon: opt.value })
                            }
                            className={`rounded-lg border p-2 text-sm ${editedLink.icon === opt.value
                                ? 'bg-blue-100 border-blue-400'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            {opt.name}
                        </button>
                    ))}
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleSave}>
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${link.isActive ? '' : 'opacity-50'
                }`}
        >
            {/* LEFT: DRAG + INFO */}
            <div className="flex items-center gap-3">

                {/* DRAG HANDLE */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-gray-400 hover:text-gray-600"
                >
                    <GripVertical size={18} />
                </div>

                {/* INFO */}
                <div>
                    <p className="font-semibold text-gray-900">{link.title}</p>
                    <p className="max-w-xs truncate text-sm text-gray-500">
                        {link.url}
                    </p>
                </div>
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="flex items-center gap-2">

                {/* TOGGLE */}
                <button
                    onClick={() => onToggle(link.id, link.isActive)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                    {link.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>

                {/* EDIT */}
                <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg p-2 text-blue-500 hover:bg-blue-50"
                >
                    <Pencil size={18} />
                </button>

                {/* DELETE */}
                <button
                    onClick={() => onDelete(link.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    )
}
