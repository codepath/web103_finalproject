import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import StoreProvider from './store/StoreProvider'
import SessionInitializer from './components/SessionInitializer'
import GithubSuccess from './pages/GithubSuccess'
import GithubError from './pages/GithubError'

const App = () => {
  return (
    <StoreProvider>
      <SessionInitializer />
        <main>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth/github/success" element={<GithubSuccess />} />
                <Route path="/auth/github/error" element={<GithubError />} />
              </Routes>
            </Router>
        </main>
      </StoreProvider>
  )
}

export default App
