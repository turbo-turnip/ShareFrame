import React from 'react';
import { FRONTEND_PATH, join } from '../../PATH';

const UserProject = ({ project }) => {
    return (
        <div className="user-project">
            <h4 onClick={() => document.location.href = join(FRONTEND_PATH, "/project?name=" + project.project_title + "&user=" + project.user_name)}>
                {project.project_title} 
                <span>{project.supporters.length} Supporter{project.supporters.length !== 1 && "s"}</span>
            </h4>
            <p>{project.project_desc}</p>
        </div>
    );
}

export default UserProject;