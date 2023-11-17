import { useState } from 'react'
import './App.css'

import { Link, Routes, Route, BrowserRouter} from "react-router-dom"
import Login from './pages/Login'
import FormSubmission from './pages/FormSubmission'
import Results from './pages/Results'
import Button from 'react-bootstrap/esm/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import DetailedView from './pages/DetailedView'


function App() {

  return (
    <>
      <BrowserRouter>
      <Link to='/'><Button variant='' style={{ position: 'fixed', top: '10px', left: '10px'}}>Home</Button></Link>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/form" element={<FormSubmission />}/>
          <Route path="/result" element={<Results />}/>
          <Route path='/results/:id' element={<DetailedView />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
