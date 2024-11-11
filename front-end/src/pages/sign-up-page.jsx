import '../css/signup-page.css';
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {

    const navigate = useNavigate();

    return (
        <> 
            <div className='signup-box-frame'>
                <div className="signup-box">
                    <h1>Create a new account</h1>

                    <div className='signup-box-component'>
                        <label>
                            Full Name
                            <input className='signup-input' type='text' placeholder='Enter your email here' required/>
                        </label>

                        <label>
                            Username
                            <input className='signup-input' type='text' placeholder='Enter your email here' required/>
                        </label>

                        <label>
                            Email
                            <input className='signup-input' type='email' placeholder='Enter your email here' required/>
                        </label>

                        <label>
                            Phone
                            <input className='signup-input' type='tel' placeholder='Enter your email here' required/>
                        </label>

                        <label>
                            Password
                            <input className='signup-input' type='password' placeholder='Enter your password here' required/>
                        </label>

                        <label>
                            Confirm Password
                            <input className='signup-input' type='password' placeholder='Enter your password here' required/>
                        </label>

                        <button className='signin-button'>Register</button>

                        <a href='#' onClick={() => navigate("/login")}><i>Already have account? Log in</i></a>
                    </div>

                    
                </div>
            </div>
        </>
    )

}

export default SignUpPage;