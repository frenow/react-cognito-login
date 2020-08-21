import React, { useState, useEffect } from 'react';
import { Auth, Cache } from 'aws-amplify';

const CognitoReactSignInForm = () => {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[signedIn, setSignedIn] = useState(false);
    const[isSigningIn, setIsSigningIn] = useState(false);
    const[isSigningOut, setIsSigningOut] = useState(false);
    const[tokenId, setTokenId] = useState('');
    const[refreshToken, setRefreshToken] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!signedIn) {
            setIsSigningIn(true);
            
            Auth.signIn({
                username,
                password
            }).then((cognitoUser) => {
                console.log('Signed In!');
                console.log("CognitoUser:");
                console.log(cognitoUser);

                Auth.currentSession()
                .then((userSession) => {
                    console.log("Got user currentSession:");
                    console.log(userSession);
                    setSignedIn(true);
                    setIsSigningIn(false);
                    setTokenId(userSession.idToken.jwtToken);
                    setRefreshToken(userSession.refreshToken.token);
                })
                .catch((err) => {
                    setIsSigningIn(false);
                    console.log(err)
                });

            }).catch((err) => {
                setIsSigningIn(false);
                console.log(err)
            });
        }
    }

    function changeAuthStorageConfiguration(e) {
        const shouldRememberUser = e.target.checked;
        if (shouldRememberUser) {
            const localStorageCache = Cache.createInstance({
                keyPrefix: "localStorageAuthCache",
                storage: window.localStorage
            });
            Auth.configure({
                storage: localStorageCache
            });
        } else {
            const sessionStorageCache = Cache.createInstance({
                keyPrefix: "sessionAuthCache",
                storage: window.sessionStorage
            });
            Auth.configure({
                storage: sessionStorageCache
            });
        }
    }

    function handleLogout() {
        if (signedIn) {
            setIsSigningOut(true);
            Auth.signOut()
                .then((data) => {
                    setSignedIn(false);
                    setIsSigningOut(false);
                    setTokenId('');
                    setRefreshToken('');

                    console.log(data);
                })
                .catch((err) => {
                    setIsSigningOut(false);
                    console.log(err);
                });
        }
    }

    useEffect(() => {
        setIsSigningIn(true);
        Auth.currentSession()
            .then((userSession) => {
                console.log("Got user currentSession!");
                console.log(userSession);
                setSignedIn(true);
                setIsSigningIn(false);
                setTokenId(userSession.idToken.jwtToken);
                setRefreshToken(userSession.refreshToken.token);
            })
            .catch((err) => {
                setIsSigningIn(false);
                console.log(err)
            });            
    }, []);   
    
        if (tokenId) {
            return (<>
                <div><b>Your tokenId:</b></div><div>{tokenId}</div>
                <div><b>Your refreshToken:</b></div><div>{refreshToken}</div>
                <button className="btn-toggle" onClick={handleLogout} className="btn btn-danger">Sair</button>
            </>)
        }

        return (<>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="usernameSignInInput">Username</label>
                <input className="form-control" type="text" name="username" id="usernameSignInInput" onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="passwordSignInInput">Senha</label>
                <input className="form-control" type="password" name="password" id="passwordSignInInput" onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group form-check">
                <input defaultChecked type="checkbox" className="form-check-input" id="rememberMeSignInInput" onChange={changeAuthStorageConfiguration} />
                <label className="form-check-label" htmlFor="rememberMeSignInInput">Lembrar-se de mim</label>
            </div>
            <button disabled={isSigningIn} type="submit" className="btn btn-primary">Entrar</button>
        </form>
        </>)
}

export default CognitoReactSignInForm;
