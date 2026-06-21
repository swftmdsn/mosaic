import { updateNodeMarkdown, type MindmapDocument } from '../../core/mindmap'
import { escapeAttribute, escapeHtml, normalizeLinkUrl } from './html'

export type MarkdownRenderOptions = {
  links?: boolean
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function extractMarkdownImages(markdown: string): Array<{ alt: string; src: string; width: number }> {
  const images: Array<{ alt: string; src: string; width: number }> = []
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)(?:\{width=(\d+)\})?/g
  let match: RegExpExecArray | null = imagePattern.exec(markdown)

  while (match) {
    images.push({
      alt: match[1] || 'Image',
      src: match[2],
      width: Number(match[3] ?? 320),
    })
    match = imagePattern.exec(markdown)
  }

  return images
}

export function extractImageMarkdown(markdown: string): string[] {
  return [...markdown.matchAll(/!\[[^\]]*]\([^)]+\)(?:\{width=\d+\})?/g)].map((match) => match[0])
}

export function getEditableMarkdown(markdown: string): string {
  return normalizeEditableMarkdown(markdown
    .replace(/!\[[^\]]*]\([^)]+\)(?:\{width=\d+\})?/g, '')
    .replace(/\n{3,}/g, '\n\n'))
}

export function updateNodeTextMarkdown(documentUpdate: MindmapDocument, id: string, textMarkdown: string): MindmapDocument {
  const current = documentUpdate.nodes[id]?.markdown ?? ''
  const images = extractImageMarkdown(current)
  const nextMarkdown = [normalizeEditableMarkdown(textMarkdown), ...images].filter(Boolean).join('\n')

  return updateNodeMarkdown(documentUpdate, id, nextMarkdown)
}

export function getEditableMarkdownFromElement(element: HTMLElement): string {
  return normalizeEditableMarkdown(getEditableRawTextFromElement(element))
}

export function getEditableRawTextFromElement(element: HTMLElement): string {
  return serializeEditableNode(element)
    .replace(/\u00a0/g, ' ')
    .replace(/\u200b/g, '')
    .replace(/\n{3,}/g, '\n\n')
}

export function normalizeEditableMarkdown(markdown: string): string {
  const leftTrimmed = markdown.trimStart()
  const trimmed = leftTrimmed.trimEnd()

  if (/(\n|^)[ \t]*-$/.test(trimmed) && /(\n|^)[ \t]*-\s+$/.test(leftTrimmed)) {
    return `${trimmed} `
  }

  return trimmed
}

export function serializeEditableNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? ''
  }

  if (!(node instanceof HTMLElement)) {
    return [...node.childNodes].map(serializeEditableNode).join('')
  }

  const tagName = node.tagName.toLowerCase()

  if (node.dataset.markdownBulletMarker === 'true') {
    return ''
  }

  if (node.dataset.markdownBullet === 'true') {
    const contentElement = node.querySelector<HTMLElement>('[data-markdown-bullet-content]')
    const content = contentElement ? serializeEditableNode(contentElement).replace(/\u200b/g, '') : ''
    const indent = '  '.repeat(Math.max(0, Number(node.dataset.bulletIndent ?? '0') || 0))
    return `${indent}- ${content}`
  }

  const content = [...node.childNodes].map(serializeEditableNode).join('')

  if (node.dataset.markdownHeadingLevel) {
    const level = clampNumber(Number(node.dataset.markdownHeadingLevel), 1, 6)
    return `${'#'.repeat(level)} ${content.replace(/\u200b/g, '')}`
  }

  if (tagName === 'br') {
    return '\n'
  }

  if (tagName === 'strong' || tagName === 'b') {
    return `**${content}**`
  }

  if (tagName === 'em' || tagName === 'i') {
    return `_${content}_`
  }

  if (tagName === 'u') {
    return `<u>${content}</u>`
  }

  if (tagName === 'mark') {
    return `==${content}==`
  }

  if (tagName === 's' || tagName === 'strike' || tagName === 'del') {
    return `~~${content}~~`
  }

  if (tagName === 'code') {
    return `\`${content}\``
  }

  if (tagName === 'a') {
    const href = node.getAttribute('href') ?? ''
    return href ? `[${content}](${href})` : content
  }

  if ((tagName === 'div' || tagName === 'p') && node !== node.ownerDocument.body) {
    return `${content}\n`
  }

  return content
}

