import '../css/login-page.css';
import { useNavigate } from "react-router-dom";

const ForgotPasswordCheckEmail = () => {

    const navigate = useNavigate();

    const checkAccount = () => {
        navigate("/new-password");
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

                        <button className='signin-button' onClick={() => checkAccount()}>Confirm email</button>

                        <a href='#' onClick={() => navigate("/login")}><i>Back to Log in</i></a>
                    </div>

                    
                </div>
            </div>
        </>
    )

}

export default ForgotPasswordCheckEmail;