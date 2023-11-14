import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const DisplayVerificationMessage = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      <p className='emailVerification'>Verification link sent, please verify email</p>
    </div>
  );
};

export default DisplayVerificationMessage;
