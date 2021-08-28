import React, { useEffect, useState } from 'react';
import Popup from '../../../Components/Popup';
import { BACKEND_PATH, join } from '../../../PATH';

const Settings = ({ project, account, error }) => { 
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ members, setMembers ] = useState(project && project.members ? project.members : []);

    const removeMemberHandler = async (member) => {
        if (window.confirm('Are you sure you want to remove ' + member.user_name + ' from this project?')) {
            // if (member.user_name === project.user_name) {
            //     setErrorPopup("You can't remove that member because they are the owner of this project");
            //     setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
            // }
            const request = await fetch(join(BACKEND_PATH, "/project/removeMember"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name, 
                    pfp: account.pfp, 
                    removedUser: member.user_name, 
                    removedPfp: member.pfp, 
                    projectTitle: project.project_title
                })
            });

            const response = await request.json();

            if (request.status !== 200) {
                setErrorPopup(response.message);
                setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
            } else {
                setSuccessPopup(response.message);
                setTimeout(() => setSuccessPopup(false), 5000 * 1 + 200);
                setMembers(response.members);
            }
        }
    }

    useEffect(() => {
        if (project)
            setMembers(project.members);
    }, [ project ]);

    return (
        <div className="project-settings">
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {successPopup && <Popup type="success" message={successPopup} />}
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
                        {members.map(member =>
                            <div className="project-member">
                                <img src={member.pfp} alt={member.user_name} />
                                <h4>{member.user_name}</h4>    
                                <button onClick={() => removeMemberHandler(member)}>Remove Member</button>
                            </div>)}
                        <button>Add Member</button>
                    </div>
                    <button>Delete Project</button>
                </React.Fragment>}
        </div>
    );
}

export default Settings;