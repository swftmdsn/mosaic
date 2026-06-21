import { APP_THEMES } from './constants'
import type { NodeColor } from '../core/mindmap'
import type { AppTheme, ThemeMode, ThemeTone, ThemeTokens } from './types'

export function loadTheme(): ThemeMode {
  const stored = localStorage.getItem('mosaic-theme')

  if (isThemeMode(stored)) {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && APP_THEMES.some((theme) => theme.id === value)
}

export function getAppTheme(themeId: ThemeMode): AppTheme {
  return APP_THEMES.find((theme) => theme.id === themeId) ?? APP_THEMES[0]
}

export function getThemeTone(themeId: ThemeMode): ThemeTone {
  return getAppTheme(themeId).tone
}

export function getThemeTokens(themeId: ThemeMode): ThemeTokens {
  return getAppTheme(themeId).tokens
}

export function getThemeNodeColor(themeId: ThemeMode, color: NodeColor): string {
  return getThemeTokens(themeId).nodeColors[color]
}

export function isLightTheme(themeId: ThemeMode): boolean {
  return getThemeTone(themeId) === 'light'
}
