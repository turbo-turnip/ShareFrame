import React, { useState } from 'react';
import AnnouncementPopup from './AnnouncementPopup';
import Announcement from './Announcement';

const ProjectPane = ({ project, owner, loggedIn }) => {
    const [ newProjectPopup, setNewProjectPopup ] = useState(false);

    const announcementSubmitHandler = (e) => {
        const [ version, title, type, announcement ] = e.target.parentElement.querySelectorAll("input, select");



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