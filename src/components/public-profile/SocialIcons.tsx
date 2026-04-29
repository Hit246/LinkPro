interface SocialLink {
    platform: 'instagram' | 'youtube' | 'twitter' | 'linkedin'
    url: string
}

interface SocialIconsProps {
    links: SocialLink[]
}

import {
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaLinkedin,
} from 'react-icons/fa'

const ICON_MAP = {
    instagram: FaInstagram,
    youtube: FaYoutube,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
}

export function SocialIcons({ links }: SocialIconsProps) {
    if (!links || links.length === 0) return null

    return (
        <div className="flex justify-center gap-4">

            {links.map((link, i) => {
                const Icon = ICON_MAP[link.platform]

                return (
                    <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-full bg-gray-100 p-3 text-gray-600 transition hover:-translate-y-1 hover:bg-gray-900 hover:text-white"
                    >
                        <Icon size={18} />
                    </a>
                )
            })}

        </div>
    )
}