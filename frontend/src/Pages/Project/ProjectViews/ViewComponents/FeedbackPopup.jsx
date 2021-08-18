import React from 'react';

const FeedbackPopup = ({ closeHandler, submitHandler }) => {
    return (
        <form className="popup-new" onSubmit={e => {
            e.preventDefault();
            submitHandler(e);
        }}>
            <div className="x" onClick={closeHandler}>&times;</div>
            <h1>New Feedback Entry</h1>
            <div className="input-field">
                <label>Title</label>
                <input type="text" placeholder="e.g. I think the app could use..." maxLength="100" />
            </div>
            <div className="input-field">
                <label>Feedback</label>
                <input type="text" placeholder="e.g. Especially on the home page, I think this app could use..." />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default FeedbackPopup;