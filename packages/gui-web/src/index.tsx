import { createRoot } from 'react-dom/client'
import './css'
import { App } from './App'

const container = document.getElementById('app')
if (!container) {
  throw new Error('DOM 里没有 #app 元素。')
}
const root = createRoot(container)
root.render(<App />)
