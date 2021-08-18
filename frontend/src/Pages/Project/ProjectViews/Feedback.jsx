import React, { useState, useEffect } from 'react';
import FeedbackEntry from './ViewComponents/FeedbackEntry';
import FeedbackPopup from './ViewComponents/FeedbackPopup';
import { BACKEND_PATH, join } from '../../../PATH';
import Popup from '../../../Components/Popup';

const Feedback = ({ error, project, owner, loggedIn, account }) => {
    const [ feedback, setFeedback ] = useState(project && project.feedback ? project.feedback : []);
    const [ newFeedbackPopup, setNewFeedbackPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ errorPopup, setErrorPopup ] = useState(false);

    const newFeedbackHandler = async (e) => {
        const [ title, feedback ] = e.target.querySelectorAll("input");

        const password = prompt('Please enter your user password', '');

        const request = await fetch(join(BACKEND_PATH, "/project/createFeedback"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: account.user_name, 
                pfp: account.pfp, 
                title: project.project_title, 
                projectCreator: project.user_name, 
                password, 
                feedbackTitle: title.value, 
                feedback: feedback.value
            })
        });

        const response = await request.json();

        if (request.status !== 201) {
            setErrorPopup(response.message);
            setNewFeedbackPopup(false);
            setTimeout(() => {
                setErrorPopup(false);
            }, 5000 * 1 + 200);
        } else {
            setNewFeedbackPopup(false);
            setSuccessPopup(response.message);
            setFeedback(response.feedback);
            setTimeout(() => {
                setSuccessPopup(false);
            }, 5000 * 1 + 200);
        }
    }

    return (
        <div className="project-feedback">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {newFeedbackPopup && <FeedbackPopup closeHandler={() => setNewFeedbackPopup(false)} submitHandler={(e) => newFeedbackHandler(e)} />}
            {error && <h1 className="url-error">{error}</h1>}
            {!error && 
                <React.Fragment>
                    <div className="filter-feedback">
                        <input type="text" placeholder="Search feedback..." />
                        <button>Search</button>
                    </div>
                    {feedback.map(entry => 
                        <FeedbackEntry entry={entry} />)}
                    {(loggedIn && !owner) && <button onClick={() => setNewFeedbackPopup(true)}>Add Feedback</button>}
                </React.Fragment>    
            }
        </div>
    );
}

export default Feedback;