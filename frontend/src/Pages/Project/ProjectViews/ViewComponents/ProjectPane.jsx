import React, { useState } from 'react';
import AnnouncementPopup from './AnnouncementPopup';
import Announcement from './Announcement';
import { BACKEND_PATH, join } from '../../../../PATH';

const ProjectPane = ({ project, owner, loggedIn, account }) => {
    const [ newProjectPopup, setNewProjectPopup ] = useState(false);

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

        console.log(response);

        e.target.remove();
    }

    return (
        <div className="project-pane">
            {newProjectPopup && 
                <AnnouncementPopup 
                    closeHandler={() => setNewProjectPopup(false)} 
                    submitHandler={announcementSubmitHandler} />}
            {(loggedIn && owner) && <button className="create" onClick={() => setNewProjectPopup(true)}>Create Announcement</button>}
            {project ? (project.announcements.length < 1) ?
                <h3>This is where project announcements will appear!</h3>
                :
                project.announcements.map(announcement => 
                    <Announcement 
                        announcement={announcement} 
                        project={project} 
                        owner={owner} 
                        loggedIn={loggedIn} />
                    ) : <h1>Invalid project</h1>
            }
        </div>
    );
}

export default ProjectPane;