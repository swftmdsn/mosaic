export const IMAGE_FILE_ACCEPT = "image/*,.jpg,.jpeg,.png,.gif,.webp,.svg,.avif,.heic,.heif,.tif,.tiff,.bmp,.ico"

const IMAGE_FILE_EXTENSION_PATTERN = /\.(?:jpe?g|png|gif|webp|svg|avif|heic|heif|tiff?|bmp|ico)$/iu

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(normalizeImageDataUrlMime(String(reader.result), file))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function normalizeImageDataUrlMime(dataUrl: string, file: File): string {
  const mimeType = getImageMimeTypeForFile(file)

  if (!mimeType || dataUrl.startsWith(`data:${mimeType}`)) {
    return dataUrl
  }

  if (/^data:(?:application\/octet-stream)?([;,])/iu.test(dataUrl) || /^data:([;,])/u.test(dataUrl)) {
    return dataUrl.replace(/^data:[^;,]*/u, `data:${mimeType}`)
  }

  return dataUrl
}

export function isSupportedImageFile(file: File): boolean {
  return file.type.startsWith('image/') || IMAGE_FILE_EXTENSION_PATTERN.test(file.name)
}

export function isImageTransferItem(item: DataTransferItem): boolean {
  if (item.kind !== 'file') {
    return false
  }

  if (item.type.startsWith('image/')) {
    return true
  }

  const file = item.getAsFile()

  return file ? isSupportedImageFile(file) : false
}

export function getImageMimeTypeForFile(file: File): string {
  return file.type.startsWith('image/') ? file.type : getImageMimeTypeFromFileName(file.name)
}

export function getImageMimeTypeFromFileName(fileName: string): string {
  const extension = fileName.match(/\.([a-z0-9]+)$/iu)?.[1]?.toLowerCase() ?? ''

  if (extension === 'jpg' || extension === 'jpeg') {
    return 'image/jpeg'
  }

  if (extension === 'png') {
    return 'image/png'
  }

  if (extension === 'gif') {
    return 'image/gif'
  }

  if (extension === 'webp') {
    return 'image/webp'
  }

  if (extension === 'svg') {
    return 'image/svg+xml'
  }

  if (extension === 'avif') {
    return 'image/avif'
  }

  if (extension === 'heic') {
    return 'image/heic'
  }

  if (extension === 'heif') {
    return 'image/heif'
  }

  if (extension === 'tif' || extension === 'tiff') {
    return 'image/tiff'
  }

  if (extension === 'bmp') {
    return 'image/bmp'
  }

  if (extension === 'ico') {
    return 'image/x-icon'
  }

  return ''
}

export function getImageExtension(mimeType: string): string {
  const normalized = mimeType.toLowerCase()

  if (normalized === 'image/jpeg' || normalized === 'image/jpg') {
    return 'jpg'
  }

  if (normalized === 'image/png') {
    return 'png'
  }

  if (normalized === 'image/gif') {
    return 'gif'
  }

  if (normalized === 'image/webp') {
    return 'webp'
  }

  if (normalized === 'image/svg+xml') {
    return 'svg'
  }

  if (normalized === 'image/avif') {
    return 'avif'
  }

  if (normalized === 'image/heic') {
    return 'heic'
  }

  if (normalized === 'image/heif') {
    return 'heif'
  }

  if (normalized === 'image/tiff') {
    return 'tiff'
  }

  if (normalized === 'image/bmp') {
    return 'bmp'
  }

  if (normalized === 'image/x-icon' || normalized === 'image/vnd.microsoft.icon') {
    return 'ico'
  }

  return normalized.startsWith('image/') ? normalized.replace(/^image\//u, '').replace(/[^a-z0-9]+/gu, '') : ''
}

export function getImageMimeType(path: string): string {
  const extension = path.match(/\.([a-z0-9]+)$/iu)?.[1]?.toLowerCase()

  if (extension === 'jpg' || extension === 'jpeg') {
    return 'image/jpeg'
  }

  if (extension === 'gif') {
    return 'image/gif'
  }

  if (extension === 'webp') {
    return 'image/webp'
  }

  if (extension === 'svg') {
    return 'image/svg+xml'
  }

  if (extension === 'avif') {
    return 'image/avif'
  }

  if (extension === 'heic') {
    return 'image/heic'
  }

  if (extension === 'heif') {
    return 'image/heif'
  }

  if (extension === 'tif' || extension === 'tiff') {
    return 'image/tiff'
  }

  if (extension === 'bmp') {
    return 'image/bmp'
  }

  if (extension === 'ico') {
    return 'image/x-icon'
  }

  return 'image/png'
}
