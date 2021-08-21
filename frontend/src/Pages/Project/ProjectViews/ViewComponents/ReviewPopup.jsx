import React from 'react';

const ReviewPopup = ({ closeHandler, submitHandler }) => {
    return (
        <form className="popup-new" onSubmit={e => {
            e.preventDefault();
            submitHandler(e);
        }}>
            <div className="x" onClick={closeHandler}>&times;</div>
            <h1>New Review Entry</h1>
            <div className="input-field">
                <label>Title</label>
                <input type="text" placeholder="e.g. 3 Stars because..." maxLength="100" />
            </div>
            <div className="input-field">
                <label>Review</label>
                <input type="text" placeholder="e.g. I rated this app 3 stars because..." />
            </div>
            <div className="input-field">
                <label>Rating</label>
                <input type="number" min="1" max="5" />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default ReviewPopup;