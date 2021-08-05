import React, { useState } from 'react';
import Form from '../Form';
import { BACKEND_PATH, join } from '../../../PATH';
import Popup from '../../../Components/Popup';

const Register = () => {
    const [ showPopup, setShowPopup ] = useState(false);
    const [ popupMessage, setPopupMessage ] = useState();
    const [ popupType, setPopupType ] = useState();

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
                setShowPopup(false);
            }, 5 * 1000 + 200);
        }
    }

    return (
        <div className="auth-page">
            {showPopup && <Popup message={popupMessage} type={popupType} />}
            <h1>Register</h1>
            <Form type="register" submitHandler={submitHandler} />
        </div>
    );
}

export default Register;