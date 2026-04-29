import { ReactNode } from 'react'
import Providers from '../Provider'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <>
        <Providers>{children}</Providers></>
}
