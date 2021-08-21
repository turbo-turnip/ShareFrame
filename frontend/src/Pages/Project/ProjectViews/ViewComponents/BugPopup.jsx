import React from 'react';

const BugPopup = ({ closeHandler, submitHandler, versions }) => {
    return (
        <form className="popup-new" onSubmit={e => {
            e.preventDefault();
            submitHandler(e);
        }}>
            <div className="x" onClick={closeHandler}>&times;</div>
            <h1>Report Bug</h1>
            <div className="input-field">
                <label>Title</label>
                <input type="text" placeholder="e.g. Home Page navbar bug" maxLength="100" />
            </div>
            <div className="input-field">
                <label>Bug Summary</label>
                <input type="text" placeholder="e.g. There's this bug on the home page where..." />
            </div>
            <div className="input-field">
                <label>App Version</label>
                <select>
                    {versions.map(version => <option value={version}>{version}</option>)}
                </select>
            </div>
            <div className="input-field">
                <label>Screenshots</label>
                <input type="file" />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default BugPopup;