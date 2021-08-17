import React from 'react';

const Announcement = ({ announcement, loggedIn, owner, project }) => {
    return (
        <div className="project-announcement">
            <img src={announcement.pfp} alt={announcement.user_name} />
            <div className="info">
                <span className="version"><b>{announcement.version}</b></span>
                <span>{announcement.title}</span>
                <span className="announcement-type">{announcement.type}</span>
            </div>
            <h4>{announcement.desc}</h4>
            {loggedIn && 
                <div className="buttons">
                    {project.allow_threads === 'TRUE' && <button>Create Thread</button>}
                    {loggedIn && <button>Report Bug</button>}
                    {loggedIn && <button>Comment</button>}
                    {owner && <button>Delete</button>}
                </div>}
        </div>
    );
}

export default Announcement;