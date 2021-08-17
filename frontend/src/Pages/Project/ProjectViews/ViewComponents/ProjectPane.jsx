import React from 'react';

const ProjectPane = ({ project, owner, loggedIn }) => {
    return (
        <div className="project-pane">
            {loggedIn && <button className="create">Create Announcement</button>}
            {project ? (project.announcements.length < 1) ?
                <h3>This is where project announcements will appear!</h3>
                :
                project.announcements.map(announcement => 
                    <div className="project-announcement" data-date-created={project.date_created}>
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
                    </div>) : <h1>Invalid project</h1>
            }
        </div>
    );
}

export default ProjectPane;