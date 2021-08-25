import React from 'react';
 
const PollPreview = ({ poll, answerPollHandler, member }) => {
    return (
        <div className="poll-preview">
            <div className="user">
                <img src={poll.pfp} alt={poll.creator} />
                <h4>{poll.creator}</h4>
            </div>
            <h4>{poll.title}</h4>
            <p>{poll.description}</p>
            <div className="bottom">
                <span>Questions ({JSON.parse(poll.questions).length})</span>
                <span>Responses ({JSON.parse(poll.responses).length})</span>
                {/* Add !owner check so that only supporters can answer polls */}
                <button onClick={answerPollHandler}>Answer Poll</button>
            </div>
        </div>
    );
}

export default PollPreview;