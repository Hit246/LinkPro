declare module 'qrcode' {
    interface QRCodeToDataURLOptions {
        errorCorrectionLevel?: string
        type?: string
        quality?: number
        margin?: number
        width?: number
    }

    const toDataURL: (text: string, options?: QRCodeToDataURLOptions) => Promise<string>
}
