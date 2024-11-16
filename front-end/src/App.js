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

import ProfilePage from './pages/profile-page';
import AppointmentPage from './pages/appointment-page';
import NotFoundPage from './pages/not-found-page';

function App() {

  return (
      <BrowserRouter>
        <div className="App">
          <NavigationBar />
            <Routes>
              <Route path="/" element={<HomePage title='Home Page' />} />
              <Route path="/login" element={<LoginPage title='Login Page' />} />
              <Route path="/new-password" element={<ForgotPasswordNewPassword title='Enter new password' />} />
              <Route path="/forgot-password" element={<ForgotPasswordCheckEmail title='Confirm your email' />} />
              <Route path="/signup" element={<SignUpPage title='Create an account' />} />
              
              <Route path="/profile" element={<ProfilePage title='Profile Page' />} />

              <Route path="/employee/:eid/salon/:sid/appointment" element={<AppointmentPage title='Reserve an appointment with employee' />} />
              <Route path="/salon/:id" element={<SalonPage title='Salon' />}/>

              <Route path="*" element={<NotFoundPage title="404 Page not found" />} />
            </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App;
