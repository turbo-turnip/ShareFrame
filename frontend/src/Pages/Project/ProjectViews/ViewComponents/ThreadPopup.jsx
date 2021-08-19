import React from 'react';

const ThreadPopup = ({ closeHandler, submitHandler }) => {
    return (
        <form className="popup-new" onSubmit={e => {
            e.preventDefault();
            submitHandler(e);
        }}>
            <div className="x" onClick={closeHandler}>&times;</div>
            <h1>New Thread</h1>
            <div className="input-field">
                <label>Thread Subject</label>
                <input type="text" placeholder="e.g. Update 1.2.6 UI Looks Weird" maxLength="100" />
            </div>
            <div className="input-field">
                <label>Thread Description</label>
                <input type="text" placeholder="e.g. On My Chess App Update 1.2.6, the UI looks a bit strange" />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default ThreadPopup;