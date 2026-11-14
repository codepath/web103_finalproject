import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ActiveUserProvider } from './context/ActiveUserContext.jsx'
import App from './App.jsx'
import './styles/app.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ActiveUserProvider>
        <App />
      </ActiveUserProvider>
    </BrowserRouter>
  </StrictMode>,
)
