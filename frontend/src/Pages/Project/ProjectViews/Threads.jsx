import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, join } from '../../../PATH';
import ThreadPopup from './ViewComponents/ThreadPopup';
import Popup from '../../../Components/Popup';

const Threads = ({ error, project, owner, loggedIn, account }) => {
    const [ newThreadPopup, setNewThreadPopup ] = useState(false);
    const [ threads, setThreads ] = useState(project && project.threads ? project.threads : []);
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ errorPopup, setErrorPopup ] = useState(false);

    const newThreadHandler = async (e) => {
        const [ subject, description ] = e.target.querySelectorAll("input");

        const password = prompt('Please enter your user password', '');

        const request = await fetch(join(BACKEND_PATH, "/project/createThread"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subject: subject.value, 
                desc: description.value,
                username: account.user_name,
                pfp: account.pfp,
                projectCreator: project.user_name,
                password,
                title: project.project_title
            })
        });

        const response = await request.json();

        if (request.status !== 201) {
            setErrorPopup(response.message);
            setNewThreadPopup(false);
            setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
        } else {
            setSuccessPopup(response.message);
            setNewThreadPopup(false);
            setTimeout(() => setSuccessPopup(false), 5000 * 1 + 200);
            setThreads(response.threads);
        }
    }

    useEffect(() => {
        if (project) 
            if (project.threads)
                setThreads(project.threads);
    }, [ project ]);

    useEffect(() => console.log(threads), [ threads ]);

    return (
        <div className="project-threads">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {newThreadPopup && <ThreadPopup closeHandler={() => setNewThreadPopup(false)} submitHandler={newThreadHandler} />}
            {error && <h1 className="url-error">{error}</h1>}
            {!error && 
                <React.Fragment>
                    <h1>Threads{loggedIn && <button onClick={() => setNewThreadPopup(true)}>Create New</button>}</h1>
                    {threads.length !== 0 ? threads.map(thread =>
                        <div className="thread-preview">
                            <h4 data-date-created={thread.date_created}>{thread.subject}</h4>
                            <p>{thread.desc}</p>
                            <div className="bottom">
                                <span>Members ({thread.members})</span>
                                <span>Messages ({thread.messages})</span>
                            </div>
                        </div>
                    ) : <h1 className="no-threads-message">This is where threads will appear!</h1>}
                </React.Fragment>}
        </div>
    );
}

export default Threads;