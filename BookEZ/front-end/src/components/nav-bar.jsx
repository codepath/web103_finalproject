import { useState } from "react";
import '../css/nav-bar.css'
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';

const NavigationBar = () => {

    const [loggedIn, setLoggedIn] = useState(true);
    const navigate = useNavigate();

    const [wantToShowMenu, setWantToShowMenu] = useState(false);
    const navigateToPage = (page) => {
        navigate(page);
        setWantToShowMenu(false);
    }

    return (
        <> 
            <div className="nav-bar">
                <div className="title-menu">
                    <MenuIcon className="menu-icon" onClick={() => {setWantToShowMenu(true); console.log(wantToShowMenu)}} />
                </div>
                <h1 onClick={() => navigate("/")} className="title">BOOKEZ</h1>

                <div className="nav-bar-logged-in-status">
                    {
                        !loggedIn 
                        ?
                            <div className="nav-bar-right-box">
                                <button type="button" className="btn btn-light button-light" onClick={() => {navigate("/login"); setLoggedIn(true); console.log(loggedIn)}}>Log In</button>
                                <button type="button" className="btn btn-info button-info" onClick={() => navigate("/signup")}>Register</button>
                            </div>
                        :
                            <div className="nav-bar-right-box">
                                <div className="nav-bar-profile-image-box">
                                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHEJ-8GyKlZr5ZmEfRMmt5nR4tH_aP-crbgg&s' className="nav-bar-profile-image-url" alt="Profile" />
                                </div>
                                <div className="nav-bar-username" onClick={() => {setLoggedIn(false); console.log(loggedIn)}}>
                                    Drake Do
                                </div>
                            </div>
                    }
                </div>
            </div>

            {wantToShowMenu && 
                <div className="hiddenSideTab">
                    <div className="hp-sidemenu">
                        <div className="sidemenu-title">
                            <h1>BOOKEZ</h1>
                        </div>
                        <div className="page-on-hidden-tab" onClick={() => navigateToPage("/")}>Home Page</div>
                        <div className="page-on-hidden-tab" onClick={() => navigateToPage("/profile")}>My Profile</div>
                    </div>
                    <div className="hp-menu-therest"  onClick={() => {setWantToShowMenu(false); console.log(wantToShowMenu)}}>

                    </div>
                </div>
            }
        </>
    )
}

export default NavigationBar;