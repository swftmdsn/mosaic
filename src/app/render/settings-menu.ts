import { IMAGE_WIDTH_MARKS, OUTLINE_WIDTH_MARKS, SHORTCUT_DEFINITIONS, TRACKPAD_SPEED_MARKS, TRACKPAD_SPEED_MAX, TRACKPAD_SPEED_MIN } from '../constants'
import { formatSpeedValue, renderRangeTicks } from './range'
import { renderIcon } from './icons'
import { state } from '../state'
import type { IconName, SettingsTab, ShortcutDefinition, ShortcutGroup } from '../types'
import { formatShortcutLabel, getShortcutDefinition, getShortcutConflicts } from '../shortcuts'
import { escapeAttribute, escapeHtml } from '../utils/html'

export function renderSettingsMenu(): string {
  return `
    <div class="popup-menu settings-menu" role="dialog" aria-label="Settings">
      ${renderSettingsTabs()}
      ${state.settingsTab === 'view' ? renderViewSettings() : ''}
      ${state.settingsTab === 'export' ? renderExportSettings() : ''}
      ${state.settingsTab === 'shortcuts' ? renderShortcutSettings() : ''}
    </div>
  `
}

function renderSettingsTabs(): string {
  return `
    <div class="settings-tabs" role="tablist" aria-label="Settings sections">
      ${renderSettingsTabButton('view', 'View', 'list')}
      ${renderSettingsTabButton('export', 'Files', 'download')}
      ${renderSettingsTabButton('shortcuts', 'Shortcuts', 'keyboard')}
    </div>
  `
}

function renderSettingsTabButton(tab: SettingsTab, label: string, icon: IconName): string {
  const active = state.settingsTab === tab

  return `
    <button
      class="settings-tab${active ? ' active' : ''}"
      data-action="settings-tab"
      data-settings-tab="${tab}"
      type="button"
      role="tab"
      aria-selected="${String(active)}"
      aria-label="${escapeAttribute(label)}"
    >
      ${renderIcon(icon)}
      <span>${escapeHtml(label)}</span>
    </button>
  `
}

function renderViewSettings(): string {
  return `
    <div class="settings-panel" role="tabpanel">
      <button class="settings-action" data-action="load-sample-mosaic" type="button">
        ${renderIcon('map')}
        <span>Load sample .mosaic</span>
      </button>
      <label class="settings-toggle" for="command-toast-toggle">
        <span>Command popups</span>
        <input
          id="command-toast-toggle"
          type="checkbox"
          ${state.commandToastEnabled ? 'checked' : ''}
          aria-label="Show command popups"
        />
      </label>
      <label class="settings-field" for="outline-width-input">
        <span>Outline width</span>
        <output data-output-for="outline-width-input">${state.outlineWidth}px</output>
      </label>
      <div class="range-control">
        <input
          id="outline-width-input"
          type="range"
          min="680"
          max="1180"
          step="10"
          value="${state.outlineWidth}"
          aria-label="Outline width"
        />
        ${renderRangeTicks('set-outline-width', OUTLINE_WIDTH_MARKS, 680, 1180)}
      </div>
      <label class="settings-field" for="image-width-input">
        <span>Default image width</span>
        <output data-output-for="image-width-input">${state.defaultImageWidth}px</output>
      </label>
      <div class="range-control">
        <input
          id="image-width-input"
          type="range"
          min="640"
          max="3840"
          step="20"
          value="${state.defaultImageWidth}"
          aria-label="Default image width"
        />
        ${renderRangeTicks('set-image-width', IMAGE_WIDTH_MARKS, 640, 3840)}
      </div>
      <label class="settings-field" for="image-placement">
        <span>Image placement</span>
      </label>
      <select id="image-placement" aria-label="Image placement">
        <option value="inline"${state.imagePlacement === 'inline' ? ' selected' : ''}>Right of line</option>
        <option value="below"${state.imagePlacement === 'below' ? ' selected' : ''}>Below line</option>
      </select>
      <label class="settings-field" for="trackpad-speed-input">
        <span>Trackpad speed</span>
        <output data-output-for="trackpad-speed-input">${formatSpeedValue(state.trackpadSpeed)}</output>
      </label>
      <div class="range-control">
        <input
          id="trackpad-speed-input"
          type="range"
          min="${TRACKPAD_SPEED_MIN}"
          max="${TRACKPAD_SPEED_MAX}"
          step="0.05"
          value="${state.trackpadSpeed}"
          aria-label="Trackpad speed"
        />
        ${renderRangeTicks('set-trackpad-speed', TRACKPAD_SPEED_MARKS, TRACKPAD_SPEED_MIN, TRACKPAD_SPEED_MAX)}
      </div>
    </div>
  `
}

