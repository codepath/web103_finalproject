import '../css/UserLogin.css';

const UserLogin = (props) => {
    // eslint-disable-next-line react/prop-types
    const AUTH_URL = `${props.api_url}/auth/github`
    return (
        <div className="Login">
            <center><a href={AUTH_URL}>
                <button className="headerBtn"> 🔒 Login via Github </button>
            </a></center>
        </div>  
    );
};

export default UserLogin;