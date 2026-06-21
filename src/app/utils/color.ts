export type RgbColor = {
  r: number
  g: number
  b: number
}

export type HslColor = {
  h: number
  s: number
  l: number
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function normalizeHexColor(value: string): string {
  const trimmed = value.trim()

  if (/^#[0-9a-f]{6}$/iu.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  if (/^[0-9a-f]{6}$/iu.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`
  }

  if (/^#[0-9a-f]{3}$/iu.test(trimmed)) {
    return `#${trimmed
      .slice(1)
      .split('')
      .map((character) => `${character}${character}`)
      .join('')
      .toLowerCase()}`
  }

  return '#6b7280'
}

export function parseHexColor(value: string): RgbColor {
  const normalized = normalizeHexColor(value)

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  }
}

export function rgbToHex(color: RgbColor): string {
  return `#${[color.r, color.g, color.b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`
}

export function mixRgb(from: RgbColor, to: RgbColor, weight: number): RgbColor {
  const normalizedWeight = clampNumber(weight, 0, 1)

  return {
    r: from.r + (to.r - from.r) * normalizedWeight,
    g: from.g + (to.g - from.g) * normalizedWeight,
    b: from.b + (to.b - from.b) * normalizedWeight,
  }
}

export function rgbToHsl(color: RgbColor): HslColor {
  const red = color.r / 255
  const green = color.g / 255
  const blue = color.b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const lightness = (max + min) / 2

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness }
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue = 0

  if (max === red) {
    hue = ((green - blue) / delta) % 6
  } else if (max === green) {
    hue = (blue - red) / delta + 2
  } else {
    hue = (red - green) / delta + 4
  }

  return {
    h: hue * 60 < 0 ? hue * 60 + 360 : hue * 60,
    s: saturation,
    l: lightness,
  }
}

export function hslToRgb(color: HslColor): RgbColor {
  const chroma = (1 - Math.abs(2 * color.l - 1)) * color.s
  const hue = color.h / 60
  const x = chroma * (1 - Math.abs((hue % 2) - 1))
  const match = color.l - chroma / 2
  let red = 0
  let green = 0
  let blue = 0

  if (hue >= 0 && hue < 1) {
    red = chroma
    green = x
  } else if (hue >= 1 && hue < 2) {
    red = x
    green = chroma
  } else if (hue >= 2 && hue < 3) {
    green = chroma
    blue = x
  } else if (hue >= 3 && hue < 4) {
    green = x
    blue = chroma
  } else if (hue >= 4 && hue < 5) {
    red = x
    blue = chroma
  } else {
    red = chroma
    blue = x
  }

  return {
    r: (red + match) * 255,
    g: (green + match) * 255,
    b: (blue + match) * 255,
  }
}

export function getContrastRatio(foreground: RgbColor, background: RgbColor): number {
  const foregroundLuminance = getRelativeLuminance(foreground)
  const backgroundLuminance = getRelativeLuminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

export function getRelativeLuminance(color: RgbColor): number {
  const [red, green, blue] = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255

    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function isHexColorInput(value: string): boolean {
  const trimmed = value.trim()

  return /^#?[0-9a-f]{6}$/iu.test(trimmed) || /^#[0-9a-f]{3}$/iu.test(trimmed)
}
