import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './components/auth.tsx'
import MainRouter from './Router.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider><MainRouter /></AuthProvider>
  </StrictMode>,
)
