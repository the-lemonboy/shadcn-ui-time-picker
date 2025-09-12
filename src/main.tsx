import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from './App.tsx'
// eslint-disable-next-line import/no-unresolved
// @ts-expect-error: render icons
import 'virtual:svg-icons-register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
