import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// PWA service worker — production only, BASE_URL aware (e.g. /shift-cockpit/)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL
    const swUrl = `${base}sw.js`
    navigator.serviceWorker.register(swUrl, { scope: base }).catch(() => {
      // Registration failed (file missing, insecure context) — ignore for MVP
    })
  })
}
