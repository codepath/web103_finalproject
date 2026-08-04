import { useState } from 'react'
import { Link } from 'react-router-dom';
import logoutimg from '../assets/log-out.svg'
import userimg from '../assets/home-user.svg'
import auth from '../services/auth.js'

const ProfileMenu = ({ user }) => {

  return (
    <div style={styles.menuContainer}>
      <div style={styles.profileInfo}>
        <img
          style={{
            ...styles.profileImg,
            backgroundImage: `url(${user.avatarurl})`
          }}
        />
        <p>{user.username}</p>
      </div>

      <Link to="/profile" style={styles.btn}>
        <img src={userimg}/>
        <strong>Profile</strong>
      </Link>
      <button 
        style={styles.logoutBtn}
        onClick={auth.logout}
      >
        <img src={logoutimg}/>
        <strong>Logout</strong>
      </button>
    </div>
  )
}

export default ProfileMenu

const styles = {
  profileInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: '55px',
    right: '12px',
    zIndex: '1000',
    border: 'solid black',
    borderRadius: '10px',
    borderWidth: '1px',
    backgroundColor: 'white',
    height: '230px',
    width: '150px',
  },
  profileImg: {
    // backgroundColor: "#27F561",
    // backgroundImage: `url(${user.avatarurl})`,
    // cursor: 'pointer',
    display: 'block',
    width: '4px',
    height: '4px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontSize: '15px',
    color: 'black',
    border: 'solid gray',
    padding: '20px',
    borderRadius: '50px',
    borderWidth: '0.1px',
    textDecoration: 'none',
    margin: '10px',
  },
  btn: {
    // backgroundColor: "#27F561",
    // display: 'block',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '15px',
    color: 'black',
    border: 'solid black',
    padding: '20px',
    borderRadius: '5px',
    borderWidth: '1px',
    textDecoration: 'none',
    margin: '10px',
  },
  logoutBtn: {
    // backgroundColor: "#27F561",
    // display: 'block',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '15px',
    color: 'black',
    border: 'solid black',
    padding: '20px',
    width: '130px',
    borderRadius: '5px',
    borderWidth: '1px',
    textDecoration: 'none',
    margin: '10px',
  },
}
