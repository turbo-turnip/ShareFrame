import React, { useEffect, useState } from 'react';
import Form from '../Form';
import { BACKEND_PATH, join } from '../../../PATH';
import Popup from '../../../Components/Popup';
import Verification from '../Verification';

const Register = () => {
    const [ showPopup, setShowPopup ] = useState(false);
    const [ popupMessage, setPopupMessage ] = useState();
    const [ popupType, setPopupType ] = useState();
    const [ verification, setVerification ] = useState(false);
    const [ registeredEmail, setRegisteredEmail ] = useState();
    const [ registeredUsername, setRegisteredUsername ] = useState();

    const submitHandler = async (e) => {
        const [ name, email, password ] = e.target.querySelectorAll("input");

        const request = await fetch(join(BACKEND_PATH, "/auth/register"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: name.value,
                email: email.value,
                password: password.value
            })
        });
        const response = await request.json();

        if (request.status !== 201) {
            setShowPopup(true);
            setPopupMessage(response.message);
            setPopupType("error");

            setTimeout(() => {
                setShowPopup(false);
            }, 5 * 1000 + 200);
        } else {
            setShowPopup(true);
            setPopupMessage(response.message);
            setPopupType("success");

            setTimeout(() => {
                localStorage.setItem("unverified", true);
                localStorage.setItem("email", email.value);
                localStorage.setItem("username", name.value);
                setRegisteredEmail(email.value);
                setRegisteredUsername(name.value);
                setShowPopup(false);
            }, 5 * 1000 + 200);
        }
    }

    useEffect(() => {
        if (localStorage.hasOwnProperty('unverified') && localStorage.getItem("unverified")) {
            setVerification(true);
            setRegisteredEmail(localStorage.getItem("email"));
            setRegisteredUsername(localStorage.getItem("username"));
        }
    }, [ showPopup ]);

    return (
        <React.Fragment>
            {!verification ?
                <div className="auth-page">
                    {showPopup && <Popup message={popupMessage} type={popupType} />}
                    <h1>Register</h1>
                    <Form type="register" submitHandler={submitHandler} />
                </div>
                :
                <Verification email={registeredEmail} username={registeredUsername} />}
        </React.Fragment>
    );
}

export default Register;