import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../../PATH';
import Popup from '../../../Components/Popup';
import NewPoll from './ViewComponents/NewPoll';
import PollPreview from './ViewComponents/PollPreview';
import Poll from './ViewComponents/Poll';

const Polls = ({ error, project, owner, loggedIn, account }) => {
    const [ polls, setPolls ] = useState(project && project.polls ? project.polls : []);
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ member, setMember ] = useState(false);
    const [ newPoll, setNewPoll ] = useState(false);
    const [ answerPoll, setAnswerPoll ] = useState(false);

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

    useEffect(() => console.log(answerPoll), [ answerPoll ]);

    return (
        <div className="project-polls">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {error && <h1 className="url-error">{error}</h1>}
            {(!error && !newPoll && !answerPoll) && 
                <React.Fragment>
                    <h1>Polls{(loggedIn && member) && <button onClick={() => setNewPoll(true)}>Create Poll</button>}</h1>
                    {polls.length !== 0 ? polls.map(poll => <PollPreview poll={poll} member={member} answerPollHandler={() => { setAnswerPoll(poll) }} />) : <h1 className="no-polls-message">This is where polls will appear!</h1>}
                </React.Fragment>}
            {(!error && newPoll && !answerPoll) && <NewPoll account={account} project={project} />}
            {(!error && answerPoll) && <Poll poll={answerPoll} project={project} account={account} />}
        </div>
    );
}

export default Polls;