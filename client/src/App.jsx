import { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import './App.css'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { auth, provider } from './firebase.js'
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth' // Removed getRedirectResult, GoogleAuthProvider
import SignInWithGoogleButton from './components/SignInWithGoogleButton.jsx'
import AuthContext from './contexts/AuthContext.js'
import { ThemeProvider } from '@emotion/react'
import { theme } from './theme.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Splash from './pages/Splash/index.jsx'
import Layout from './pages/Layout.jsx/index.jsx'
import Home from './pages/Home/index.jsx'
import Profile from './pages/Profile/index.jsx'
import Shop from './pages/Shop/index.jsx'
import Testing from './pages/Testing/index.jsx'

function App() {

  // if (loading) {
  //   return <Typography>Loading authentication...</Typography>;
  // }


  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/splash' element={<Splash/>}/>
          <Route path='/' element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="shop" element={<Shop/>}/>
            <Route path="dev" element={<Testing/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
