import { Routes, Route } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Matches from './pages/Matches'
import MatchDetail from './pages/MatchDetail'
import Discover from './pages/Discover'
import TeamDetail from './pages/TeamDetail'
import PlayerDetail from './pages/PlayerDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login title="MatchLens | Sign In" />} />
      <Route path="/signup" element={<Signup title="MatchLens | Sign Up" />} />

      {/* Everything below the guard needs a live server session. RequireAuth
          bounces anonymous visitors to /login before the layout renders. */}
      <Route element={<RequireAuth />}>
        <Route element={<Sidebar />}>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:matchId" element={<MatchDetail />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/players/:playerId" element={<PlayerDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
