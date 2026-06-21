export type ZipEntry = {
  path: string
  data: Uint8Array
}

const CRC32_TABLE = createCrc32Table()

export function readZipEntries(bytes: Uint8Array): Map<string, Uint8Array> {
  const entries = new Map<string, Uint8Array>()
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 0

  while (offset + 4 <= bytes.length && view.getUint32(offset, true) === 0x04034b50) {
    if (offset + 30 > bytes.length) {
      throw new Error('Invalid .mosaic file: truncated ZIP entry')
    }

    const flags = view.getUint16(offset + 6, true)
    const method = view.getUint16(offset + 8, true)
    const compressedSize = view.getUint32(offset + 18, true)
    const nameLength = view.getUint16(offset + 26, true)
    const extraLength = view.getUint16(offset + 28, true)
    const nameStart = offset + 30
    const dataStart = nameStart + nameLength + extraLength
    const dataEnd = dataStart + compressedSize

    if (method !== 0) {
      throw new Error('Invalid .mosaic file: compressed ZIP entries are not supported')
    }

    if (flags & 0x0008) {
      throw new Error('Invalid .mosaic file: ZIP data descriptors are not supported')
    }

    if (dataEnd > bytes.length) {
      throw new Error('Invalid .mosaic file: truncated ZIP data')
    }

    const path = normalizeZipPath(decodeText(bytes.slice(nameStart, nameStart + nameLength)))
    entries.set(path, bytes.slice(dataStart, dataEnd))
    offset = dataEnd
  }

  if (entries.size === 0) {
    throw new Error('Invalid .mosaic file')
  }

  return entries
}

export function createZipBlob(entries: ZipEntry[]): Blob {
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const nameBytes = encodeText(entry.path)
    const crc = crc32(entry.data)
    const localHeader = createZipLocalHeader(nameBytes, entry.data.length, crc)
    const centralHeader = createZipCentralHeader(nameBytes, entry.data.length, crc, offset)

    localParts.push(localHeader, entry.data)
    centralParts.push(centralHeader)
    offset += localHeader.length + entry.data.length
  }

  const centralDirectory = concatBytes(centralParts)
  const endRecord = createZipEndRecord(entries.length, centralDirectory.length, offset)

  const zipBytes = concatBytes([...localParts, centralDirectory, endRecord])
  const zipBuffer = new ArrayBuffer(zipBytes.byteLength)
  new Uint8Array(zipBuffer).set(zipBytes)

  return new Blob([zipBuffer], { type: 'application/zip' })
}

export function createZipLocalHeader(nameBytes: Uint8Array, size: number, crc: number): Uint8Array {
  const header = new Uint8Array(30 + nameBytes.length)
  const view = new DataView(header.buffer)

  view.setUint32(0, 0x04034b50, true)
  view.setUint16(4, 20, true)
  view.setUint16(6, 0x0800, true)
  view.setUint16(8, 0, true)
  view.setUint16(10, 0, true)
  view.setUint16(12, 0, true)
  view.setUint32(14, crc, true)
  view.setUint32(18, size, true)
  view.setUint32(22, size, true)
  view.setUint16(26, nameBytes.length, true)
  view.setUint16(28, 0, true)
  header.set(nameBytes, 30)

  return header
}

export function createZipCentralHeader(nameBytes: Uint8Array, size: number, crc: number, offset: number): Uint8Array {
  const header = new Uint8Array(46 + nameBytes.length)
  const view = new DataView(header.buffer)

  view.setUint32(0, 0x02014b50, true)
  view.setUint16(4, 20, true)
  view.setUint16(6, 20, true)
  view.setUint16(8, 0x0800, true)
  view.setUint16(10, 0, true)
  view.setUint16(12, 0, true)
  view.setUint16(14, 0, true)
  view.setUint32(16, crc, true)
  view.setUint32(20, size, true)
  view.setUint32(24, size, true)
  view.setUint16(28, nameBytes.length, true)
  view.setUint16(30, 0, true)
  view.setUint16(32, 0, true)
  view.setUint16(34, 0, true)
  view.setUint16(36, 0, true)
  view.setUint32(38, 0, true)
  view.setUint32(42, offset, true)
  header.set(nameBytes, 46)

  return header
}

export function createZipEndRecord(entryCount: number, centralSize: number, centralOffset: number): Uint8Array {
  const record = new Uint8Array(22)
  const view = new DataView(record.buffer)

  view.setUint32(0, 0x06054b50, true)
  view.setUint16(4, 0, true)
  view.setUint16(6, 0, true)
  view.setUint16(8, entryCount, true)
  view.setUint16(10, entryCount, true)
  view.setUint32(12, centralSize, true)
  view.setUint32(16, centralOffset, true)
  view.setUint16(20, 0, true)

  return record
}

export function concatBytes(parts: Uint8Array[]): Uint8Array {
  const totalLength = parts.reduce((total, part) => total + part.length, 0)
  const output = new Uint8Array(totalLength)
  let offset = 0

  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }

  return output
}

export function encodeText(value: string): Uint8Array {
  return new TextEncoder().encode(value)
}

export function decodeText(value: Uint8Array): string {
  return new TextDecoder().decode(value)
}

export function normalizeZipPath(path: string): string {
  return path
    .replace(/\\/g, '/')
    .replace(/^\.\//u, '')
    .replace(/^\/+/u, '')
}

export function encodeBase64(value: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000

  for (let index = 0; index < value.length; index += chunkSize) {
    const chunk = value.slice(index, index + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

export function createCrc32Table(): Uint32Array {
  const table = new Uint32Array(256)

  for (let index = 0; index < table.length; index += 1) {
    let value = index

    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    }

    table[index] = value >>> 0
  }

  return table
}

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff

  for (const byte of data) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xff]
  }

  return (crc ^ 0xffffffff) >>> 0
}
