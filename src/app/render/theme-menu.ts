import { APP_THEMES } from '../constants'
import { getAppTheme } from '../theme'
import type { AppTheme, ThemeMode } from '../types'
import { escapeAttribute, escapeHtml } from '../utils/html'

export function renderThemeSelector(theme: ThemeMode, themeMenuOpen: boolean): string {
  const activeTheme = getAppTheme(theme)

  return `
    <div class="menu-anchor theme-anchor${themeMenuOpen ? ' open' : ''}">
      <button
        class="icon-button theme-trigger"
        data-action="toggle-theme-menu"
        type="button"
        aria-label="Themes"
        aria-expanded="${String(themeMenuOpen)}"
      >
        <span class="theme-trigger-swatch" style="${getThemeSwatchStyle(activeTheme)}" aria-hidden="true"></span>
        <span class="tooltip-label">Theme: ${escapeHtml(activeTheme.label)}</span>
      </button>
      ${themeMenuOpen ? renderThemeMenu(theme) : ''}
    </div>
  `
}

export function renderThemeMenu(activeThemeId: ThemeMode): string {
  return `
    <div class="popup-menu theme-menu" role="menu" aria-label="Themes">
      <div class="popup-title">Themes</div>
      <div class="theme-grid">
        ${APP_THEMES.map((theme) => renderThemeOption(theme, activeThemeId)).join('')}
      </div>
    </div>
  `
}

export function renderThemeOption(theme: AppTheme, activeThemeId: ThemeMode): string {
  const active = theme.id === activeThemeId

  return `
    <button
      class="theme-option${active ? ' active' : ''}"
      data-action="set-theme"
      data-theme-id="${theme.id}"
      type="button"
      role="menuitemradio"
      aria-checked="${String(active)}"
      aria-label="${escapeAttribute(theme.label)}"
      title="${escapeAttribute(theme.label)}"
    >
      <span class="theme-swatch" style="${getThemeSwatchStyle(theme)}" aria-hidden="true"></span>
      <span class="theme-label">${escapeHtml(theme.label)}</span>
    </button>
  `
}

export function getThemeSwatchStyle(theme: AppTheme): string {
  return `--theme-swatch-color: ${theme.color}; --theme-swatch-stroke: ${theme.stroke};`
}
