import React, { useEffect } from 'react';
import QuestionAnswer from './QuestionAnswer';
import { FRONTEND_PATH, join } from '../../../../PATH';

const Responses = ({ poll, responses }) => {
    return (
        <div className="poll-responses">
            {console.log(responses)}
            <h1>{poll.title} - Responses ({responses.length})</h1> 
            {responses.map(response => 
                <div className="poll-response">
                    <img src={response.pfp} alt={response.user} />
                    <h4 className="user-link" onClick={() => document.location.href = join(FRONTEND_PATH, "/user?name=" + response.user)}>{response.user}</h4>
                    {response.answers.map(answer => 
                        <div className="response-answer">
                            <QuestionAnswer answer={answer} />
                        </div>)}
                </div>)}
        </div>
    );
}

export default Responses;