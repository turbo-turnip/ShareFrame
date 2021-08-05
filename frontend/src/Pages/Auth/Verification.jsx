import React, { useEffect } from 'react';
import { BACKEND_PATH, join } from '../../PATH';

const Verification = ({ email, username }) => {
    const sendEmail = async () => {
        const request = await fetch(join(BACKEND_PATH, "/auth/verificationEmail"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });
        const response = await request.json();

        console.log(request.status);
    }

    useEffect(sendEmail, []);
    
    return (
        <div className="verification-page">
            <div className="verify">
                <h2>One last step!</h2>
                <p>To finish registering your ShareFrame account, you have to verify it!</p>
                <p>This step is just to make sure the account is owned by you.</p>
                <p><b>Please check your email ({email}) and follow the steps to verify your account in an email we sent you.</b></p>
                <button onClick={sendEmail}>Don't see the email? Resend</button>
            </div>
        </div>
    );
}

export default Verification;