import React from 'react';

const FeedbackEntry = ({ entry }) => {
    return (
        <div className="feedback-entry">
            <img src={entry.pfp} alt={entry.user} data-user={entry.user} />
            <h4>{entry.title}</h4>
            <p>{entry.feedback}</p>
        </div>
    );
}

export default FeedbackEntry;