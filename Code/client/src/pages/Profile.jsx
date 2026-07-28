import { useEffect, useState } from 'react'
import { useSessionUser } from '../hooks/useSessionUser'
import { teams as followableTeams } from '../mocks/teams'
import Avatar from '../components/Avatar'
import Crest from '../components/Crest'
import Skeleton from '../components/Skeleton'

const API_URL = import.meta.env.VITE_API_URL ?? ''
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const DEFAULT_BIO = 'Tactical obsession. Data-driven insights. World Cup 2026 prediction specialist.'

// Decorative only — no transactions table or trend data exists anywhere
// (points-beyond-display is GildardoOrea's territory, #10).
const balanceTrend = [40, 55, 35, 60, 30, 70, 50]
const recentTransactions = [
  { label: 'Argentina vs Mexico ✅', amount: '+320 pts', positive: true },
  { label: 'France vs Germany ❌', amount: '-200 pts', positive: false },
  { label: 'Brazil vs Serbia ✅', amount: '+450 pts', positive: true },
]

const connectedApps = [
  { name: 'Twitter/X', connected: true },
  { name: 'Discord', connected: false },
  { name: 'Spotify', connected: false },
]

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-dash-input'}`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Profile() {
  const sessionUser = useSessionUser()
  const userId = sessionUser?.id

  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [userError, setUserError] = useState(null)
  const [followedTeams, setFollowedTeams] = useState([])
  const [loadingFollows, setLoadingFollows] = useState(true)
  const [followsLoadError, setFollowsLoadError] = useState(null)
  const [followError, setFollowError] = useState(null)
  const [showTeamPicker, setShowTeamPicker] = useState(false)

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [bio, setBio] = useState(() => localStorage.getItem(`matchlens:bio:${userId}`) ?? DEFAULT_BIO)
  const [bioDraft, setBioDraft] = useState(bio)

  const [notifPrefs, setNotifPrefs] = useState({
    matchAlerts: true,
    transferNews: true,
    worldCupUpdates: true,
    leaderboardMilestones: false,
    predictionResults: true,
  })
  const [privacyPrefs, setPrivacyPrefs] = useState({
    profileVisibility: true,
    dataSharing: false,
    showPredictionHistory: true,
  })

  useEffect(() => {
    if (!userId) return

    setLoadingUser(true)
    setUserError(null)
    fetch(`${API_URL}/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load user')
        return res.json()
      })
      .then((data) => {
        setUser(data)
        setAvatarUrl(data.profile_image_url)
      })
      .catch((err) => {
        console.error('Failed to load user', err)
        setUserError('Could not load your profile.')
      })
      .finally(() => setLoadingUser(false))

    setLoadingFollows(true)
    setFollowsLoadError(null)
    fetch(`${API_URL}/api/follows/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load followed teams')
        return res.json()
      })
      .then(setFollowedTeams)
      .catch((err) => {
        console.error('Failed to load followed teams', err)
        setFollowsLoadError('Could not load followed teams.')
      })
      .finally(() => setLoadingFollows(false))
  }, [userId])

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setUploadError(
        'Cloudinary is not configured — set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in client/.env',
      )
      return
    }

    setUploading(true)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData },
      )
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed')
      const uploadData = await uploadRes.json()
      setAvatarUrl(uploadData.secure_url)

      const patchRes = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_image_url: uploadData.secure_url }),
      })
      if (!patchRes.ok) throw new Error('Failed to save avatar')
      const updatedUser = await patchRes.json()
      setUser(updatedUser)

      // Keep the Sidebar's avatar (read from this hint) in sync without
      // waiting for the next full session check.
      localStorage.setItem('matchlens_user', JSON.stringify({ ...sessionUser, ...updatedUser }))
    } catch (err) {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleSaveBio() {
    setBio(bioDraft)
    localStorage.setItem(`matchlens:bio:${userId}`, bioDraft)
    setIsEditingProfile(false)
  }

  async function handleFollowTeam(team) {
    setFollowError(null)
    try {
      const res = await fetch(`${API_URL}/api/follows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, api_team_id: team.api_team_id, team_name: team.name }),
      })
      if (!res.ok) throw new Error('Follow failed')
      const created = await res.json()
      setFollowedTeams((prev) => [...prev, created])
      setShowTeamPicker(false)
    } catch (err) {
      setFollowError('Could not follow team. Please try again.')
    }
  }

  async function handleUnfollowTeam(followedTeamId) {
    setFollowError(null)
    try {
      const res = await fetch(`${API_URL}/api/follows/${followedTeamId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Unfollow failed')
      setFollowedTeams((prev) => prev.filter((team) => team.followed_team_id !== followedTeamId))
    } catch (err) {
      setFollowError('Could not unfollow team. Please try again.')
    }
  }

  const pickableTeams = followableTeams.filter(
    (team) => !followedTeams.some((followed) => String(followed.api_team_id) === String(team.api_team_id)),
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1 text-white">Profile &amp; Account Settings</h1>
        <p className="text-[13px] text-secondary">
          Manage your predictive avatar, tracked national teams, and account safety.
        </p>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-6">
          {/* Profile header */}
          <div className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-6">
            <div className="flex items-center justify-between">
              {loadingUser ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="size-16 shrink-0 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ) : userError ? (
                <p className="text-[13px] text-dash-live">{userError}</p>
              ) : (
                <div className="flex items-center gap-4">
                  <Avatar name={user?.username} src={avatarUrl} className="size-16 shrink-0 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[18px] font-bold text-white">{user?.username}</p>
                    <p className="text-[13px] text-secondary">@{user?.username}</p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsEditingProfile((prev) => !prev)}
                className="rounded-lg border border-dash px-3 py-1.5 text-[12px] font-semibold text-white"
              >
                {isEditingProfile ? 'Close' : 'Edit Profile'}
              </button>
            </div>

            {isEditingProfile && (
              <div className="flex flex-col gap-3 rounded-lg border border-dash bg-dashboard p-4">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[12px] font-semibold text-secondary">Avatar</p>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-[12px] text-white" />
                  {uploading && <p className="text-[11px] text-secondary">Uploading…</p>}
                  {uploadError && <p className="text-[11px] text-dash-live">{uploadError}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[12px] font-semibold text-secondary">Bio</p>
                  <textarea
                    value={bioDraft}
                    onChange={(event) => setBioDraft(event.target.value)}
                    rows={3}
                    className="rounded-lg border border-dash bg-dash-card p-3 text-[13px] text-white focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveBio}
                  className="w-fit rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-black"
                >
                  Save Changes
                </button>
              </div>
            )}

            <p className="text-[13px] text-white">{bio}</p>
            <div className="flex items-center gap-4 text-[12px] text-secondary">
              <p>📍 London, UK</p>
              <p>Joined March 2024</p>
            </div>
          </div>

          {/* Points balance */}
          <div className="flex flex-col gap-5 rounded-2xl border border-dash bg-dash-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[12px] font-semibold text-secondary">Points Balance</p>
                {loadingUser ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-[28px] font-extrabold text-primary">
                    {(user?.points ?? 0).toLocaleString()}
                  </p>
                )}
              </div>
              <span className="rounded-lg bg-primary px-4 py-2 text-[12px] font-bold uppercase text-dash-sidebar">
                Top Up Balance
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-secondary">
                <p>Balance Trend (Last 30 days)</p>
              </div>
              <div className="flex h-10 items-end gap-1.5">
                {balanceTrend.map((height, index) => (
                  <div key={index} className="flex-1 rounded-t bg-primary/40" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold text-white">Recent Transactions</p>
              {recentTransactions.map((tx) => (
                <div key={tx.label} className="flex items-center justify-between text-[13px]">
                  <p className="text-white">{tx.label}</p>
                  <p className={tx.positive ? 'text-primary' : 'text-dash-live'}>{tx.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Followed teams */}
          <div className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-6">
            <p className="text-[18px] font-bold text-white">Followed Teams</p>
            {followError && <p className="text-[12px] text-dash-live">{followError}</p>}
            <div className="flex flex-col gap-3">
              {loadingFollows &&
                [0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-dash pb-3">
                    <Skeleton className="size-6 shrink-0 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              {!loadingFollows && followsLoadError && (
                <p className="text-[13px] text-dash-live">{followsLoadError}</p>
              )}
              {!loadingFollows &&
                !followsLoadError &&
                followedTeams.map((team) => (
                  <div key={team.followed_team_id} className="flex items-center justify-between border-b border-dash pb-3">
                    <div className="flex items-center gap-3">
                      <Crest compact label={team.team_name} className="size-6 rounded" />
                      <p className="text-[14px] font-bold text-white">{team.team_name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnfollowTeam(team.followed_team_id)}
                      className="text-[12px] font-semibold text-dash-live"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              {!loadingFollows && !followsLoadError && followedTeams.length === 0 && (
                <p className="text-[13px] text-secondary">Not following any teams yet.</p>
              )}
            </div>

            {showTeamPicker ? (
              <div className="flex flex-col gap-2">
                {pickableTeams.map((team) => (
                  <button
                    key={team.api_team_id}
                    type="button"
                    onClick={() => handleFollowTeam(team)}
                    className="flex items-center justify-between rounded-lg border border-dash bg-dashboard px-3 py-2 text-left text-[13px] text-white"
                  >
                    {team.name}
                    <span className="text-primary">+ Follow</span>
                  </button>
                ))}
                {pickableTeams.length === 0 && (
                  <p className="text-[12px] text-secondary">All available teams are already followed.</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTeamPicker(true)}
                className="w-fit text-[13px] font-semibold text-primary"
              >
                + Follow New Team
              </button>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex w-[420px] shrink-0 flex-col gap-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-dash bg-dash-card p-6">
            <p className="text-[16px] font-bold text-white">Account Settings</p>

            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold text-secondary">Notifications</p>
              {[
                ['matchAlerts', 'Match Alerts'],
                ['transferNews', 'Transfer News'],
                ['worldCupUpdates', 'World Cup 2026 Updates'],
                ['leaderboardMilestones', 'Leaderboard Milestones'],
                ['predictionResults', 'Prediction Results'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <p className="text-[14px] text-white">{label}</p>
                  <ToggleSwitch
                    checked={notifPrefs[key]}
                    onChange={() => setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }))}
                  />
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-dash" />

            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold text-secondary">Privacy</p>
              {[
                ['profileVisibility', 'Profile Visibility'],
                ['dataSharing', 'Data Sharing'],
                ['showPredictionHistory', 'Show Prediction History'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <p className="text-[14px] text-white">{label}</p>
                  <ToggleSwitch
                    checked={privacyPrefs[key]}
                    onChange={() => setPrivacyPrefs((prev) => ({ ...prev, [key]: !prev[key] }))}
                  />
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-dash" />

            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold text-secondary">Connected Apps</p>
              {connectedApps.map((app) => (
                <div key={app.name} className="flex items-center justify-between">
                  <p className="text-[14px] text-white">
                    {app.name} <span className="text-secondary">· {app.connected ? 'Connected ✓' : 'Not Connected'}</span>
                  </p>
                  <button
                    type="button"
                    className={`rounded-md px-3 py-1.5 text-[12px] font-semibold ${
                      app.connected ? 'text-dash-live' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {app.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-dash-live bg-dash-card p-5">
            <p className="text-[16px] font-bold text-dash-live">Danger Zone</p>
            <p className="text-[12px] text-secondary">
              This action cannot be undone. All your predictions, points balance, and leaderboard history will be
              permanently deleted.
            </p>
            <button
              type="button"
              className="rounded-lg border border-dash-live py-2.5 text-[13px] font-bold text-dash-live"
            >
              Deactivate Account
            </button>
            <button type="button" className="text-[13px] font-semibold text-dash-live underline">
              Delete Account Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
