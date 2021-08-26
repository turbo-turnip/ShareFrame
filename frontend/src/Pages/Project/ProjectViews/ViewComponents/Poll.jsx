import React, { useState, useEffect, useRef } from 'react';
import SingleQuestion from './SingleQuestion';
import TextBoxQuestion from './TextBoxQuestion';
import MultipleQuestion from './MultipleQuestion';
import Popup from '../../../../Components/Popup';
import { BACKEND_PATH, join } from '../../../../PATH';

const Poll = ({ poll, project, account }) => {
    const questionsRef = useRef();
    const [ answered, setAnswered ] = useState(new Array(JSON.parse(poll.questions).length).fill(false));
    const [ questions, setQuestions ] = useState([]);
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);

    const submitHandler = async () => {
        if (answered.includes(true)) {
            const password = prompt('Please enter your user password.');

            let answers = [];
            for (let child of questionsRef.current.children) {
                const type = 
                    child.classList.contains("single-choice") ? "Single" :
                    child.classList.contains("multiple-choice") ? "Multiple" :
                    child.classList.contains("textbox-choice") ? "TextBox" : null;

                let responses = {};
                if (type === "Single" || type === "Multiple")
                    responses = Array.from(child.children).slice(2, child.children.length).map(choice => { return { selected: choice.children[0].checked, value: choice.children[1].innerHTML } });
                else if (type === "TextBox")
                    responses = child.children[2].value

                answers.push({
                    type,
                    title: child.children[0].innerHTML,
                    desc: child.children[1].innerHTML,
                    responses
                });    
            }

            answers = answers.map(answer => {
                let answerResponses = typeof answer.responses === 'string' ? answer.responses.split() : answer.responses;
                answerResponses = answerResponses.map(res => {
                    if (typeof res === 'string')
                        return { value: res };
                    else return { ...res, selected: res.selected.toString() }
                });
                return { ...answer, responses: JSON.stringify(answerResponses) };
            });

            const request = await fetch(join(BACKEND_PATH, "/project/submitPollAnswer"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name, 
                    pfp: account.pfp, 
                    projectCreator: project.user_name, 
                    password, 
                    projectTitle: project.project_title, 
                    title: poll.title, 
                    desc: poll.description, 
                    answers
                })
            });

            const response = await request.json();

            console.log(response.message);

            if (request.status !== 201) {
                setErrorPopup(response.message);
                setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
            } else {
                setSuccessPopup(response.message);
                setTimeout(() => setSuccessPopup(false), 5000 * 1 + 200);
                // document.location.reload();
            }
        } else {
            setErrorPopup("Please fill out the poll before submitting");
            setTimeout(() => {
                setErrorPopup(false);
            }, 5000 * 1 + 200);
        }
    }

    useEffect(() => {
        if (poll && poll.questions) 
            setQuestions(JSON.parse(poll.questions));
    }, [ poll ]);

    return (
        <div className="poll-page">
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {successPopup && <Popup type="success" message={successPopup} />}
            <h1>{poll.title}</h1>
            <h4 style={{ fontSize: "1.2em", fontWeight: "normal", marginBottom: ".5em" }}>{poll.description}</h4>
            <p>Created by {poll.creator} of {project.project_title}</p>
            <div className="questions" ref={questionsRef}>
                {questions.length > 0 ?
                    questions.map((question, i) => 
                        question.type === "Single" ?
                            <SingleQuestion question={question} answered={answered} index={i} setAnswered={setAnswered} />
                        : question.type === "TextBox" ?
                            <TextBoxQuestion question={question} answered={answered} index={i} setAnswered={setAnswered} />
                        : question.type === "Multiple" ?
                            <MultipleQuestion question={question} answered={answered} index={i} setAnswered={setAnswered} /> : "")
                : <h1>There are no questions here!</h1>}
            </div>
            {questions.length > 0 && <button onClick={submitHandler}>Submit</button>}
        </div>
    );
}

export default Poll;