export function renderRichMarkdown(markdown: string, options: MarkdownRenderOptions = {}): string {
  if (!markdown.trim()) {
    return ''
  }

  return markdown
    .split('\n')
    .map((line) => renderRichMarkdownLine(line, options))
    .join('<br>')
}

export function renderRichMarkdownLine(line: string, options: MarkdownRenderOptions): string {
  const bullet = getBulletLineParts(line)

  if (bullet) {
    const content = bullet.content ? renderInlineMarkdown(bullet.content, options) : '&#8203;'

    return `<span class="markdown-bullet-line" data-markdown-bullet="true" data-bullet-indent="${bullet.indentLevel}" style="--bullet-depth: ${bullet.indentLevel}"><span class="markdown-bullet-marker" data-markdown-bullet-marker="true" contenteditable="false" aria-hidden="true">•</span><span class="markdown-bullet-content" data-markdown-bullet-content>${content}</span></span>`
  }

  const heading = getHeadingLineParts(line)

  if (heading) {
    const content = heading.content ? renderInlineMarkdown(heading.content, options) : '&#8203;'

    return `<span class="markdown-heading markdown-heading-${heading.level}" data-markdown-heading-level="${heading.level}">${content}</span>`
  }

  return renderInlineMarkdown(line, options)
}

export function renderInlineMarkdown(source: string, options: MarkdownRenderOptions = {}): string {
  const placeholders: string[] = []
  const shouldRenderLinks = options.links ?? true
  let markdown = source.replace(/`([^`]+)`/g, (_match, code: string) => {
    return addInlineHtmlPlaceholder(placeholders, `<code>${escapeHtml(code)}</code>`)
  })

  markdown = markdown.replace(/\[([^\]\n]+)]\(([^)\n]+)\)/g, (match, label: string, rawUrl: string) => {
    if (!shouldRenderLinks) {
      return label
    }

    const url = normalizeLinkUrl(rawUrl)

    if (!url) {
      return match
    }

    return addInlineHtmlPlaceholder(placeholders, renderMarkdownAnchorHtml(renderInlineTextMarkdown(label), url))
  })

  if (shouldRenderLinks) {
    markdown = linkifyRawUrls(markdown, placeholders)
  }

  let html = renderInlineTextMarkdown(markdown)

  html = restoreInlineHtmlPlaceholders(html, placeholders)

  return html
}

export function renderInlineTextMarkdown(source: string): string {
  let html = escapeHtml(source)

  html = html.replace(/&lt;u&gt;([\s\S]+?)&lt;\/u&gt;/g, '<u>$1</u>')
  html = html.replace(/==([\s\S]+?)==/g, '<mark>$1</mark>')
  html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/_([\s\S]+?)_/g, '<em>$1</em>')
  html = html.replace(/~~([\s\S]+?)~~/g, '<s>$1</s>')

  return html
}

export function linkifyRawUrls(source: string, placeholders: string[]): string {
  return source.replace(/(^|[\s([{<])((?:https?:\/\/|www\.)[^\s<>"']+)/gi, (match, prefix: string, rawUrl: string) => {
    const { url: candidate, trailing } = splitTrailingUrlPunctuation(rawUrl)
    const url = normalizeLinkUrl(candidate)

    if (!url) {
      return match
    }

    return `${prefix}${addInlineHtmlPlaceholder(placeholders, renderMarkdownAnchorHtml(escapeHtml(candidate), url))}${trailing}`
  })
}

export function renderMarkdownAnchorHtml(labelHtml: string, url: string): string {
  const safeUrl = escapeAttribute(url)

  return `<a href="${safeUrl}" data-markdown-link="true" data-link-url="${safeUrl}" target="_blank" rel="noopener noreferrer">${labelHtml}</a>`
}

export function addInlineHtmlPlaceholder(placeholders: string[], html: string): string {
  const index = placeholders.push(html) - 1

  return `\uE000${index}\uE001`
}

export function restoreInlineHtmlPlaceholders(html: string, placeholders: string[]): string {
  return html.replace(/\uE000(\d+)\uE001/g, (_match, rawIndex: string) => placeholders[Number(rawIndex)] ?? '')
}

export function splitTrailingUrlPunctuation(rawUrl: string): { url: string; trailing: string } {
  let url = rawUrl
  let trailing = ''

  while (/[.,!?;:)\]}]$/.test(url)) {
    trailing = `${url.slice(-1)}${trailing}`
    url = url.slice(0, -1)
  }

  return { url, trailing }
}

export function getBulletLineParts(line: string): { indentLevel: number; content: string } | null {
  const match = line.match(/^([ \t]*)-\s+(.*)$/)

  if (!match) {
    return null
  }

  const indent = match[1].replace(/\t/g, '  ').length

  return {
    indentLevel: Math.min(6, Math.floor(indent / 2)),
    content: match[2],
  }
}

export function getHeadingLineParts(line: string): { level: number; content: string } | null {
  const match = line.match(/^(#{1,6})(?:[ \t]+|(?=\S))(.*)$/u)

  if (!match) {
    return null
  }

  return {
    level: match[1].length,
    content: match[2].replace(/[ \t]+#+[ \t]*$/u, '').trimEnd(),
  }
}

export function shouldRenderTypedRichMarkdown(previousMarkdown: string, nextMarkdown: string): boolean {
  if (previousMarkdown === nextMarkdown) {
    return false
  }

  return shouldRenderTypedBulletList(previousMarkdown, nextMarkdown)
    || shouldRenderTypedHeading(previousMarkdown, nextMarkdown)
}

export function shouldRenderTypedBulletList(previousMarkdown: string, nextMarkdown: string): boolean {
  if (previousMarkdown.split('\n').some((line) => getBulletLineParts(line))) {
    return false
  }

  return nextMarkdown.split('\n').some((line) => getBulletLineParts(line))
}

export function shouldRenderTypedHeading(previousMarkdown: string, nextMarkdown: string): boolean {
  if (previousMarkdown.split('\n').some((line) => getHeadingLineParts(line))) {
    return false
  }

  return nextMarkdown.split('\n').some((line) => getHeadingLineParts(line))
}

export function getMarkdownLineRange(markdown: string, rawStart: number, rawEnd: number): { start: number; end: number } {
  const start = Math.min(Math.max(0, rawStart), markdown.length)
  const end = Math.min(Math.max(start, rawEnd), markdown.length)
  const lineStart = markdown.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const nextLineBreak = markdown.indexOf('\n', end)

  return {
    start: lineStart,
    end: nextLineBreak === -1 ? markdown.length : nextLineBreak,
  }
}

export function toggleBulletLines(markdownBlock: string): string {
  const lines = markdownBlock.split('\n')
  const editableLines = lines.filter((line) => line.trim().length > 0)

  if (editableLines.length === 0) {
    return '- '
  }

  const shouldRemoveBullets = editableLines.every((line) => Boolean(getBulletLineParts(line)))

  return lines
    .map((line) => {
      if (!line.trim()) {
        return line
      }

      const bullet = getBulletLineParts(line)

      if (shouldRemoveBullets && bullet) {
        return `${'  '.repeat(bullet.indentLevel)}${bullet.content}`
      }

      if (bullet) {
        return line
      }

      const indentMatch = line.match(/^[ \t]*/)
      const indent = indentMatch?.[0] ?? ''

      return `${indent}- ${line.slice(indent.length)}`
    })
    .join('\n')
}

export function serializeEditableRangeFragment(range: Range): string {
  return serializeEditableNode(range.cloneContents()).replace(/\u200b/g, '')
}

export function replaceImageWidth(markdown: string, targetIndex: number, width: number): string {
  let index = 0

  return markdown.replace(/(!\[[^\]]*]\([^)]+\))(?:\{width=\d+\})?/g, (match, imageMarkdown: string) => {
    if (index !== targetIndex) {
      index += 1
      return match
    }

    index += 1
    return `${imageMarkdown}{width=${width}}`
  })
}

export function removeImageMarkdown(markdown: string, targetIndex: number): string {
  let index = 0
  const nextMarkdown = markdown.replace(/!\[[^\]]*]\([^)]+\)(?:\{width=\d+\})?/g, (match) => {
    if (index !== targetIndex) {
      index += 1
      return match
    }

    index += 1
    return ''
  })

  return nextMarkdown
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line, lineIndex, lines) => line.trim() || lines[lineIndex - 1]?.trim())
    .join('\n')
    .trim()
}
