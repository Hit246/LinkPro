export function detectDevice(userAgent: string): 'mobile' | 'desktop' {
    const mobileRegex = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i
    return mobileRegex.test(userAgent) ? 'mobile' : 'desktop'
}
