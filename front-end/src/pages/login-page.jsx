import '../css/login-page.css';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    const navigate = useNavigate();

    return (
        <> 
            <div className='login-box-frame'>
                <div className="login-box">
                    <h1>Log in here</h1>

                    <div className='login-box-component'>
                        <label>
                            Email
                            <input className='login-input' type='email' placeholder='Enter your email here' required/>
                        </label>

                        <label>
                            Password
                            <input className='login-input' type='password' placeholder='Enter your password here' required/>
                        </label>

                        <button className='signin-button'>Log In</button>

                        <a href='#' onClick={() => navigate("/signup")}><i>Forgot Password?</i></a>
                    </div>

                    
                </div>
            </div>
        </>
    )

}

export default LoginPage;