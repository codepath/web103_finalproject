// import { useRoutes } from 'react-router-dom';

import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import './App.css';

import NavigationBar from './components/nav-bar';

import LoginPage from './pages/login-signup-page/login-page';
import SignUpPage from './pages/login-signup-page/sign-up-page';
import ForgotPasswordCheckEmail from './pages/login-signup-page/forgot-password-check-email';
import ForgotPasswordNewPassword from './pages/login-signup-page/forgot-password-new-password';

import HomePage from './pages/home-page/home-page';
import SalonPage from './pages/salon-page/salon-page';

import ProfilePage from './pages/profile-page-appointment/profile-page';
import AppointmentPage from './pages/appointment-page';
import NotFoundPage from './pages/not-found-page';
import { useState } from 'react';
import MyDatePicker from './pages/my-date-picker';

function App() {
  // const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(1);

  const handleSetUserId = (id) => {
    setCurrentUserId(id);
  }

  return (
      <BrowserRouter>
        <div className="App">
          <NavigationBar />
            <Routes>
              <Route path="/" element={<HomePage title='Home Page' />} />
              <Route path="/login" element={<LoginPage title='Login Page' setCurrentUserId={handleSetUserId}/>} />
              <Route path="/new-password" element={<ForgotPasswordNewPassword title='Enter new password' />} />
              <Route path="/forgot-password" element={<ForgotPasswordCheckEmail title='Confirm your email' />} />
              <Route path="/signup" element={<SignUpPage title='Create an account' />} />
              
              <Route path="/profile" element={<ProfilePage title='Profile Page' currentUserId={currentUserId}/>} />
              <Route path="/day" element={<MyDatePicker title='Profile Page' />} />

              <Route path="/employee/:eid/salon/:sid/appointment" element={<AppointmentPage title='Reserve an appointment with employee' currentUserId={currentUserId}/>} />
              <Route path="/salon/:id" element={<SalonPage title='Salon'/>}/>

              <Route path="*" element={<NotFoundPage title="404 Page not found" />} />
            </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App;
