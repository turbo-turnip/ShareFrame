import React, { useState } from 'react';
import { join, BACKEND_PATH } from '../../PATH';
import Popup from '../../Components/Popup';

const toBase64 = (file) => {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result);
    });
}

const convertFilesToBase64 = (files) => {
	return new Promise((res) => {
		const base64 = [];
		Object.keys(files).forEach(async (_, i) => {
			const output = await toBase64(files[i]);
			base64.push(output);
			if (i + 1 === Object.keys(files).length)
				res(base64);
		});
	});
}

const Profile = ({ account }) => {
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);

    const updatePfpHandler = async (input) => {
        const password = window.prompt('Please enter your user password', '');

        if (password && Object.keys(input.files).length > 0) {
            let newPfp = await convertFilesToBase64(input.files);
            newPfp = newPfp[0];

            const request = await fetch(join(BACKEND_PATH, "/account/updatePfp"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name,
                    newPfp,
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
        <div className="input-field pfp">
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {successPopup && <Popup type="success" message={successPopup} />}
            <label>Profile Picture</label>
            <div>
                <img src={account.pfp} alt={account.user_name} />
                <input type="file" multiple={false} />
                <button onClick={e => updatePfpHandler(e.target.previousSibling)}>Update</button>
            </div>
        </div>
    );
}

export default Profile;