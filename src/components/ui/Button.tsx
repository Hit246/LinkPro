export function Button({
    children,
    className = '',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
