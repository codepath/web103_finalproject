import '../css/login-page.css';
import { useNavigate } from "react-router-dom";

const ForgotPasswordNewPassword = () => {

    const navigate = useNavigate();

    const confirmNewPassword = () => {
        navigate("/login");
    }

    return (
        <> 
            <div className='login-box-frame'>
                <div className="login-box">
                    <h1>Enter your new password</h1>

                    <div className='login-box-component'>

                        <label>
                            Enter your new password
                            <input className='login-input' type='password' placeholder='Enter your password here' required/>
                        </label>

                        <label>
                            Confirm new Password
                            <input className='login-input' type='password' placeholder='Enter your password here' required/>
                        </label>

                        <button className='signin-button' onClick={() => confirmNewPassword()}>Confirm password</button>

                        {/* <a href='#' onClick={() => navigate("/login")}><i>Back to Log in</i></a> */}
                    </div>

                    
                </div>
            </div>
        </>
    )

}

export default ForgotPasswordNewPassword;