import { type CanvasLinkItem } from '../../core/mindmap'
import { cssEscape, normalizeLinkUrl } from './html'
import { splitTrailingUrlPunctuation } from './markdown'

export async function createCanvasLinkPreview(url: string): Promise<Partial<CanvasLinkItem>> {
  const knownPreview = createKnownCanvasLinkPreview(url)

  if (knownPreview) {
    return knownPreview
  }

  const fetchedPreview = await fetchCanvasLinkPreview(url)

  return fetchedPreview ?? createBookmarkCanvasLinkPreview(url)
}

export function createKnownCanvasLinkPreview(url: string): Partial<CanvasLinkItem> | null {
  const youtubeId = getYouTubeVideoId(url)

  if (!youtubeId) {
    return null
  }

  return {
    title: 'YouTube video',
    description: url,
    provider: 'YouTube',
    image: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    favicon: 'https://www.youtube.com/favicon.ico',
    previewKind: 'video',
  }
}

export async function fetchCanvasLinkPreview(url: string): Promise<Partial<CanvasLinkItem> | null> {
  if (typeof DOMParser === 'undefined') {
    return null
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 1200)

  try {
    const response = await fetch(url, {
      credentials: 'omit',
      signal: controller.signal,
    })

    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
      return null
    }

    const source = await response.text()
    const documentPreview = new DOMParser().parseFromString(source, 'text/html')
    const host = formatCanvasLinkHost(url)
    const title =
      getMetaContent(documentPreview, 'property', 'og:title')
      || getMetaContent(documentPreview, 'name', 'twitter:title')
      || documentPreview.querySelector('title')?.textContent?.trim()
      || host
    const description =
      getMetaContent(documentPreview, 'property', 'og:description')
      || getMetaContent(documentPreview, 'name', 'description')
      || getMetaContent(documentPreview, 'name', 'twitter:description')
      || url
    const image =
      getAbsolutePreviewUrl(
        getMetaContent(documentPreview, 'property', 'og:image')
          || getMetaContent(documentPreview, 'name', 'twitter:image'),
        url,
      )
    const favicon =
      getAbsolutePreviewUrl(
        documentPreview.querySelector<HTMLLinkElement>('link[rel~="icon"], link[rel="shortcut icon"]')?.href,
        url,
      )
      || getFallbackFaviconUrl(url)
    const provider = getMetaContent(documentPreview, 'property', 'og:site_name') || host

    return {
      title,
      description,
      provider,
      image,
      favicon,
      previewKind: image ? 'article' : 'bookmark',
    }
  } catch {
    return null
  } finally {
    window.clearTimeout(timeout)
  }
}

export function createBookmarkCanvasLinkPreview(url: string): Partial<CanvasLinkItem> {
  const host = formatCanvasLinkHost(url)

  return {
    title: host || url,
    description: url,
    provider: host || 'Link',
    favicon: getFallbackFaviconUrl(url),
    previewKind: 'bookmark',
  }
}

export function getYouTubeVideoId(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.replace(/^www\./iu, '')

    if (host === 'youtu.be') {
      return normalizeYouTubeId(url.pathname.slice(1))
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (url.pathname === '/watch') {
        return normalizeYouTubeId(url.searchParams.get('v') ?? '')
      }

      const pathMatch = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/iu)

      if (pathMatch) {
        return normalizeYouTubeId(pathMatch[1])
      }
    }
  } catch {
    return null
  }

  return null
}

export function normalizeYouTubeId(value: string): string | null {
  const id = value.trim()

  return /^[A-Za-z0-9_-]{6,32}$/u.test(id) ? id : null
}

export function getMetaContent(documentPreview: Document, attribute: 'name' | 'property', value: string): string {
  return documentPreview
    .querySelector<HTMLMetaElement>(`meta[${attribute}="${cssEscape(value)}"]`)
    ?.content
    ?.trim() ?? ''
}

export function getAbsolutePreviewUrl(value: string | undefined, baseUrl: string): string {
  if (!value) {
    return ''
  }

  try {
    return new URL(value, baseUrl).href
  } catch {
    return ''
  }
}

export function getFallbackFaviconUrl(rawUrl: string): string {
  try {
    return new URL('/favicon.ico', rawUrl).href
  } catch {
    return ''
  }
}

export function getDroppedLinkUrl(dataTransfer: DataTransfer | null): string | null {
  if (!dataTransfer) {
    return null
  }

  return extractFirstLinkUrl(dataTransfer.getData('text/uri-list')) ?? extractFirstLinkUrl(dataTransfer.getData('text/plain'))
}

export function extractFirstLinkUrl(source: string): string | null {
  for (const line of source.split('\n')) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const url = normalizeLinkUrl(trimmed)

    if (url) {
      return url
    }
  }

  const match = source.match(/(?:https?:\/\/|www\.)[^\s<>"']+/iu)

  return match ? normalizeLinkUrl(splitTrailingUrlPunctuation(match[0]).url) : null
}

export function formatCanvasLinkHost(rawUrl: string): string {
  try {
    const parsed = new URL(normalizeLinkUrl(rawUrl) ?? rawUrl)

    return parsed.hostname.replace(/^www\./iu, '') || parsed.href
  } catch {
    return rawUrl
  }
}
