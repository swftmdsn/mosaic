export function renderRangeTicks(action: string, marks: number[], min: number, max: number, variant = ''): string {
  return `
    <div class="range-ticks${variant ? ` ${variant}` : ''}">
      ${marks
        .map((mark) => {
          const position = ((mark - min) / (max - min)) * 100

          return `
            <button
              class="range-tick"
              data-action="${action}"
              data-value="${mark}"
              type="button"
              style="left: ${position}%"
              tabindex="-1"
              aria-label="Set value to ${mark}"
            >
              <span></span>
              <small>${formatSliderMark(mark)}</small>
            </button>
          `
        })
        .join('')}
    </div>
  `
}

export function formatSliderMark(value: number): string {
  if (value === 3840) {
    return '4K'
  }

  if (value === 2560) {
    return '2.5K'
  }

  if (value === 1920) {
    return '2K'
  }

  if (value < 10) {
    return formatSpeedValue(value)
  }

  return String(value)
}

export function formatSpeedValue(value: number): string {
  const rounded = Math.round(value * 100) / 100
  const label = Number.isInteger(rounded)
    ? rounded.toFixed(0)
    : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')

  return `${label}x`
}
