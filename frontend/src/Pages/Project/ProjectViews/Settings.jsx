import React, { useEffect, useState } from 'react';
import Popup from '../../../Components/Popup';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../../PATH';

const Settings = ({ project, account, error }) => { 
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ members, setMembers ] = useState(project && project.members ? project.members : []);
    const [ changed, setChanged ] = useState([ false, false, false, false, false, false, false, false, false ]);

    const removeMemberHandler = async (member) => {
        if (window.confirm('Are you sure you want to remove ' + member.user_name + ' from this project?')) {
            if (member.user_name === project.user_name) {
                setErrorPopup("You can't remove that member because they are the owner of this project");
                setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
            } else {
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
    }

    const addMemberHandler = async (member) => {  
        const username = prompt('Please enter the member\'s username');
        const email = prompt('Please enter the member\'s email');

        if (username && email) {
            const request = await fetch(join(BACKEND_PATH, "/project/addMember"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name, 
                    pfp: account.pfp, 
                    addedUser: username, 
                    addedEmail: email, 
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
            }
        }
    }

    const projectDeleteHandler = async () => {
        if (window.confirm('Are you sure you want to delete this project? You can\'t un-delete it!')) {
            const password = prompt('To delete this project, enter your user password', '');

            const request = await fetch(join(BACKEND_PATH, "/project/deleteProject"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectTitle: project.project_title,
                    projectCreator: account.user_name,
                    password
                })
            });

            const response = await request.json();

            if (request.status !== 200) {
                setErrorPopup(response.message);
                setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
            } else {
                setSuccessPopup(response.message);
                setTimeout(() => {
                    setSuccessPopup(false)
                    document.location.href = join(FRONTEND_PATH, "/");
                }, 5000 * 1 + 200);
            }
        }
    }

    const saveSettingsHandler = async () => {
        const request = await fetch(join(BACKEND_PATH, "/project/submitSettings"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: changed[0],
                desc: changed[1], 
                shortDesc: changed[2], 
                allFeedback: changed[3],
                allReviews: changed[4],
                allThreads: changed[5], 
                vc: changed[6],
                vcOwner: changed[7], 
                vcName: changed[8], 
                oldTitle: project.project_title, 
                username: account.user_name
            })
        });

        const response = await request.json();

        if (request.status !== 200) {
            setErrorPopup(response.message);
            setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
        } else {
            setSuccessPopup(response.message);
            setTimeout(() => {
                setSuccessPopup(false)
                document.location.href = join(FRONTEND_PATH, "/project?name=" + encodeURIComponent(changed[0]) + "&user=" + encodeURIComponent(account.user_name));
            }, 5000 * 1 + 200);
        }
    }

    const inputChangeHandler = (index, e) => {
        if (e.target.type === "checkbox") {
            if (changed[index] !== e.target.checked) {
                setChanged(prevState =>
                    prevState.map((c, i) =>
                        i === index ? e.target.checked.toString().toUpperCase() : c));
            }
        } else if (e.target.type === "text") {
            if (changed[index] !== e.target.value) {
                setChanged(prevState =>
                    prevState.map((c, i) =>
                        i === index ? e.target.value : c));
            }
        }
    }

    useEffect(() => {
        if (project) {
            setMembers(project.members);

            setChanged([ project.project_title, project.project_desc, project.project_desc_short, project.allow_feedback, project.allow_reviews, project.allow_threads, project.version_control, project.version_control === 'TRUE' ? project.repo_username : "", project.version_control === 'TRUE' ? project.repo_title : "" ]);
        }
    }, [ project ]);

    useEffect(() => {
        window.onbeforeunload = e => e.returnValue = " ";
    }, []);

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
                        <input type="text" maxLength="25" defaultValue={project.project_title} onChange={(e) => inputChangeHandler(0, e)} />
                    </div>
                    <div className="input-field">
                        <label>Project Description</label>
                        <input type="text" defaultValue={project.project_desc} onChange={(e) => inputChangeHandler(1, e)} />
                    </div>
                    <div className="input-field">
                        <label>Project Short Description</label>
                        <input type="text" defaultValue={project.project_desc_short} onChange={(e) => inputChangeHandler(2, e)} />
                    </div>
                    <div className="input-field">
                        <label>Allow Feedback</label>
                        <input type="checkbox" defaultChecked={project.allow_feedback === 'TRUE'} onChange={(e) => inputChangeHandler(3, e)} />
                    </div>
                    <div className="input-field">
                        <label>Allow Reviews</label>
                        <input type="checkbox" defaultChecked={project.allow_reviews === 'TRUE'} onChange={(e) => inputChangeHandler(4, e)} />
                    </div>
                    <div className="input-field">
                        <label>Allow Threads</label>
                        <input type="checkbox" defaultChecked={project.allow_threads === 'TRUE'} onChange={(e) => inputChangeHandler(5, e)} />
                    </div>
                    <div className="input-field">
                        <label>GitHub Version Control</label>
                        <input type="checkbox" defaultChecked={project.version_control === 'TRUE'} onChange={(e) => inputChangeHandler(6, e)} />
                    </div>
                    <div className="input-field">
                        <label>GitHub Repository Owner</label>
                        <input type="text" defaultValue={project.version_control === 'TRUE' ? project.repo_username : ""} onChange={(e) => inputChangeHandler(7, e)} />
                    </div>
                    <div className="input-field">
                        <label>GitHub Repository Name</label>
                        <input type="text" defaultValue={project.version_control === 'TRUE' ? project.repo_title : ""} onChange={(e) => inputChangeHandler(8, e)} />
                    </div>
                    <div className="input-field">
                        <label>Members</label>
                        {members.map(member =>
                            <div className="project-member">
                                <img src={member.pfp} alt={member.user_name} />
                                <h4>{member.user_name}</h4>    
                                <button onClick={() => removeMemberHandler(member)}>Remove Member</button>
                            </div>)}
                        <button onClick={addMemberHandler}>Add Member</button>
                    </div>
                    <button onClick={saveSettingsHandler}>Save Settings</button>
                    <button onClick={projectDeleteHandler}>Delete Project</button>
                </React.Fragment>}
        </div>
    );
}

export default Settings;