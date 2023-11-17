import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Set the API URL based on the environment
window.API_URL = process.env.NODE_ENV === 'production'
  ? 'https://codefm-client-production.up.railway.app'
  : 'http://localhost:3001';
  
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)