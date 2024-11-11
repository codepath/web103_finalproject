import '../../css/login-page.css';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    const navigate = useNavigate();

    const checkInformationAndLogin = () => {
        navigate("/");
    }

    return (
        <> 
            <div className='login-box-frame'>
                <div className="login-box">
                    <h1>Log in to your account</h1>

                    <div className='login-box-component'>
                        <label>
                            Email
                            <input className='login-input' type='email' placeholder='Enter your email here' required/>
                        </label>

                        <label>
                            Password
                            <input className='login-input' type='password' placeholder='Enter your password here' required/>
                        </label>

                        <button className='signin-button' onClick={() => checkInformationAndLogin()}>Log In</button>

                        <a href='#' onClick={() => navigate("/forgot-password")}><i>Forgot Password?</i></a>
                        <a href='#' onClick={() => navigate("/signup")}><i>Did not have account? Create a new account</i></a>
                    </div>

                    
                </div>
            </div>
        </>
    )

}

export default LoginPage;