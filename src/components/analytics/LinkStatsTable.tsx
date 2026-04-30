interface LinkStat {
    linkId: string
    title: string
    url: string
    clicks: number
}

interface LinkStatsTableProps {
    data: LinkStat[]
}

export function LinkStatsTable({ data }: LinkStatsTableProps) {
    const totalClicks = data.reduce((sum, link) => sum + link.clicks, 0)

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Link Performance
            </h3>

            {data.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-sm text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left">Link</th>
                                <th className="px-4 py-3 text-left">Clicks</th>
                                <th className="px-4 py-3 text-left">Performance</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((link) => {
                                const percent =
                                    totalClicks > 0
                                        ? (link.clicks / totalClicks) * 100
                                        : 0

                                return (
                                    <tr
                                        key={link.linkId}
                                        className="group border-t transition hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-gray-900">
                                                {link.title}
                                            </p>
                                            <p className="truncate text-sm text-gray-500">
                                                {link.url}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4 font-semibold text-gray-900">
                                            {link.clicks}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-600">
                                                    {percent.toFixed(0)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">No links yet</p>
            )}
        </div>
    )
}