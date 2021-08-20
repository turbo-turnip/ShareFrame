import React, { useState } from 'react';
import AnnouncementPopup from './AnnouncementPopup';
import Announcement from './Announcement';
import { BACKEND_PATH, join } from '../../../../PATH';
import Popup from '../../../../Components/Popup';

const ProjectPane = ({ project, owner, loggedIn, account, setCurrView }) => {
    const [ newProjectPopup, setNewProjectPopup ] = useState(false);
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);

    const announcementSubmitHandler = async (e) => {
        const [ version, title, type, announcement ] = e.target.parentElement.querySelectorAll("input, select");

        const request = await fetch(join(BACKEND_PATH, "/project/createAnnouncement"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: account.user_name,
                name: project.project_title,
                version: version.value,
                type: type.value,
                title: title.value,
                content: announcement.value,
                pfp: account.pfp,
                allowThreads: project.allow_threads
            })
        });

        const response = await request.json();

        if (request.status !== 201) {
            setErrorPopup(response.message);
            setTimeout(() => {
                setErrorPopup(false);
                document.location.reload();
            }, 5000 * 1 + 200)
        }
        else {
            setSuccessPopup(response.message);
            setTimeout(() => {
                setSuccessPopup(false);
                document.location.reload();
            }, 5000 * 1 + 200)
        }

        e.target.remove();
    }

    return (
        <div className="project-pane">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {newProjectPopup && 
                <AnnouncementPopup 
                    closeHandler={() => setNewProjectPopup(false)} 
                    submitHandler={announcementSubmitHandler} />}
            {(loggedIn && owner) && <button className="create" onClick={() => setNewProjectPopup(true)}>Create Announcement</button>}
            {project ? (project.announcements.length < 1) ?
                <h3>This is where project announcements will appear!</h3>
                :
                project.announcements.reverse().map((announcement, i) => 
                    <Announcement 
                        key={i}
                        announcement={announcement} 
                        project={project} 
                        owner={owner} 
                        loggedIn={loggedIn}
                        username={account.user_name}
                        pfp={account.pfp}
                        setCurrView={setCurrView} />
                    ) : <h1>Invalid project</h1>
            }
        </div>
    );
}

export default ProjectPane;