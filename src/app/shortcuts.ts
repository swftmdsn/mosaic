import { DEFAULT_SHORTCUTS, LEGACY_SHORTCUT_DEFAULTS, SHORTCUT_DEFINITIONS } from './constants'
import type { ShortcutDefinition, ShortcutId } from './types'

export function loadShortcuts(): Record<ShortcutId, string> {
  try {
    const stored = JSON.parse(localStorage.getItem('mosaic-shortcuts') ?? '{}') as Record<string, unknown>
    const shortcuts = { ...DEFAULT_SHORTCUTS }

    for (const shortcut of SHORTCUT_DEFINITIONS) {
      const storedCombo = stored[shortcut.id]

      if (typeof storedCombo === 'string') {
        shortcuts[shortcut.id] = normalizeShortcutCombo(storedCombo)
      }
    }

    for (const [id, legacyCombo] of Object.entries(LEGACY_SHORTCUT_DEFAULTS) as Array<[ShortcutId, string]>) {
      if (stored[id] === legacyCombo) {
        shortcuts[id] = DEFAULT_SHORTCUTS[id]
      }
    }

    if (stored.mindmapAddSibling === 'Enter') {
      shortcuts.mindmapAddSibling = DEFAULT_SHORTCUTS.mindmapAddSibling
    }

    return shortcuts
  } catch {
    return { ...DEFAULT_SHORTCUTS }
  }
}

export function normalizeKeyboardEvent(event: KeyboardEvent): string {
  const parts: string[] = []

  if (event.metaKey || event.ctrlKey) {
    parts.push('Mod')
  }

  if (event.altKey) {
    parts.push('Alt')
  }

  if (event.shiftKey) {
    parts.push('Shift')
  }

  const key = normalizeShortcutKey(event.key)

  if (!['Mod', 'Alt', 'Shift', 'Control', 'Meta'].includes(key)) {
    parts.push(key)
  }

  return parts.join('+')
}

export function normalizePointerEvent(event: MouseEvent): string {
  const parts: string[] = []

  if (event.metaKey || event.ctrlKey) {
    parts.push('Mod')
  }

  if (event.altKey) {
    parts.push('Alt')
  }

  if (event.shiftKey) {
    parts.push('Shift')
  }

  parts.push('Click')
  return parts.join('+')
}

export function normalizeShortcutCombo(combo: string): string {
  const parts = combo
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
  const key = parts.pop() ?? ''
  const modifierSet = new Set(parts.map((part) => (part === 'Ctrl' || part === 'Meta' || part === 'Cmd' ? 'Mod' : part)))
  const normalized: string[] = []

  if (modifierSet.has('Mod')) {
    normalized.push('Mod')
  }

  if (modifierSet.has('Alt')) {
    normalized.push('Alt')
  }

  if (modifierSet.has('Shift')) {
    normalized.push('Shift')
  }

  normalized.push(normalizeShortcutKey(key))
  return normalized.join('+')
}

export function normalizeShortcutKey(key: string): string {
  if (key === ' ') {
    return 'Space'
  }

  if (key.toLowerCase() === 'click') {
    return 'Click'
  }

  if (key.length === 1) {
    return key.toUpperCase()
  }

  return key
    .replace(/^Esc$/u, 'Escape')
    .replace(/^Return$/u, 'Enter')
}

export function formatShortcutLabel(combo: string): string {
  if (!combo) {
    return 'Not set'
  }

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
  const modLabel = isMac ? 'Cmd' : 'Ctrl'
  const altLabel = isMac ? 'Option' : 'Alt'

  return combo
    .replace(/Mod/u, modLabel)
    .replace(/\bAlt\b/gu, altLabel)
    .replace(/\+/g, ' + ')
}

export function shortcutsCanConflict(firstId: ShortcutId, secondId: ShortcutId): boolean {
  const first = getShortcutDefinition(firstId)
  const second = getShortcutDefinition(secondId)

  if (first.group === second.group) {
    return true
  }

  if ((firstId === 'closePanel' && secondId === 'outdentOrClearFocus') || (firstId === 'outdentOrClearFocus' && secondId === 'closePanel')) {
    return false
  }

  if ((firstId === 'toggleView' && secondId === 'outdentLine') || (firstId === 'outdentLine' && secondId === 'toggleView')) {
    return false
  }

  if (first.group === 'Global' || second.group === 'Global') {
    return true
  }

  if (first.group === 'Editing' && (second.group === 'Outline' || second.group === 'Mindmap')) {
    return true
  }

  if (second.group === 'Editing' && (first.group === 'Outline' || first.group === 'Mindmap')) {
    return true
  }

  return false
}

export function getShortcutDefinition(id: ShortcutId): ShortcutDefinition {
  return SHORTCUT_DEFINITIONS.find((shortcut) => shortcut.id === id) ?? SHORTCUT_DEFINITIONS[0]
}

export function isShortcutId(value: string | undefined): value is ShortcutId {
  return Boolean(value && SHORTCUT_DEFINITIONS.some((shortcut) => shortcut.id === value))
}

export function getShortcutConflict(id: ShortcutId, combo: string, shortcuts: Record<ShortcutId, string>): ShortcutId | null {
  const normalized = normalizeShortcutCombo(combo)

  if (!normalized) {
    return null
  }

  for (const shortcut of SHORTCUT_DEFINITIONS) {
    if (shortcut.id === id || shortcuts[shortcut.id] !== normalized) {
      continue
    }

    if (shortcutsCanConflict(id, shortcut.id)) {
      return shortcut.id
    }
  }

  return null
}

export function getShortcutConflicts(shortcuts: Record<ShortcutId, string>): Array<[string, ShortcutId[]]> {
  const conflicts: Array<[string, ShortcutId[]]> = []

  for (const [combo, ids] of groupShortcutsByCombo(shortcuts)) {
    const conflictingIds = ids.filter((id, _index, allIds) => {
      return allIds.some((otherId) => otherId !== id && shortcutsCanConflict(id, otherId))
    })

    if (conflictingIds.length > 1) {
      conflicts.push([combo, conflictingIds])
    }
  }

  return conflicts
}

function groupShortcutsByCombo(shortcuts: Record<ShortcutId, string>): Map<string, ShortcutId[]> {
  const groups = new Map<string, ShortcutId[]>()

  for (const shortcut of SHORTCUT_DEFINITIONS) {
    const combo = shortcuts[shortcut.id]

    if (!combo) {
      continue
    }

    groups.set(combo, [...(groups.get(combo) ?? []), shortcut.id])
  }

  return groups
}
