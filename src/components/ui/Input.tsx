export function Input({
    className = '',
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
        />
    )
}
