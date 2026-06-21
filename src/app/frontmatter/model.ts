import type { FilePropertyType } from '../../core/mindmap'
import { FILE_PROPERTY_TYPES } from '../constants'

export function getNormalizedFilePropertyValue(type: FilePropertyType, value: string): string {
  const trimmed = value.trim()

  if (type === 'boolean') {
    return trimmed === 'false' ? 'false' : 'true'
  }

  if (type === 'number') {
    return /^-?\d+(\.\d+)?$/u.test(trimmed) ? trimmed : '0'
  }

  if (type === 'date') {
    return /^\d{4}-\d{2}-\d{2}$/u.test(trimmed) ? trimmed : ''
  }

  if (type === 'list') {
    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .join(', ')
  }

  return value
}

export function slugifyFilePropertyKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isFilePropertyType(value: string | undefined): value is FilePropertyType {
  return FILE_PROPERTY_TYPES.some((candidate) => candidate.type === value)
}
