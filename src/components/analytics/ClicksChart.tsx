import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface ClicksChartProps {
    data: Array<{
        date: string
        views: number
    }>
}

export function ClicksChart({ data }: ClicksChartProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Page Views (Last 14 Days)
            </h3>

            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '10px',
                                border: 'none',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            }}
                        />
                        <Bar
                            dataKey="views"
                            radius={[6, 6, 0, 0]}
                            fill="url(#gradient)"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500">No data available</p>
            )}
        </div>
    )
}