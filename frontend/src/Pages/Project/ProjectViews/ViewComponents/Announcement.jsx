import React, { useEffect, useState } from 'react';

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

const Announcement = ({ announcement, loggedIn, owner, project }) => {
    const [ typeColor, setTypeColor ] = useState();

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
                    {owner && <button>Delete</button>}
                </div>}
        </div>
    );
}

export default Announcement;