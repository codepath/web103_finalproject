import { useEffect, useState } from 'react'
import '../css/nav-bar.css'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { getUserInfoById } from '../services/profileAPI'

import LoginRoundedIcon from '@mui/icons-material/LoginRounded'

const NavigationBar = ({ jwt, currentUserId }) => {
  const [loggedIn, setLoggedIn] = useState(true)
  const navigate = useNavigate()

  const [wantToShowMenu, setWantToShowMenu] = useState(false)
  const navigateToPage = (page) => {
    navigate(page)
    setWantToShowMenu(false)
  }

  const [userFullname, setUserFullname] = useState('')
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isErrorUser, setIsErrorUser] = useState(false)

  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is logged in

  const getAllUserDetail = async () => {
    try {
      const result = await getUserInfoById(currentUserId)
      // console.log(result);
      setUserFullname(result[0].full_name)
    } catch (err) {
      setIsErrorUser(true)
      console.error('Error fetching user details')
    } finally {
      setIsLoadingUser(false)
      setIsErrorUser(false)
    }
  }

  if (isAuthenticated) {
    getAllUserDetail();
  }

  useEffect(() => {
    if (isAuthenticated) {
      getAllUserDetail();
    }
  }, [currentUserId, isAuthenticated])


  const handleNavigateProfile = () => {
    if (jwt) {
      navigateToPage('/profile')
    } else {
      navigateToPage('/login')
    }
  }

  return (
    <>
      <div className="nav-bar">
        <div className="title-menu">
          <MenuIcon
            className="menu-icon"
            onClick={() => {
              setWantToShowMenu(true)
              console.log(wantToShowMenu)
            }}
          />
        </div>
        <h1 onClick={() => navigate('/')} className="title fascinate-regular">
          BOOKEZ
        </h1>

        <div className="nav-bar-logged-in-status">
          {!jwt ? (
            <div className="nav-bar-right-box">
              <button
                type="button"
                className="btn btn-light button-light"
                onClick={() => {
                  navigate('/login')
                  setLoggedIn(true)
                  console.log(loggedIn)
                }}
              >
                Log In
              </button>
              <button
                type="button"
                className="btn btn-info button-info"
                onClick={() => navigate('/signup')}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="nav-bar-right-box">
              <div className="nav-bar-profile-image-box">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHEJ-8GyKlZr5ZmEfRMmt5nR4tH_aP-crbgg&s"
                  className="nav-bar-profile-image-url"
                  alt="Profile"
                />
              </div>
              {isLoadingUser ? (
                <div className="nav-bar-username">Loading...</div>
              ) : isErrorUser ? (
                <div className="nav-bar-username">
                  <i>Error!</i>
                </div>
              ) : (
                <div
                  className="nav-bar-username"
                  onClick={() => {
                    setLoggedIn(false)
                    console.log(loggedIn)
                  }}
                >
                  {userFullname}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {wantToShowMenu && (
        <div className="hiddenSideTab">
          <div className="hp-sidemenu">
            <div className="sidemenu-title">
              <h1 className="fascinate-regular">BOOKEZ</h1>
            </div>
            <div
              className="page-on-hidden-tab"
              onClick={() => navigateToPage('/')}
            >
              Home Page
            </div>
            <div
              className="page-on-hidden-tab"
              onClick={() => handleNavigateProfile()}
            >
              My Profile
            </div>
            {jwt && (
              <div
                className="page-on-hidden-tab sd-info-icon logout-button"
                onClick={() => {
                  navigateToPage('/');
                  console.log('Logged out');
                  localStorage.removeItem('token')
                }}
              >
                Log out
                <LoginRoundedIcon />
              </div>
            )}
          </div>
          <div
            className="hp-menu-therest"
            onClick={() => {
              setWantToShowMenu(false)
              console.log(wantToShowMenu)
            }}
          ></div>
        </div>
      )}
    </>
  )
}

export default NavigationBar
