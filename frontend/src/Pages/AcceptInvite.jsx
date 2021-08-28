import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, join } from '../PATH';

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

const AcceptInvite = () => {
    const [ error, setError ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const addUser = async (projectTitle, owner, addedUser, password) => {
        const request = await fetch(join(BACKEND_PATH, "/project/acceptInvite"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                password, 
                addedUser, 
                owner, 
                projectTitle 
            })
        });

        const response = await request.json();

        if (response.status !== 200) {
            setError(response.message);
        } else setSuccess(response.message);
    }

    useEffect(() => {
        if (searchParams.has("project") && searchParams.has("owner") && searchParams.has("addeduser")) {
            const password = prompt('Please enter your user password.', '');

            addUser(searchParams.get("project"), searchParams.get("owner"), searchParams.get("addeduser"), password);
        } else setError("Invite link invalid");
    }, []);

    return (
        <div className="accept-invite">
            {error && <h1 className="url-error">{error}</h1>}
            {success && <h1 className="success">{success}</h1>}
        </div>
    );
}

export default AcceptInvite;