// Global type augmentations for Node.js APIs
declare namespace NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined
        NODE_ENV: 'development' | 'production' | 'test'
        DATABASE_URL?: string
        NEXTAUTH_SECRET?: string
        NEXTAUTH_URL?: string
        CLOUDINARY_CLOUD_NAME?: string
        CLOUDINARY_API_KEY?: string
        CLOUDINARY_API_SECRET?: string
        NEXT_PUBLIC_APP_URL?: string
    }

    interface Process {
        env: ProcessEnv
    }

    interface Global {
        prisma?: any
    }
}

declare const process: NodeJS.Process
declare const global: NodeJS.Global & typeof globalThis

declare function require(module: string): any

declare class Buffer {
    static from(arrayBuffer: ArrayBuffer | ArrayBufferLike | string, encoding?: string): any
}

declare const Buffer: any
