import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css' // <-- Cambiamos esta ruta para usar tus estilos globales
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)