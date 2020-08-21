import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

const CognitoReactSignInForm = () => {
    const[signedUp, setSignedUp] = useState(false);
    const[confirmed, setConfirmed] = useState(false);
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[email, setEmail] = useState('');
    const[phoneNumber, setPhoneNumber] = useState('');
    const[confirmationCode, setConfirmationCode] = useState('');
    const[submittingSignUp, setSubmittingSignUp] = useState(false);
    const[submittingConfirmation, setSubmittingConfirmation] = useState(false);
    
    function handleSubmitSignUp(e) {
        e.preventDefault(e);
        
        if(!confirmed && !signedUp) {
            setSubmittingSignUp(true);

            Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    phone_number: phoneNumber
                }
            })
            .then(() => {
                setSignedUp(true);
                setSubmittingSignUp(false);
               
            })
            .catch(err => {
                setSubmittingSignUp(false);
                 console.log(err);
            });
        }
    }

    function handleSubmitConfirmationSignUp(e) {
        e.preventDefault(e);

        if (!confirmed && signedUp) {
            setSubmittingConfirmation(true);

            Auth
            .confirmSignUp(username, confirmationCode)
            .then(() => {
                setSubmittingConfirmation(false);
                setConfirmed(true);
            })
            .catch((err) => {
                setSubmittingConfirmation(false);
                console.log(err);
            });
            
        }
    }

        if (confirmed) {
            return <div></div>
        }

        if (signedUp) {
            return (
                <form onSubmit={handleSubmitConfirmationSignUp}>
                    <div className="form-group">
                        <label htmlFor="usernameConfirmationInput">Username</label>
                        <input className="form-control" type="text" name="username" id="usernameConfirmationInput" onChange={e => setSubmittingConfirmation(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="codeConfirmationInput">Código de confirmação</label>
                        <input className="form-control" type="text" name="confirmationCode" id="codeConfirmationInput" onChange={e => setConfirmationCode(e.target.value)} />
                    </div>
                    <button disabled={submittingConfirmation} type="submit" className="btn btn-primary">Confirmar</button>
                </form>
            )
        }

        return (
            <form onSubmit={handleSubmitSignUp}>
                <div className="form-group">
                    <label htmlFor="usernameSignUpInput">Username</label>
                    <input className="form-control" type="text" name="username" id="usernameSignUpInput" onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="emailSignUpInput">E-mail</label>
                    <input className="form-control" type="email" name="email" id="emailSignUpInput" onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneSignUpInput">Número de telefone</label>
                    <input className="form-control" type="text" name="phoneNumber" id="phoneSignUpInput" onChange={e => setPhoneNumber(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordSignUpInput">Senha</label>
                    <input className="form-control" type="password" name="password" id="passwordSignUpInput" onChange={e => setPassword(e.target.value)} />
                </div>
                <button disabled={submittingSignUp} type="submit" className="btn btn-primary">Cadastrar</button>
            </form>
        )
}

export default CognitoReactSignInForm;