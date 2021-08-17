import React from 'react';

const AnnouncementPopup = ({ closeHandler, submitHandler }) => {
    return (
        <form className="announcement-popup-new" onSubmit={e => {
            e.preventDefault();
            submitHandler(e);
        }}>
            <div className="x" onClick={closeHandler}>&times;</div>
            <h1>New Announcement</h1>
            <div className="input-field">
                <label>Version</label>
                <input type="text" placeholder="e.g. 1.0.1" maxLength="8" required />
            </div>
            <div className="input-field">
                <label>Title</label>
                <input type="text" placeholder="e.g. Added multiplayer networking system" required />
            </div>
            <div className="input-field">
                <label>Announcement Type</label>
                <select required>
                    <option value="Commit">Commit</option>
                    <option value="Status Update">Status Update</option>
                    <option value="New Member">New Member</option>
                    <option value="Production Update">Production Update</option>
                    <option value="Development Update">Development Update</option>
                    <option value="UI Update">UI Update</option>
                    <option value="Analytics Update">Analytics Update</option>
                    <option value="Database Update">Database Update</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Technology Update">Technology Update</option>
                    <option value="Hardware Update">Hardware Update</option>
                </select>
            </div>
            <div className="input-field">
                <label>Announcement</label>
                <input type="text" placeholder="e.g. We added the networking system in the game so that now multiple players can play against each other online" required />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default AnnouncementPopup;