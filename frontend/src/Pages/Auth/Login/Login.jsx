import React, { useState } from 'react';
import Form from '../Form';
import { BACKEND_PATH, join } from '../../../PATH';
import Popup from '../../../Components/Popup';
import { Redirect } from 'react-router-dom';

const Register = () => {
    const [ showPopup, setShowPopup ] = useState(false);
    const [ popupMessage, setPopupMessage ] = useState();
    const [ popupType, setPopupType ] = useState();
    const [ loggedIn, setLoggedIn ] = useState(false);

    const submitHandler = async (e) => {
        const [ name, password ] = e.target.querySelectorAll("input");

        const request = await fetch(join(BACKEND_PATH, "/auth/login"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: name.value,
                password: password.value
            })
        });
        const response = await request.json();

        if (request.status !== 200) {
            setShowPopup(true);
            setPopupMessage(response.message);
            setPopupType("error");

            setTimeout(() => {
                setShowPopup(false);
            }, 5 * 1000 + 200);
        } else {
            localStorage.setItem("at", response.at);
            localStorage.setItem("rt", response.rt);

            setShowPopup(true);
            setPopupMessage(response.message);
            setPopupType("success");

            setTimeout(() => {
                setShowPopup(false);
                setLoggedIn(true);
            }, 5 * 1000 + 200);
        }
    }

    return (
        <div className="auth-page">
            {showPopup && <Popup message={popupMessage} type={popupType} />}
            {loggedIn && <Redirect to="/" />}
            <h1>Login</h1>
            <Form type="login" submitHandler={submitHandler} />
        </div>
    );
}

export default Register;