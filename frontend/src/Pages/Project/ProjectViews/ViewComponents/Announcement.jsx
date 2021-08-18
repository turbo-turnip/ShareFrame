import React, { useEffect, useState } from 'react';
import Popup from '../../../../Components/Popup';
import { BACKEND_PATH, join } from '../../../../PATH';

const types = [
    { name: "Commit", color: "#f0ed35" },    
    { name: "Status Update", color: "#28b02f" },
    { name: "New Member", color: "#c43221" },
    { name: "Production Update", color: "#db40c1" },
    { name: "Development Update", color: "#4079db" },
    { name: "UI Update", color: "#7dfc6f" },
    { name: "Analytics Update", color: "#80139e" },
    { name: "Database Update", color: "#ebd0f2" },
    { name: "Technology Update", color: "#db8009" },
    { name: "Hardware Update", color: "#6e7d8a" },
    { name: "Announcement", color: "#033d70" }
];

const Announcement = ({ announcement, loggedIn, owner, project, username }) => {
    const [ typeColor, setTypeColor ] = useState();
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ errorPopup, setErrorPopup ] = useState(false);

    const deleteHandler = async () => {
        if (window.confirm("Are you sure you want delete the announcement " + announcement.title + "?")) {
            const password = window.prompt("Please enter your user password", '');

            const request = await fetch(join(BACKEND_PATH, "/project/deleteAnnouncement"), {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: username,
                    announcementName: announcement.title,
                    title: project.project_title,
                    projectCreator: project.user_name,
                    announcementContent: announcement.desc,
                    password
                })
            });

            const response = await request.json();

            if (request.status !== 200) {
                setErrorPopup(response.message);
                setTimeout(() => {
                    setErrorPopup(false);
                    document.location.reload();
                }, 5000 * 1 + 200);
            }
            else {
                setSuccessPopup(response.message);
                setTimeout(() => {
                    setSuccessPopup(false);
                    document.location.reload();
                }, 5000 * 1 + 200);
            }

            console.log(response);
        }
    }

    useEffect(() => {
        types.forEach(type => {
            if (announcement.type === type.name) {
                setTypeColor(type.color);
                return;
            }
        });
    }, []);

    return (
        <div className="project-announcement">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            <img src={announcement.pfp} alt={announcement.user_name} />
            <div className="info">
                <span className="version"><b>{announcement.version}</b></span>
                <span>{announcement.title}</span>
                <span className="announcement-type" style={{ background: typeColor }}>{announcement.type}</span>
            </div>
            <h4>{announcement.desc}</h4>
            {loggedIn && 
                <div className="buttons">
                    {project.allow_threads === 'TRUE' && <button>Create Thread</button>}
                    {loggedIn && <button>Report Bug</button>}
                    {loggedIn && <button>Comment</button>}
                    {owner && <button onClick={deleteHandler}>Delete</button>}
                </div>}
        </div>
    );
}

export default Announcement;