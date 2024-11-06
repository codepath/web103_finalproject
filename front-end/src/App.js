// import { useRoutes } from 'react-router-dom';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import './App.css';

import NavigationBar from './components/nav-bar';
import LoginPage from './pages/login-page';
import HomePage from './pages/home-page';
import ProfilePage from './pages/profile-page';
import AppointmentPage from './pages/appointment-page';
import SalonPage from './pages/salon-page';
import SignUpPage from './pages/sign-up-page';
import NotFoundPage from './pages/not-found-page';

function App() {

  return (
    <div className='app'>

      <NavigationBar />

      <BrowserRouter>
      <div className="App">
          <Routes>
            <Route path="/" element={<HomePage title='Home Page' />} />
            <Route path="/login" element={<LoginPage title='Login Page' />} />
            <Route path="/signup" element={<SignUpPage title='Create an account' />} />
            <Route path="/profile" element={<ProfilePage title='Profile Page' />} />
            <Route path="/employee/appointment" element={<AppointmentPage title='Reserve an appointment with employee' />} />
            <Route path="/salon" element={<SalonPage title='Salon' />}/>
            <Route path="*" element={<NotFoundPage title="404 Page not found" />} />
          </Routes>
      </div>
    </BrowserRouter>

    </div>
  )
}

export default App;
