import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../../PATH';
import Popup from '../../../Components/Popup';
import NewPoll from './ViewComponents/NewPoll';
import PollPreview from './ViewComponents/PollPreview';
import Poll from './ViewComponents/Poll';
import Responses from './ViewComponents/Responses';

const Polls = ({ error, project, owner, loggedIn, account }) => {
    const [ polls, setPolls ] = useState(project && project.polls ? project.polls : []);
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ member, setMember ] = useState(false);
    const [ newPoll, setNewPoll ] = useState(false);
    const [ answerPoll, setAnswerPoll ] = useState(false);
    const [ viewResponses, setViewResponses ] = useState(false);

    useEffect(() => {
        if (project) {
            if (project.polls)
                setPolls(project.polls);
            
            project.members.forEach(member => {
                if (member.user_name === account.user_name)
                    setMember(true);
            });
        }
    }, [ project ]);

    return (
        <div className="project-polls">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {error && <h1 className="url-error">{error}</h1>}
            {(!error && !newPoll && !answerPoll && !viewResponses) && 
                <React.Fragment>
                    <h1>Polls{(loggedIn && member) && <button onClick={() => setNewPoll(true)}>Create Poll</button>}</h1>
                    {polls.length !== 0 ? polls.map((poll, i) => <PollPreview poll={poll} member={member} answerPollHandler={() => { setAnswerPoll(poll) }} viewResponsesHandler={() => setViewResponses(i + 1)} />) : <h1 className="no-polls-message">This is where polls will appear!</h1>}
                </React.Fragment>}
            {(!error && newPoll && !answerPoll && !viewResponses) && <NewPoll account={account} project={project} />}
            {(!error && answerPoll && !viewResponses) && <Poll poll={answerPoll} project={project} account={account} />}
            {(!error && viewResponses && !answerPoll && polls) && <Responses responses={JSON.parse(polls[viewResponses - 1].responses.replace(/\"\[/gmi, '[').replace(/\\\"/gmi, '"').replace(/\\\[/gmi, '[').replace(/\]\"/gmi, ']'))} poll={polls[viewResponses - 1]} />}
        </div>
    );
}

export default Polls;