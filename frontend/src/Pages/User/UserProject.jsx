import React from 'react';

const UserProject = ({ project }) => {
    return (
        <div className="user-project">
            <h4>{project.project_title} <span>{project.supporters.length} Supporters</span></h4>
            <p>{project.project_desc}</p>
        </div>
    );
}

export default UserProject;