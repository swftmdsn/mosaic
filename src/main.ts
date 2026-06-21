import { initApp } from './app'
import './styles.css'

const app = document.querySelector<HTMLElement>('#app')

if (!app) {
  throw new Error('Missing #app root element')
}

initApp(app)

if (import.meta.env.DEV) {
  void import('./agentation-dev').then(({ mountAgentationDev }) => {
    mountAgentationDev()
  })
}
