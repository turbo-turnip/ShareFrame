import React, { useEffect, useState } from 'react';
import { BACKEND_PATH, join } from '../../PATH';

const encryptedUsername = window.location.href.split('/')[4];
const encryptedEmail = window.location.href.split('/')[5];

const Verify = () => {
    const [ verified, setVerified ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState();

    const verify = async (password) => {
        setLoading(true);

        const request = await fetch(join(BACKEND_PATH, "/auth/verify"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                encryptedUsername,
                encryptedEmail,
                password
            })
        });

        const response = await request.json();

        if (request.status === 200) {
            localStorage.setItem("at", response.at);
            localStorage.setItem("rt", response.rt);
            setVerified(true);
            setLoading(false);
        } else {
            setVerified(false);
            setError(response.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        const password = window.prompt('Please enter your account\'s password');
        verify(password);
    }, []);

    return (
        <div className="verify-page">
            <div className="verify">
                {loading && <h1>Loading...</h1>}
                {error && 
                    <React.Fragment>
                        <h1>Something went wrong</h1>
                        <p>Sorry, something went wrong when we tried to verify your account.</p>
                        <p><b>Error Message: </b>{error}</p>
                        <button onClick={verify}>Try again</button>
                    </React.Fragment>}
                {(!error && verified) &&
                    <React.Fragment>
                        <h1>You are now verified!</h1>    
                        <p>Your ShareFrame account is now verified!</p>
                    </React.Fragment>}
            </div>
        </div>
    );
}

export default Verify;