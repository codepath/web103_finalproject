import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'
import Menu from '../components/ProfileMenu.jsx'

function Nav ({ user }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const toggleMenu = () => {
    if (menuOpen == true) {
      setMenuOpen(false)
    } if (menuOpen == false) {
      setMenuOpen(true)
    }

    console.log(`menuOpen: ${menuOpen}`)
  }

  useEffect(() => {
    const closeMenu = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", closeMenu)

    return () => {
      document.removeEventListener("mousedown", closeMenu)
    }

  }, [])

  return (
    <div style={styles.nav}>
      <div style={styles.title}>EatRite</div>
      <div style={styles.btns}>
        <Link to="/home" style={styles.btn}><strong>Home</strong></Link>
        <Link to="/kitchen" style={styles.btn}><strong>My Kitchen</strong></Link>
        <Link to="/calendar" style={styles.btn}><strong>Calendar</strong></Link>
        {/* <Link to="/profile" style={styles.btn}><strong>Profile</strong></Link> */}
        <div 
          ref={menuRef}
          style={styles.profileContainer}>

          <button to="/profile" 
            style={{
              ...styles.profileBtn,
              backgroundImage: `url(${user.avatarurl})`
            }}
            onClick={() => toggleMenu()}
          >

          </button>
          {menuOpen && (
            <Menu user={user}></Menu>
          )}

        </div>
      </div>
    </div>
  );
}

export default Nav;

const styles = {
  profileImg: {
    // width: '50px'
  },
  nav: {
    // backgroundImage: `url(${navpattern})`,
    // backgroundColor: 'gray',
    display: 'flex',
    alignItems: 'center',
    border: 'solid black',
    borderWidth: '2px',
    justifyContent: 'space-between',
    height: '100px',
    gap: '10px',
    paddingRight: '10px',
    marginBottom: '5px',
  }, 
  btns: {
    display: 'flex',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',

  },
  profileBtn: {
    // backgroundColor: "#27F561",
    // backgroundImage: `url(${user.avatarurl})`,
    cursor: 'pointer',
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
    display: 'block',
    fontSize: '15px',
    color: 'black',
    border: 'solid black',
    padding: '20px',
    borderRadius: '5px',
    borderWidth: '1px',
    textDecoration: 'none',
    margin: '10px',
  },
  title: {
    fontSize: '40px',
    fontWeight: '700',
    color: 'black',
    margin: '5px',
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '10px',
  }

}