function renderExportSettings(): string {
  return `
    <div class="settings-panel" role="tabpanel">
      <label class="settings-field" for="autosave-seconds">
        <span>Autosave frequency (seconds)</span>
      </label>
      <div class="number-control">
        <input
          id="autosave-seconds"
          type="number"
          min="0"
          step="1"
          value="${state.autoSaveSeconds}"
          aria-label="Autosave frequency in seconds"
        />
        <div class="number-steppers">
          <button data-action="step-autosave" data-step="1" type="button" tabindex="-1" aria-label="Increase autosave frequency">
            <span class="mini-chevron up" aria-hidden="true"></span>
          </button>
          <button data-action="step-autosave" data-step="-1" type="button" tabindex="-1" aria-label="Decrease autosave frequency">
            <span class="mini-chevron down" aria-hidden="true"></span>
          </button>
        </div>
      </div>
      <div class="settings-file-actions" aria-label="Settings JSON">
        <button class="settings-subtle-action" data-action="export-settings" type="button">
          <span>Export settings JSON</span>
        </button>
        <button class="settings-subtle-action" data-action="import-settings" type="button">
          <span>Import settings JSON</span>
        </button>
      </div>
    </div>
  `
}

function renderShortcutSettings(): string {
  const conflicts = getShortcutConflicts(state.shortcuts)
  const conflictMessages = conflicts.map(([combo, ids]) => {
    const labels = ids.map((id) => getShortcutDefinition(id).label).join(' / ')

    return `${formatShortcutLabel(combo)}: ${labels}`
  })

  return `
    <div class="settings-panel shortcut-panel" role="tabpanel">
      <div class="shortcut-actions">
        <button class="settings-action" data-action="reset-shortcuts" type="button">
          <span>Reset defaults</span>
        </button>
      </div>
      ${
        state.shortcutConflictMessage
          ? `<p class="shortcut-warning">${escapeHtml(state.shortcutConflictMessage)}</p>`
          : ''
      }
      ${
        conflictMessages.length > 0
          ? `<p class="shortcut-warning">Conflict detected: ${escapeHtml(conflictMessages.join(', '))}</p>`
          : ''
      }
      ${(['Global', 'Editing', 'Outline', 'Mindmap'] as ShortcutGroup[])
        .map((group) => renderShortcutGroup(group))
        .join('')}
    </div>
  `
}

function renderShortcutGroup(group: ShortcutGroup): string {
  return `
    <section class="shortcut-group" aria-label="${escapeAttribute(group)} shortcuts">
      <h3>${escapeHtml(group)}</h3>
      ${SHORTCUT_DEFINITIONS.filter((shortcut) => shortcut.group === group)
        .map((shortcut) => renderShortcutRow(shortcut))
        .join('')}
    </section>
  `
}

function renderShortcutRow(shortcut: ShortcutDefinition): string {
  const combo = state.shortcuts[shortcut.id] ?? shortcut.defaultCombo
  const isCapturing = state.shortcutCaptureId === shortcut.id
  const conflict = getShortcutConflicts(state.shortcuts).some(([, ids]) => ids.includes(shortcut.id))

  return `
    <div class="shortcut-row${conflict ? ' conflict' : ''}">
      <span>${escapeHtml(shortcut.label)}</span>
      <div>
        <button
          class="shortcut-capture${isCapturing ? ' recording' : ''}"
          data-action="capture-shortcut"
          data-shortcut-id="${shortcut.id}"
          type="button"
        >
          ${isCapturing ? 'Press keys/click...' : escapeHtml(formatShortcutLabel(combo))}
        </button>
        <button
          class="shortcut-reset"
          data-action="reset-shortcut"
          data-shortcut-id="${shortcut.id}"
          type="button"
          aria-label="Reset ${escapeAttribute(shortcut.label)}"
        >
          Default
        </button>
        <button
          class="shortcut-clear"
          data-action="clear-shortcut"
          data-shortcut-id="${shortcut.id}"
          type="button"
          aria-label="Clear ${escapeAttribute(shortcut.label)}"
        >
          Clear
        </button>
      </div>
    </div>
  `
}
