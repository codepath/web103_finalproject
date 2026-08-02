import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../services/auth.js'
import githubimg from '../assets/githubimage.png'

const Login = () => {

  // const navigate = useNavigate()
  //
  // const signup = () => {
  //   navigate('/signup')
  // }

  return (
    <div>
      <h1 style={styles.appTitle}>EatRite</h1>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Login/Sign up</h1>

        <form style={styles.inForm}>

          {/* <div style={styles.inputBox}> */}
          {/*   <label htmlFor="name"> */}
          {/*     Email */}
          {/*   </label> */}
          {/*   <input  */}
          {/*     // id='name' */}
          {/*     // name='name' */}
          {/*     // type="text" */}
          {/*     // value={ingredient.name} */}
          {/*     // onChange={handleChange} */}
          {/*     style={styles.input} */}
          {/*   /> */}
          {/* </div> */}

          {/* <div style={styles.inputBox}> */}
          {/*   <label htmlFor="name"> */}
          {/*     Password  */}
          {/*   </label> */}
          {/*   <input  */}
          {/*     // id='name' */}
          {/*     // name='name' */}
          {/*     // type="text" */}
          {/*     // value={ingredient.name} */}
          {/*     // onChange={handleChange} */}
          {/*     style={styles.input} */}
          {/*   /> */}
          {/* </div> */}

          <div style={styles.inputBox}>
            <button 
              // type="submit"
              type="button"
              onClick={api.login}
              style={styles.btn2}
            >
              <img src={githubimg} style={styles.gitimg}/>
              Continue with Github
            </button>
          </div>

          {/* <button  */}
          {/*   type="button" */}
          {/*   onClick={() => { */}
          {/*     console.log("BUTTON CLICKED") */}
          {/*     api.login() */}
          {/*   }} */}
          {/*   style={styles.btn2} */}
          {/* > */}
          {/*   Login2 */}
          {/* </button> */}

          {/* <hr style={styles.hr}/> */}
          {/* <div style={styles.signupBox}> */}
          {/*   <p>Don't have an account?</p> */}
          {/*   <Link to="/about">signup</Link> */}
          {/* </div> */}


        </form>
      </div>
    </div>
  )
}

export default Login 

const styles = {
  gitimg:{
    height: '20px',
  },
  appTitle: {
    textAlign: 'center',
    fontSize: '50px',
    marginTop: '30px',
  },
  inForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  hr: {
    marginTop: '20px',
    marginBottom: '1px',
    width: '80%',
  },
  signupBox: {
    marginTop: '0px',
    display: 'block',
    textAlign: 'center'
  },
  title: {
    display: 'block',
    fontSize: '30px',
    margin: '0 auto',
  },
  formContainer: {
    width: '100%',
    border: 'solid black',
    borderWidth: '1px',
    backgroundColor: '#fafafa',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    fontWeight: 'bold',
    width: '40%',
    margin: '50px auto',
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    // border: 'solid black',
    width:'300px',
    margin: '0 auto',
  },
  input: {
    border: 'solid black',
    borderWidth: '1px',
    width: '290px',
    height: '30px',
    borderRadius: '5px',
  },
  btn2: {
    cursor: 'pointer',
    display: 'flex',
    gap: '10px',
    justifyContent:'center',
    // justifyContent:'space-between',
    padding: '0 30px',
    alignItems:'center',
    width: '300px',
    height: '50px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#333333',
    // padding: '20px',
    borderRadius: '5px',
    borderWidth: '1px',
    textDecoration: 'none',
    marginTop: '10px',
  },
}
