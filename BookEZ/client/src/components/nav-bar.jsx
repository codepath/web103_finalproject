import { useState } from "react";
import '../css/nav-bar.css'
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {

    const [loggedIn, setLoggedIn] = useState(true);
    const navigate = useNavigate();

    return (
        <> 
            <div className="nav-bar">
                <h1 onClick={() => navigate("/")}>BOOKEZ</h1>

                <div className="nav-bar-logged-in-status">
                    {
                        !loggedIn 
                        ?
                            <div className="nav-bar-right-box">
                                <button type="button" class="btn btn-light button-light" onClick={() => {navigate("/login"); setLoggedIn(true); console.log(loggedIn)}}>Log In</button>
                                <button type="button" class="btn btn-info button-info" onClick={() => navigate("/signup")}>Register</button>
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
        </>
    )
}

export default NavigationBar;