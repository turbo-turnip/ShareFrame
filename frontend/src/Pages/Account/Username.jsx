import React, { useState } from 'react';
import { BACKEND_PATH, join } from '../../PATH';
import Popup from '../../Components/Popup';

const Username = ({ account }) => {
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);

    const updateUsernameHandler = async (newUsername) => {
        const password = window.prompt('Please enter your user password', '');

        if (password) {
            const request = await fetch(join(BACKEND_PATH, "/account/updateUsername"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name,
                    newUsername,
                    password
                })
            });

            const response = await request.json();

            if (request.status !== 200) {
                setErrorPopup(response.message);
                setTimeout(() => setErrorPopup(false), 1 * 5000 + 200);
            } else {
                setSuccessPopup(response.message);
                setTimeout(() => {
                    setSuccessPopup(false);
                    document.location.reload();
                }, 1 * 5000 + 200);
            }
        }
    }

    return (
        <div className="input-field">
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {successPopup && <Popup type="success" message={successPopup} />}
            <label>Username</label>
            <div>
                <input type="text" defaultValue={account.user_name} />
                <button onClick={e => updateUsernameHandler(e.target.previousSibling.value)}>Update</button>
            </div>
        </div>
    );
}

export default Username;