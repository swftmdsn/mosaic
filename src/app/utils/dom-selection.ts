import { serializeEditableRangeFragment } from './markdown'

export function getCaretClientRect(range: Range): DOMRect | null {
  const rect = range.getBoundingClientRect()

  if (rect.width > 0 || rect.height > 0) {
    return rect
  }

  const marker = document.createElement('span')
  marker.textContent = '\u200b'
  marker.style.cssText = [
    'display:inline-block',
    'width:0',
    'height:1em',
    'line-height:1',
    'overflow:hidden',
    'vertical-align:baseline',
  ].join(';')

  const markerRange = range.cloneRange()
  markerRange.insertNode(marker)
  const markerRect = marker.getBoundingClientRect()
  marker.remove()

  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)

  return markerRect.width > 0 || markerRect.height > 0 ? markerRect : null
}

export function getEditorSelectionRange(editor: HTMLElement | null): { start: number; end: number } | null {
  if (!editor) {
    return null
  }

  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    return null
  }

  const range = selection.getRangeAt(0)

  if (!editor.contains(range.commonAncestorContainer)) {
    return null
  }

  const before = range.cloneRange()
  before.selectNodeContents(editor)
  before.setEnd(range.startContainer, range.startOffset)

  const selected = range.cloneRange()
  const beforeMarkdown = serializeEditableRangeFragment(before)
  const selectedMarkdown = serializeEditableRangeFragment(selected)

  return {
    start: beforeMarkdown.length,
    end: beforeMarkdown.length + selectedMarkdown.length,
  }
}

export function hasTextSelectionInside(element: HTMLElement): boolean {
  const selection = window.getSelection()

  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return false
  }

  const range = selection.getRangeAt(0)

  return element.contains(range.commonAncestorContainer)
}

export function moveEditableCaretToEnd(element: HTMLElement | null): void {
  if (!element) {
    return
  }

  const range = document.createRange()
  range.selectNodeContents(element)
  range.collapse(false)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

export function collapseTextInputSelection(input: HTMLInputElement): void {
  requestAnimationFrame(() => {
    const position = input.selectionEnd ?? input.value.length
    input.setSelectionRange(position, position)
  })
}
