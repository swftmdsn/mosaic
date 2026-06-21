export const MOSAIC_FILE_EXTENSION = '.mosaic'

export function getMosaicFileName(fileName: string): string {
  return `${getDisplayFileName(fileName)}${MOSAIC_FILE_EXTENSION}`
}

export function getReadableMarkdownFileName(fileName: string): string {
  return `${getDisplayFileName(fileName)}.md`
}

export function getJsonFileName(fileName: string): string {
  return `${getDisplayFileName(fileName)}.json`
}

export function isMosaicFileName(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(MOSAIC_FILE_EXTENSION)
}

export function isMarkdownFileName(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.md')
}

export function isJsonFileName(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.json')
}

export function getDisplayFileName(fileName: string): string {
  const withoutKnownExtension = fileName
    .replace(/\.mosaic$/iu, '')
    .replace(/\.json$/iu, '')
    .replace(/\.md$/iu, '')

  return withoutKnownExtension || 'untitled'
}

export function renameFileNamePreservingExtension(_previousName: string, nextLabel: string): string {
  const cleanLabel = getDisplayFileName(nextLabel.trim()) || 'untitled'

  return getMosaicFileName(cleanLabel)
}
