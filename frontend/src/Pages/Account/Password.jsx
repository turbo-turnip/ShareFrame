import React, { useState } from 'react';
import { BACKEND_PATH, join } from '../../PATH';
import Popup from '../../Components/Popup';

const Password = ({ account }) => {
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);

    const updatePasswordHandler = async (newPassword) => {
        const password = window.prompt('Please enter your old user password', '');

        if (password) {
            const request = await fetch(join(BACKEND_PATH, "/account/updatePassword"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name,
                    newPassword,
                    password
                })
            });

            const response = await request.json();

            if (request.status !== 200) {
                setErrorPopup(response.message);
                setTimeout(() => setErrorPopup(false), 1 * 5000 + 200);
            } else {
                setSuccessPopup(response.message);
                localStorage.setItem("rt", response.rt);
                localStorage.setItem("at", response.at);
                setTimeout(() => {
                    setSuccessPopup(false);
                    document.location.reload();
                }, 1 * 5000 + 200);
            }
        }
    }

    return (
        <div className="input-field pfp">
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {successPopup && <Popup type="success" message={successPopup} />}
            <label>New Password</label>
            <div>
                <input type="text" />
                <button onClick={(e) => updatePasswordHandler(e.target.previousSibling.value)}>Update</button>
            </div>
        </div>
    );
}

export default Password;