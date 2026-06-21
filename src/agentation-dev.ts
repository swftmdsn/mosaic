import { Agentation } from 'agentation'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

const MOBILE_VIEWPORT_QUERY = '(max-width: 720px)'

let agentationHost: HTMLDivElement | null = null
let agentationRoot: ReturnType<typeof createRoot> | null = null
let viewportListenerAttached = false

export function mountAgentationDev(): void {
  const mobileViewport = window.matchMedia(MOBILE_VIEWPORT_QUERY)

  const syncAgentation = (): void => {
    if (mobileViewport.matches) {
      agentationRoot?.unmount()
      agentationRoot = null
      agentationHost?.remove()
      agentationHost = null
      return
    }

    if (agentationHost || document.querySelector('#agentation-root')) {
      return
    }

    agentationHost = document.createElement('div')
    agentationHost.id = 'agentation-root'
    document.body.append(agentationHost)

    agentationRoot = createRoot(agentationHost)
    agentationRoot.render(createElement(Agentation))
  }

  syncAgentation()

  if (viewportListenerAttached) {
    return
  }

  viewportListenerAttached = true
  mobileViewport.addEventListener('change', syncAgentation)
}
