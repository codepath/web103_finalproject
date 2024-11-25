import { useEffect, useState } from 'react'
import '../../css/profile-page.css'
import IncomingAppointments from './incoming-appointment'
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getUserInfoById, submitEdittedInfo } from '../../services/profileAPI'

const ProfilePage = ({ currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isErrorUser, setIsErrorUser] = useState(false)

  const [userUsername, setUserUsername] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhoneNumber, setUserPhoneNumber] = useState('')
  const [userFullname, setUserFullname] = useState('')

  const [editedUserUsername, setEditedUserUsername] = useState('')
  const [editedUserEmail, setEditedUserEmail] = useState('')
  const [editedUserPhoneNumber, setEditedUserPhoneNumber] = useState('')
  const [editedUserFullname, setEditedUserFullname] = useState('')

  const [numberOfAppointment, setNumberOfAppointment] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const getAllUserDetail = async () => {
      try {
        const result = await getUserInfoById(currentUserId)
        setUserUsername(result[0].username)
        setUserFullname(result[0].full_name)
        setUserEmail(result[0].email)
        setUserPhoneNumber(result[0].phone_number)
      } catch (err) {
        console.error('Error fetching user details')
        setIsErrorUser(true)
      } finally {
        setIsLoadingUser(false)
      }
    }

    if (currentUserId) {
      getAllUserDetail()
    }
  }, [currentUserId]) // Fix: Include currentUserId in dependency array

  const startEditing = () => {
    setIsEditing(true)
    setEditedUserUsername(userUsername)
    setEditedUserEmail(userEmail)
    setEditedUserPhoneNumber(userPhoneNumber)
    setEditedUserFullname(userFullname)
  }

  const saveEditInfo = async () => {
    const userInfoBody = {
      username: editedUserUsername,
      email: editedUserEmail,
      full_name: editedUserFullname,
      phone_number: editedUserPhoneNumber,
    }

    try {
      await submitEdittedInfo(currentUserId, userInfoBody)
    } catch (err) {
      console.error('Fail saving updated user info')
    } finally {
      setIsEditing(false)
      setUserUsername(editedUserUsername)
      setUserEmail(editedUserEmail)
      setUserPhoneNumber(editedUserPhoneNumber)
      setUserFullname(editedUserFullname)
    }
  }

  const cancelSave = () => {
    setIsEditing(false)
    setEditedUserUsername(userUsername)
    setEditedUserEmail(userEmail)
    setEditedUserPhoneNumber(userPhoneNumber)
    setEditedUserFullname(userFullname)
  }

  const handleDataFromChild = (data) => {
    setNumberOfAppointment(data)
  }

  return (
    <>
      {isLoadingUser ? (
        <h1>Loading...</h1>
      ) : isErrorUser ? (
        <h1>Fail loading user details...</h1>
      ) : (
        <>
          <h1 className="profile-page-title">My Profile</h1>
          {/* Username */}
          <div className="profile-page-username">
            {isEditing ? (
              <div className="profile-page-all-details-frame edit-username">
                <h3>Edit Username</h3>
                <div className="profile-details">
                  <input
                    className="input-box-username"
                    type="text"
                    value={editedUserUsername}
                    onChange={(e) => setEditedUserUsername(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <h1>{userUsername}</h1>
            )}
          </div>

          {!isEditing ? (
            <div className="save-edit-cancel-button-group">
              <button
                className="pp-edit-button button-info"
                onClick={startEditing}
              >
                Edit
                <BorderColorRoundedIcon />
              </button>
            </div>
          ) : (
            <div className="save-edit-cancel-button-group">
              <button
                className="pp-edit-button button-info-save"
                onClick={saveEditInfo}
              >
                Save
                <SaveRoundedIcon />
              </button>
              <button
                className="pp-edit-button button-info-cancel"
                onClick={cancelSave}
              >
                Cancel
                <CloseRoundedIcon />
              </button>
            </div>
          )}

          {isEditing ? (
            <div className="profile-page-all-details">
              <div className="profile-page-all-details-frame">
                <h3>Edit Your Full Name</h3>
                <div className="profile-details">
                  <input
                    className="input-box"
                    type="text"
                    value={editedUserFullname}
                    onChange={(e) => setEditedUserFullname(e.target.value)}
                  />
                </div>
              </div>
              <div className="profile-page-all-details-frame">
                <h3>Edit Your Email</h3>
                <div className="profile-details">
                  <input
                    className="input-box"
                    type="text"
                    value={editedUserEmail}
                    onChange={(e) => setEditedUserEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="profile-page-all-details-frame">
                <h3>Edit Your Phone Number</h3>
                <div className="profile-details">
                  <input
                    className="input-box"
                    type="text"
                    value={editedUserPhoneNumber}
                    onChange={(e) => setEditedUserPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="profile-page-all-details">
              <div className="profile-page-all-details-frame">
                <h3>Full Name</h3>
                <div className="profile-details">
                  <h4>{userFullname}</h4>
                </div>
              </div>
              <div className="profile-page-all-details-frame">
                <h3>Email</h3>
                <div className="profile-details">
                  <h4>{userEmail}</h4>
                </div>
              </div>
              <div className="profile-page-all-details-frame">
                <h3>Phone Number</h3>
                <div className="profile-details">
                  <h4>{userPhoneNumber}</h4>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="profile-page-incoming-appointment">
        <h1>
          Upcoming Appointment
          {numberOfAppointment > 0 && (
            <span>
              <Button
                variant="outlined"
                sx={{ m: 1 }}
                onClick={() => navigate('/#salon')}
              >
                Add More Appointment
              </Button>
            </span>
          )}
        </h1>

        <div className="pp-list-of-appointments">
          <IncomingAppointments
            currentUserId={currentUserId}
            onDataChange={handleDataFromChild}
          />
        </div>
      </div>
    </>
  )
}

export default ProfilePage
