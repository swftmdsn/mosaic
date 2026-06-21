import { STARTER_DISMISSED_STORAGE_KEY, TRACKPAD_SPEED_DEFAULT, TRACKPAD_SPEED_MAX, TRACKPAD_SPEED_MIN } from './constants'
import type { ExportFormat, FrontmatterMode, ImagePlacement, SettingsTab } from './types'

export function loadOutlineWidth(): number {
  const stored = Number(localStorage.getItem('mosaic-outline-width'))

  return Number.isFinite(stored) && stored >= 680 && stored <= 1180 ? stored : 900
}

export function loadDefaultImageWidth(): number {
  const stored = Number(localStorage.getItem('mosaic-default-image-width'))

  return Number.isFinite(stored) && stored >= 640 && stored <= 3840 ? Math.round(stored) : 1080
}

export function loadImagePlacement(): ImagePlacement {
  const stored = localStorage.getItem('mosaic-image-placement')

  return stored === 'below' ? 'below' : 'inline'
}

export function loadStarterDismissed(): boolean {
  return localStorage.getItem(STARTER_DISMISSED_STORAGE_KEY) === 'true'
}

export function loadTrackpadSpeed(): number {
  const stored = Number(localStorage.getItem('mosaic-trackpad-speed'))
  const version = localStorage.getItem('mosaic-trackpad-speed-version')

  if (!Number.isFinite(stored)) {
    return TRACKPAD_SPEED_DEFAULT
  }

  if (version !== '2' && stored >= 1.8 && stored <= 3.6) {
    return convertLegacyTrackpadSpeed(stored)
  }

  return stored >= TRACKPAD_SPEED_MIN && stored <= TRACKPAD_SPEED_MAX ? stored : TRACKPAD_SPEED_DEFAULT
}

export function convertLegacyTrackpadSpeed(value: number): number {
  const legacyDefault = 3.06

  if (value <= legacyDefault) {
    const ratio = (value - 1.8) / (legacyDefault - 1.8)
    return Math.round((0.5 + Math.max(0, ratio) * 0.5) * 100) / 100
  }

  const ratio = (value - legacyDefault) / (3.6 - legacyDefault)
  return Math.round((1 + Math.min(1, ratio) * 1) * 100) / 100
}

export function isImagePlacement(value: unknown): value is ImagePlacement {
  return value === 'inline' || value === 'below'
}

export function snapToMarks(value: number, marks: number[], threshold: number): number {
  const nearest = marks.reduce((closest, mark) => {
    return Math.abs(mark - value) < Math.abs(closest - value) ? mark : closest
  }, marks[0] ?? value)

  return Math.abs(nearest - value) <= threshold ? nearest : value
}

export function isSettingsTab(value: string | undefined): value is SettingsTab {
  return value === 'view' || value === 'export' || value === 'shortcuts'
}

export function isFrontmatterMode(value: string | undefined): value is FrontmatterMode {
  return value === 'preview' || value === 'yaml'
}

export function loadDefaultExportFormat(): ExportFormat {
  const stored = localStorage.getItem('mosaic-default-export-format')

  return isExportFormat(stored) ? stored : 'mosaic'
}

export function isExportFormat(value: unknown): value is ExportFormat {
  return value === 'mosaic'
}

export function loadAutoSaveSeconds(): number {
  const stored = Number(localStorage.getItem('mosaic-autosave-seconds'))

  return Number.isFinite(stored) && stored >= 0 ? Math.round(stored) : 30
}

export function loadCommandToastEnabled(): boolean {
  return localStorage.getItem('mosaic-command-toast-enabled') !== 'false'
}
