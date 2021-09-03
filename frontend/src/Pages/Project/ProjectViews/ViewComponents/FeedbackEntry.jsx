import React from 'react';
import { FRONTEND_PATH, join } from '../../../../PATH';

const FeedbackEntry = ({ entry }) => {
    return (
        <div className="feedback-entry">
            <img src={entry.pfp} alt={entry.user} data-user={entry.user} className="user-link" onClick={() => document.location.href = join(FRONTEND_PATH, "/user?name=" + entry.user)} />
            <h4>{entry.title}</h4>
            <p>{entry.feedback}</p>
        </div>
    );
}

export default FeedbackEntry;