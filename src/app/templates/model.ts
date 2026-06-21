import { BUILT_IN_TEMPLATES_STORAGE_KEY, CUSTOM_TEMPLATES_STORAGE_KEY } from '../constants'
import type { MindmapTemplate, TemplateNode } from '../types'
import { isRecord } from '../utils/guards'

export const BUILT_IN_TEMPLATES: MindmapTemplate[] = [
  {
    id: 'decision',
    label: 'Compare options',
    root: createTemplateNode('What decision needs clarity?', ['Options', 'Criteria', 'Risks', 'Next move']),
  },
  {
    id: 'research',
    label: 'Map research',
    root: createTemplateNode('What am I trying to understand?', ['Signals', 'Questions', 'Sources', 'Open threads']),
  },
  {
    id: 'plan',
    label: 'Shape a plan',
    root: createTemplateNode('What outcome am I building toward?', ['Milestones', 'Dependencies', 'Tradeoffs', 'First step']),
  },
  {
    id: 'brief',
    label: 'Frame a brief',
    root: createTemplateNode('What needs to be made?', ['Goal', 'Audience', 'Constraints', 'Definition of done']),
  },
  {
    id: 'meeting',
    label: 'Run a session',
    root: createTemplateNode('What should this session resolve?', ['Context', 'Agenda', 'Decisions', 'Follow-ups']),
  },
]

export function createTemplateNode(markdown: string, children: string[] = []): TemplateNode {
  return {
    markdown,
    children: children.map((child) => createTemplateNode(child)),
  }
}

export function loadCustomTemplates(): MindmapTemplate[] {
  try {
    return parseTemplates(JSON.parse(localStorage.getItem(CUSTOM_TEMPLATES_STORAGE_KEY) ?? '[]') as unknown)
  } catch {
    return []
  }
}

export function loadBuiltInTemplates(): MindmapTemplate[] {
  const stored = localStorage.getItem(BUILT_IN_TEMPLATES_STORAGE_KEY)

  if (stored === null) {
    return cloneTemplates(BUILT_IN_TEMPLATES)
  }

  try {
    return parseTemplates(JSON.parse(stored) as unknown)
  } catch {
    return cloneTemplates(BUILT_IN_TEMPLATES)
  }
}

export function cloneTemplates(templates: MindmapTemplate[]): MindmapTemplate[] {
  return templates.map((template) => ({
    id: template.id,
    label: template.label,
    root: cloneTemplateNode(template.root),
  }))
}

export function cloneTemplateNode(node: TemplateNode): TemplateNode {
  return {
    markdown: node.markdown,
    children: node.children.map(cloneTemplateNode),
  }
}

export function parseTemplates(value: unknown): MindmapTemplate[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map(parseTemplate)
    .filter((template): template is MindmapTemplate => template !== null)
}

export function parseTemplate(value: unknown): MindmapTemplate | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.label !== 'string') {
    return null
  }

  const root = parseTemplateNode(value.root)

  if (!root) {
    return null
  }

  return {
    id: value.id,
    label: value.label,
    root,
  }
}

export function parseTemplateNode(value: unknown): TemplateNode | null {
  if (!isRecord(value) || typeof value.markdown !== 'string') {
    return null
  }

  return {
    markdown: value.markdown,
    children: Array.isArray(value.children)
      ? value.children.map(parseTemplateNode).filter((child): child is TemplateNode => child !== null)
      : [],
  }
}
