import React, { useState } from 'react';
import { useFirebase } from '../context/firebase';

const Auth = () => {
    const firebase = useFirebase();
    const [isSignup, setIsSignup] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignup) {
                const cred = await firebase.signupUserWithEmailAndPassword(email, password);
                const displayName = name.trim() || email.split('@')[0];
                await firebase.updateUserProfileInfo(cred.user, {
                    displayName,
                    photoURL: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(displayName)}`
                });
                await firebase.ensureUserDoc(cred.user);
            } else {
                const cred = await firebase.loginUserWithEmailAndPassword(email, password);
                await firebase.ensureUserDoc(cred.user);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const cred = await firebase.signinWithGoogle();
            await firebase.ensureUserDoc(cred.user);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="auth card">
            <div className="logo" style={{ marginBottom: '12px' }}><span className="dot"></span> <span>Chatter</span></div>
            <h2>{isSignup ? 'Create account' : 'Welcome back'}</h2>
            <form onSubmit={handleSubmit}>
                {isSignup && (
                    <div className="group">
                        <label>Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" />
                    </div>
                )}
                <div className="group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@chatter.app" required autoComplete="email" />
                </div>
                <div className="group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        required 
                        autoComplete={isSignup ? "new-password" : "current-password"} // <-- The change is here
                    />
                </div>
                <div className="group">
                    <button type="submit" className="btn primary full">{isSignup ? 'Sign up' : 'Sign in'}</button>
                </div>
            </form>
            <div className="group">
                <button className="btn full" onClick={handleGoogleSignIn}>Continue with Google</button>
            </div>
            <div className="switch">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(!isSignup); }}>
                    {isSignup ? ' Sign in' : ' Create one'}
                </a>
            </div>
        </div>
    );
};

export default Auth;