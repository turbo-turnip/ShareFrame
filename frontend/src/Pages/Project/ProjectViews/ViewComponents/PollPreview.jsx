import React, { useEffect, useState } from 'react';
 
const PollPreview = ({ poll, answerPollHandler, member, viewResponsesHandler }) => {
    const [ questions, setQuestions ] = useState(0);
    const [ responses, setResponses ] = useState(0);

    useEffect(() => {
        if (poll.questions && poll.responses) {
            let questions = poll.questions,
                responses = poll.responses;
            setQuestions(JSON.parse(questions.replace(/\"\[/gmi, '[').replace(/\]\"/gmi, ']').replace(/\\\"/gmi, '"')));
            setResponses(JSON.parse(responses.replace(/\"\[/gmi, '[').replace(/\\\"/gmi, '"').replace(/\\\[/gmi, '[').replace(/\]\"/gmi, ']')));
        }
    }, [ poll ]);

    return (
        <div className="poll-preview">
            {console.log(poll)}
            <div className="user">
                <img src={poll.pfp} alt={poll.creator} />
                <h4>{poll.creator}</h4>
            </div>
            <h4>{poll.title}</h4>
            <p>{poll.description}</p>
            <div className="bottom">
                <span>Questions ({questions.length})</span>
                <span>Responses ({responses.length})</span>
                {member && <button onClick={answerPollHandler}>Answer Poll</button>}
                {member && <button onClick={viewResponsesHandler}>View Responses</button>}
            </div>
        </div>
    );
}

export default PollPreview;