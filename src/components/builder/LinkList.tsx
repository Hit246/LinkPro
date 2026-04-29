'use client'

import { useState, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { LinkCard } from './LinkCard'
import { AddLinkModal } from './AddLinkModal'
import { Button } from '@/components/ui/Button'

interface Link {
    id: string
    title: string
    url: string
    icon: string
    position: number
    isActive: boolean
}

export function LinkList() {
    const [links, setLinks] = useState<Link[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        fetchLinks()
    }, [])

    async function fetchLinks() {
        try {
            const response = await fetch('/api/links')
            const data = await response.json()
            if (data.data) {
                setLinks(data.data)
            }
        } catch (err) {
            setError('Failed to load links')
        } finally {
            setLoading(false)
        }
    }

    async function handleDragEnd(event: any) {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = links.findIndex((l) => l.id === active.id)
            const newIndex = links.findIndex((l) => l.id === over.id)
            const newOrder = arrayMove(links, oldIndex, newIndex)
            setLinks(newOrder)

            try {
                await fetch('/api/links/reorder', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        links: newOrder.map((l, idx) => ({ id: l.id, position: idx })),
                    }),
                })
            } catch (err) {
                setError('Failed to save order')
            }
        }
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/links/${id}`, { method: 'DELETE' })
            setLinks(links.filter((l) => l.id !== id))
        } catch (err) {
            setError('Failed to delete link')
        }
    }

    async function handleToggle(id: string, isActive: boolean) {
        try {
            await fetch(`/api/links/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive }),
            })
            setLinks(
                links.map((l) =>
                    l.id === id ? { ...l, isActive: !isActive } : l
                )
            )
        } catch (err) {
            setError('Failed to toggle link')
        }
    }

    if (loading) {
        return <p className="text-gray-600">Loading links...</p>
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Your Links
                    </h2>
                    <p className="text-sm text-gray-500">
                        Drag to reorder • Toggle visibility • Edit anytime
                    </p>
                </div>

                <Button
                    onClick={() => setShowModal(true)}
                    className="rounded-xl px-4"
                >
                    + Add Link
                </Button>
            </div>

            {/* ERROR */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* LOADING STATE */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-16 animate-pulse rounded-xl bg-gray-100"
                        />
                    ))}
                </div>
            ) : links.length === 0 ? (
                /* EMPTY STATE */
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-12 text-center">
                    <p className="text-gray-600 font-medium">
                        No links yet
                    </p>
                    <p className="text-sm text-gray-500">
                        Add your first link to get started
                    </p>

                    <Button
                        onClick={() => setShowModal(true)}
                        className="mt-4 rounded-xl"
                    >
                        Add First Link
                    </Button>
                </div>
            ) : (
                /* LIST */
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={links.map((l) => l.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {links.map((link) => (
                                <div
                                    key={link.id}
                                    className="transition-transform duration-200"
                                >
                                    <LinkCard
                                        link={link}
                                        onDelete={handleDelete}
                                        onToggle={handleToggle}
                                    />
                                </div>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* MODAL */}
            <AddLinkModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onLinkAdded={() => {
                    setShowModal(false)
                    fetchLinks()
                }}
            />
        </div>
    )
}
