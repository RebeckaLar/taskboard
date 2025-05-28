export const shade = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16)

    const r = Math.min(255, Math.max(0,
        ((num >> 16) + percent).toFixed(0))) //percent: how much the rgb colours should change

    const g = Math.min(255, Math.max(0,
        ((num >> 8 & 0x00FF) + percent).toFixed(0)))

    const b = Math.min(255, Math.max(0,
        ((num & 0x0000FF) + percent).toFixed(0)))

    const toHex = (v) => v.toString(16).padStart(2, "0")
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export const getReadableTextColor = (hex) => {
    if(!hex) return undefined //fallback. Let Tailwind handle it


    // remove "#" och convert to r, g, b [0-1]
    const c = hex.replace("#", "")
    const r = parseInt(c.slice(0, 2), 16) / 255
    const g = parseInt(c.slice(2, 4), 16) / 255
    const b = parseInt(c.slice(4, 6), 16) / 255

    // relative luminance according to WCAG
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

    // threshold = 0.55 usually good contrast
    return lum > 0.55 ? "#000000" : "#ffffff"
}