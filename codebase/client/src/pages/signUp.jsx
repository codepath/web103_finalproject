import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';
import SignUpForm from '../components/signUpForm';
import DisplayVerificationMessage from '../components/displayVerificationMessage';

const SignUp = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user && user.emailVerified) {
        // Call your function to create an account
        const createAccount = async (email) => {
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: user.uid,
              email: email,
              first_name: '',
              last_name: '',
              address: '',
              city: '',
              state: '',
              zip: '',
              phone: ''
            })
          };
          await fetch('http://localhost:3001/api/users', options);
        };
        createAccount(user.email);
        console.log('User verified');
      }
    });
    return () => {
      // Unsubscribe from the auth state listener when the component unmounts
      unsubscribe();
    };
    
  }, []);

  if (user) {
    // If user is logged in, check for email verification
    if (user.emailVerified) {
      // Redirect to home page if email is verified
      return <Navigate to="/" />;
    } else {
      // Display message for unverified email
      return <DisplayVerificationMessage />;
    }
  } else {
    // If user is not logged in, show the sign-up form
    return <SignUpForm />;
  }
};

export default SignUp;
