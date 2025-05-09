import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
