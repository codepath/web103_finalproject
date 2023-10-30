import { useState } from 'react'
import './App.css'

import { Link, Routes, Route, BrowserRouter} from "react-router-dom"
import Login from './pages/Login'
import FormSubmission from './pages/FormSubmission'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/form" element={<FormSubmission />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
