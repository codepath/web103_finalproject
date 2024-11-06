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
                        loggedIn 
                        ?
                            <div className="nav-bar-right-box">
                                <button type="button" className="btn btn-light" onClick={() => navigate("/login")}>Log In</button>
                                <button type="button" className="btn btn-info" onClick={() => navigate("/signup")}>Sign Up</button>
                            </div>
                        :
                            <div className="nav-bar-right-box">
                                <div className="nav-bar-profile-image-box">
                                    <img src='../../data/profile_sample_image.jpg' className="nav-bar-profile-image-url" alt="Profile" />
                                </div>
                                <div className="nav-bar-username">
                                    Drake Do=
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default NavigationBar;