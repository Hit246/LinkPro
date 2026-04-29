'use client'

import Link from 'next/link'

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-white to-gray-100">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

                    {/* LOGO */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">
                            LP
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                            LinkPro
                        </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3">
                        <a href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Sign In
                        </a>
                        <a
                            href="/register"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </header>
            {/* HERO */}
            <section className="mx-auto max-w-7xl px-4 py-20 text-center">

                <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    LinkPro
                    <span className="block text-lg font-medium text-gray-500 mt-2">
                        Your link-in-bio, built for Indian creators
                    </span>
                </h1>

                <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                    Build your personal link page, share everything in one place,
                    and even accept UPI support — all in seconds.
                </p>

                <div className="mt-10 flex justify-center gap-4">
                    <Link
                        href="/register"
                        className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow hover:bg-blue-700 transition"
                    >
                        Get Started Free
                    </Link>

                    <Link
                        href="/login"
                        className="rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 hover:bg-gray-100 transition"
                    >
                        Sign In
                    </Link>
                </div>

                {/* MOCK PREVIEW */}
                <div className="mt-16 flex justify-center">
                    <div className="w-[260px] rounded-[28px] border-[6px] border-black bg-black shadow-2xl">
                        <div className="h-[480px] overflow-hidden rounded-[22px] bg-white p-4">

                            <div className="text-center space-y-4">
                                <div className="h-20 w-20 mx-auto rounded-full bg-gray-200" />
                                <p className="font-semibold">@yourname</p>
                                <p className="text-sm text-gray-500">
                                    Creator • Developer • Designer
                                </p>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="rounded-lg border p-3">YouTube</div>
                                <div className="rounded-lg border p-3">Instagram</div>
                                <div className="rounded-lg border p-3">Portfolio</div>
                                <div className="rounded-lg border-2 border-green-500 p-3 text-green-600">
                                    Support Me
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-6xl px-4">

                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Everything You Need
                    </h2>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">

                        <div className="rounded-xl border p-6 text-center">
                            <h3 className="font-semibold text-lg">Custom Links</h3>
                            <p className="mt-2 text-gray-600 text-sm">
                                Add unlimited links and organize them easily.
                            </p>
                        </div>

                        <div className="rounded-xl border p-6 text-center">
                            <h3 className="font-semibold text-lg">Analytics</h3>
                            <p className="mt-2 text-gray-600 text-sm">
                                Track clicks, views, and audience insights.
                            </p>
                        </div>

                        <div className="rounded-xl border p-6 text-center">
                            <h3 className="font-semibold text-lg">UPI Support</h3>
                            <p className="mt-2 text-gray-600 text-sm">
                                Let your audience support you directly via UPI.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    Start building your link page today
                </h2>

                <Link
                    href="/register"
                    className="mt-6 inline-block rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition"
                >
                    Create Your Page
                </Link>
            </section>

        </main>
    )
}