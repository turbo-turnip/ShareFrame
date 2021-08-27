import React from 'react';

const Settings = ({ project, account, error }) => {
    return (
        <div className="project-settings">
            {error && <h1 className="url-error">{error}</h1>}
            {!error &&
                <React.Fragment>
                    <h1>Project Settings</h1>
                    <div className="input-field">
                        <label>Project Title</label>
                        <input type="text" value={project.project_title} />
                    </div>
                    <div className="input-field">
                        <label>Project Description</label>
                        <input type="text" value={project.project_desc} />
                    </div>
                    <div className="input-field">
                        <label>Project Short Description</label>
                        <input type="text" value={project.project_desc_short} />
                    </div>
                    <div className="input-field">
                        <label>Allow Feedback</label>
                        <input type="checkbox" checked={project.allow_feedback === 'TRUE'} />
                    </div>
                    <div className="input-field">
                        <label>Allow Reviews</label>
                        <input type="checkbox" checked={project.allow_reviews === 'TRUE'} />
                    </div>
                    <div className="input-field">
                        <label>Allow Threads</label>
                        <input type="checkbox" checked={project.allow_threads === 'TRUE'} />
                    </div>
                    <div className="input-field">
                        <label>GitHub Version Control</label>
                        <input type="checkbox" checked={project.version_control === 'TRUE'} />
                    </div>
                    <div className="input-field">
                        <label>GitHub Repository Owner</label>
                        <input type="text" value={project.version_control === 'TRUE' && project.repo_username} />
                    </div>
                    <div className="input-field">
                        <label>GitHub Repository Name</label>
                        <input type="text" value={project.version_control === 'TRUE' && project.repo_title} />
                    </div>
                    <div className="input-field">
                        <label>Members</label>
                        {project.members.map(member =>
                            <div className="project-member">
                                <img src={member.pfp} alt={member.user_name} />
                                <h4>{member.user_name}</h4>    
                                <button>Remove Member</button>
                            </div>)}
                        <button>Add Member</button>
                    </div>
                    <button>Delete Project</button>
                </React.Fragment>}
        </div>
    );
}

export default Settings;