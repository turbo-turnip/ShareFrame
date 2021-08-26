import React, { useEffect } from 'react';
import QuestionAnswer from './QuestionAnswer';

const Responses = ({ poll, responses }) => {
    return (
        <div className="poll-responses">
            {console.log(responses)}
            <h1>{poll.title} - Responses ({responses.length})</h1> 
            {responses.map(response => 
                <div className="poll-response">
                    <img src={response.pfp} alt={response.user} />
                    <h4>{response.user}</h4>
                    {response.answers.map(answer => 
                        <div className="response-answer">
                            <QuestionAnswer answer={answer} />
                        </div>)}
                </div>)}
        </div>
    );
}

export default Responses;