import { ArrowUpRight } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    description?: string
}

export function StatsCard({ title, value, description }: StatsCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

            {/* subtle gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative">
                <p className="text-sm font-medium text-gray-500">{title}</p>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-3xl font-bold tracking-tight text-gray-900">
                        {value}
                    </p>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 transition group-hover:text-blue-500" />
                </div>

                {description && (
                    <p className="mt-2 text-sm text-gray-500">{description}</p>
                )}
            </div>
        </div>
    )
}