import { cloneDocument, parseMindmapJson, serializeMindmapJson, type MindmapDocument } from '../../core/mindmap'
import type { ExportAsset } from '../types'
import { getImageExtension, getImageMimeType } from '../utils/images'
import { isRecord } from '../utils/guards'
import { createZipBlob, decodeText, encodeBase64, encodeText, normalizeZipPath, readZipEntries } from '../utils/zip'

export function createMosaicPackageBlob(documentUpdate: MindmapDocument): Blob {
  const exportDocumentUpdate = buildDocumentWithExportedAssets(documentUpdate)

  return createZipBlob([
    {
      path: 'manifest.json',
      data: encodeText(
        `${JSON.stringify(
          {
            format: 'mosaic',
            version: 1,
            document: 'document.json',
            assets: `${getZipAssetsFolder(documentUpdate)}/`,
          },
          null,
          2,
        )}\n`,
      ),
    },
    {
      path: 'document.json',
      data: encodeText(serializeMindmapJson(exportDocumentUpdate.document)),
    },
    ...exportDocumentUpdate.assets.map((asset) => ({ path: asset.zipPath, data: asset.data })),
  ])
}

export async function parseMosaicFile(file: File): Promise<MindmapDocument> {
  const entries = readZipEntries(new Uint8Array(await file.arrayBuffer()))
  const manifestSource = entries.get('manifest.json')

  if (!manifestSource) {
    throw new Error('Invalid .mosaic file: missing manifest.json')
  }

  const manifest = JSON.parse(decodeText(manifestSource)) as unknown

  if (!isRecord(manifest) || manifest.format !== 'mosaic' || manifest.version !== 1) {
    throw new Error('Invalid .mosaic file: unsupported manifest')
  }

  const documentPath = typeof manifest.document === 'string' ? normalizeZipPath(manifest.document) : 'document.json'
  const documentSource = entries.get(documentPath)

  if (!documentSource) {
    throw new Error('Invalid .mosaic file: missing document.json')
  }

  return restoreMosaicAssets(parseMindmapJson(decodeText(documentSource)), entries)
}

export function restoreMosaicAssets(documentUpdate: MindmapDocument, entries: Map<string, Uint8Array>): MindmapDocument {
  const nextDocument = cloneDocument(documentUpdate)

  for (const node of Object.values(nextDocument.nodes)) {
    node.markdown = rewriteMarkdownImageSources(node.markdown, (_alt, src) => {
      if (src.startsWith('data:')) {
        return src
      }

      const assetPath = normalizeZipPath(src)
      const asset = entries.get(assetPath)

      if (!asset) {
        return src
      }

      return `data:${getImageMimeType(assetPath)};base64,${encodeBase64(asset)}`
    })
  }

  for (const item of nextDocument.canvasItems) {
    if (item.type !== 'image' || item.src.startsWith('data:')) {
      continue
    }

    const assetPath = normalizeZipPath(item.src)
    const asset = entries.get(assetPath)

    if (asset) {
      item.src = `data:${getImageMimeType(assetPath)};base64,${encodeBase64(asset)}`
    }
  }

  return nextDocument
}

export function buildDocumentWithExportedAssets(documentUpdate: MindmapDocument): { document: MindmapDocument; assets: ExportAsset[] } {
  const assets: ExportAsset[] = []
  const assetsBySrc = new Map<string, ExportAsset>()
  const usedPaths = new Set<string>()
  const nextDocument = cloneDocument(documentUpdate)

  const registerAsset = (name: string, src: string): string => {
    if (!src.startsWith('data:')) {
      return src
    }

    const existing = assetsBySrc.get(src)

    if (existing) {
      return existing.exportSrc
    }

    const imageData = parseDataUrlImage(src)

    if (!imageData) {
      return src
    }

    const folder = getZipAssetsFolder(documentUpdate)
    const baseName = sanitizeAssetBaseName(name || `image-${assets.length + 1}`)
    const zipPath = getUniqueAssetPath(folder, `${baseName}.${imageData.extension}`, usedPaths)
    const asset: ExportAsset = {
      originalSrc: src,
      exportSrc: `./${zipPath}`,
      zipPath,
      data: imageData.data,
    }

    assetsBySrc.set(src, asset)
    assets.push(asset)

    return asset.exportSrc
  }

  for (const node of Object.values(nextDocument.nodes)) {
    node.markdown = rewriteMarkdownImageSources(node.markdown, (alt, src) => {
      return registerAsset(alt || `image-${assets.length + 1}`, src)
    })
  }

  for (const item of nextDocument.canvasItems) {
    if (item.type === 'image') {
      item.src = registerAsset(item.alt || item.id, item.src)
    }
  }

  return { document: nextDocument, assets }
}

export function rewriteMarkdownImageSources(markdown: string, getNextSrc: (alt: string, src: string) => string): string {
  return markdown.replace(/!\[([^\]]*)]\(([^)]+)\)(\{width=\d+\})?/g, (match, alt: string, src: string, width: string = '') => {
    const nextSrc = getNextSrc(alt, src)

    if (nextSrc === src) {
      return match
    }

    return `![${alt}](${nextSrc})${width}`
  })
}

export function parseDataUrlImage(src: string): { data: Uint8Array; extension: string } | null {
  const match = /^data:([^;,]+)?((?:;[^,]*)?),(.*)$/u.exec(src)

  if (!match) {
    return null
  }

  const mimeType = match[1] || 'application/octet-stream'
  const metadata = match[2] ?? ''
  const payload = match[3] ?? ''
  const extension = getImageExtension(mimeType)

  if (!mimeType.startsWith('image/') || !extension) {
    return null
  }

  if (metadata.includes(';base64')) {
    const binary = atob(payload)
    const data = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
      data[index] = binary.charCodeAt(index)
    }

    return { data, extension }
  }

  return { data: encodeText(decodeURIComponent(payload)), extension }
}

export function getZipAssetsFolder(documentUpdate: MindmapDocument): string {
  const folder = (documentUpdate.assetsFolder || './assets')
    .replace(/\\/g, '/')
    .replace(/^\.\//u, '')
    .replace(/^\/+/u, '')
    .replace(/\/+$/u, '')

  return folder || 'assets'
}

export function sanitizeAssetBaseName(value: string): string {
  const clean = value
    .replace(/\.[a-z0-9]{1,6}$/iu, '')
    .replace(/[^a-z0-9_-]+/giu, '-')
    .replace(/^-+|-+$/gu, '')
    .toLowerCase()

  return clean || 'image'
}

export function getUniqueAssetPath(folder: string, fileName: string, usedPaths: Set<string>): string {
  const cleanName = fileName || 'image.png'
  const extensionMatch = cleanName.match(/(\.[a-z0-9]+)$/iu)
  const extension = extensionMatch?.[1] ?? ''
  const baseName = extension ? cleanName.slice(0, -extension.length) : cleanName
  let path = `${folder}/${baseName}${extension}`
  let index = 2

  while (usedPaths.has(path)) {
    path = `${folder}/${baseName}-${index}${extension}`
    index += 1
  }

  usedPaths.add(path)

  return path
}
