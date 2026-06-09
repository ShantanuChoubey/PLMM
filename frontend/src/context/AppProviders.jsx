import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { QueryProvider } from '@/context/QueryProvider'
import { ThemeProvider } from '@/context/ThemeContext'

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'text-sm',
              duration: 4000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
