export function generateUPILink({
    upiId,
    name,
    note,
}: {
    upiId: string
    name: string
    note?: string
}): string {
    const params = new URLSearchParams({
        pa: upiId,
        pn: name,
        cu: 'INR',
        tn: note || 'Support',
    })
    return `upi://pay?${params.toString()}`
}
