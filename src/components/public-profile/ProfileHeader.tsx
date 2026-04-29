import { User } from 'lucide-react'

interface ProfileHeaderProps {
    avatar?: string
    displayName: string
    bio: string
}

export function ProfileHeader({ avatar, displayName, bio }: ProfileHeaderProps) {
    return (
        <div className="relative text-center">

            {/* subtle background glow */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-50 to-transparent blur-2xl opacity-60" />

            <div className="relative flex flex-col items-center">

                {/* AVATAR */}
                <div className="relative mb-4">
                    <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[3px] shadow-lg">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-white overflow-hidden">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={displayName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-10 w-10 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* NAME */}
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {displayName}
                </h1>

                {/* BIO */}
                {bio && (
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-600">
                        {bio}
                    </p>
                )}
            </div>
        </div>
    )
}