export function normalizeLinkUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim()

  if (!trimmed || /[\u0000-\u001F\u007F\s]/.test(trimmed)) {
    return null
  }

  const candidate = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed

  try {
    const parsed = new URL(candidate)

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:' && parsed.protocol !== 'mailto:' && parsed.protocol !== 'tel:') {
      return null
    }

    return parsed.href
  } catch {
    return null
  }
}

export function formatLinkPromptLabel(label: string, url: string): string {
  const trimmedLabel = label.trim()

  if (trimmedLabel && trimmedLabel !== url) {
    return trimmedLabel
  }

  try {
    const parsed = new URL(url)

    return parsed.protocol === 'mailto:' || parsed.protocol === 'tel:' ? url : parsed.hostname
  } catch {
    return url
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/\n/g, '&#10;')
}

export function cssEscape(value: string): string {
  return CSS.escape(value)
}
