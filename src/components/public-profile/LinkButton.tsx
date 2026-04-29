import {
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaLinkedin,
    FaLink,
} from 'react-icons/fa'

interface LinkButtonProps {
    title: string
    url: string
    icon?: string
}

const ICON_MAP: Record<string, any> = {
    instagram: FaInstagram,
    youtube: FaYoutube,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    custom: FaLink,
}

export function LinkButton({ title, url, icon }: LinkButtonProps) {
    const Icon = ICON_MAP[icon || 'custom'] || FaLink

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-50"
        >
            {/* LEFT: ICON + TEXT */}
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                    <Icon size={16} />
                </div>

                <span className="font-medium text-gray-900">
                    {title}
                </span>
            </div>

            {/* RIGHT: ARROW */}
            <span className="text-gray-400 group-hover:text-gray-600 transition">
                →
            </span>
        </a>
    )
}