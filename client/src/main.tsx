import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Връщаме стиловете
import './i18n' // i18n initialization
import { AuthProvider } from './context/AuthContext.jsx' // Връщаме Auth
import { ThemeProvider } from './components/layout/theme-provider.tsx' // Theme provider
import { UserPreferenceSync } from './components/features/UserPreferenceSync.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const rootElement = document.getElementById('root');
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "10283592881-placeholder.apps.googleusercontent.com";

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <GoogleOAuthProvider clientId={googleClientId}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <UserPreferenceSync />
              <App />
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </React.StrictMode>,
    )
}