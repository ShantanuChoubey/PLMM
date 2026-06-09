import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { AppProviders } from '@/context/AppProviders'
import { STORAGE_KEYS, storage } from '@/utils/storage'
import '@/styles/globals.css'

const storedTheme = storage.getString(STORAGE_KEYS.THEME)
const initialTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark'
document.documentElement.classList.add(initialTheme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
