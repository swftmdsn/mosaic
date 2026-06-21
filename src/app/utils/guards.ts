export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function getSettingsSource(payload: unknown): Record<string, unknown> | null {
  if (!isRecord(payload)) {
    return null
  }

  return isRecord(payload.settings) ? payload.settings : payload
}
