import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <div>
                <Link to="/"><button>Home</button></Link>
                <Link to="/browse"><button>Browse</button></Link>
                <Link to="/signin"><button>Sign In</button></Link>
            </div>
        </>
    )
}

export default Navbar