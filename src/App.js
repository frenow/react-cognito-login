import React, { useState } from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import amplify_config from './amplify-config';

import SignUpForm from './CognitoReactSignUpForm'
import SignInForm from './CognitoReactSignInForm';

Amplify.configure(amplify_config);

const App = () => {
  const[signUpIsActive, setSignUpIsActive] = useState(false);
  
  function toggleActivePage() {
    setSignUpIsActive(!signUpIsActive);
  }

    return (
      <div className="App">
        <h1>My React Cognito App with hooks</h1>
        <button className="btn btn-light btn-toggle" onClick={toggleActivePage}>
          { signUpIsActive ? "Ir para login" : "Ir para registro" }
        </button>
        { signUpIsActive ? <SignUpForm /> : <SignInForm /> }
      </div>
    );
  
}

export default App;
