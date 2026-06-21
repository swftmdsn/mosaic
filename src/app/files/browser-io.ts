import type { LocalFileHandle } from '../types'

export async function writeHandle(handle: LocalFileHandle, content: Blob): Promise<void> {
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

export async function copyToClipboard(markdown: string): Promise<void> {
  await navigator.clipboard.writeText(markdown)
}

export function downloadText(fileName: string, text: string, type: string): void {
  downloadBlob(fileName, new Blob([text], { type }))
}

export function downloadBlob(fileName: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
