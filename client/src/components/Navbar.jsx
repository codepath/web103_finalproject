import { Link } from "react-router-dom";
import '../styles/Navbar.css'

const Navbar = () => {
    return (
        <>
            <div className="header-container">
                <div className="header-left">
                    <Link to="/"><button id="homeBtn" >Home</button></Link>
                    <Link to="/browse"><button id="browseBtn" >Browse</button></Link>
                </div>
                <div className="header-right">
                    <Link to="/signin"><button>Sign In</button></Link>
                </div>
            </div>
        </>
    )
}

export default Navbar