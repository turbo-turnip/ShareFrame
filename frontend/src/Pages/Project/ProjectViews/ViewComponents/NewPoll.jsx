import React, { useState, useRef } from 'react';
import CreatePollQuestion from './CreatePollQuestion';
import NewSingleChoice from './NewSingleChoice';
import NewTextBoxChoice from './NewTextBoxChoice';
import NewMultipleChoice from './NewMultipleChoice';
import { BACKEND_PATH, join } from '../../../../PATH';
import Popup from '../../../../Components/Popup';

const useForceUpdate = () => {
    const [ value, setValue ] = useState(0);
    return () => setValue(value => value + 1);
}

const NewPoll = ({ account, project }) => {
    const questionsRef = useRef();
    const forceUpdate = useForceUpdate();
    const [ questions, setQuestions ] = useState([]);
    const [ title, setTitle ] = useState("");
    const [ desc, setDesc ] = useState("");
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ successPopup, setSuccessPopup ] = useState(false);

    const getQuestions = () => {
        return new Promise((res) => {
            let tmp = questions;
            let i = 0;

            for (let element of questionsRef.current.children) {
                if (questions[i].type === "Single") {
                    let choices = Array.from(element.children).slice(3, element.children.length);
                    choices = choices.map(choice => choice.children[1].value);

                    tmp[i] = {
                        type: "Single",
                        title: element.children[1].children[1].value,
                        desc: element.children[2].children[1].value,
                        choices: JSON.stringify(choices)
                    };
                } else if (questions[i].type === "TextBox") {
                    tmp[i] = {
                        type: "TextBox",
                        title: element.children[1].children[1].value,
                        desc: element.children[2].children[1].value
                    };
                } else if (questions[i].type === "Multiple") {
                    let choices = Array.from(element.children).slice(3, element.children.length);
                    choices = choices.map(choice => choice.children[1].value);

                    tmp[i] = {
                        type: "Multiple",
                        title: element.children[1].children[1].value,
                        desc: element.children[2].children[1].value,
                        choices: JSON.stringify(choices)
                    };
                }
                i++;
                if (i === questionsRef.current.children.length)
                    res(tmp); 
            }
        });
    }

    const uploadPollHandler = async () => {
        const questions = await getQuestions();
        const password = prompt('Please enter your user password', '');

        const request = await fetch(join(BACKEND_PATH, "/project/createPoll"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: account.user_name, 
                pfp: account.pfp, 
                projectCreator: project.user_name, 
                password, 
                projectTitle: project.project_title, 
                title, 
                desc, 
                questions
            })
        });

        const response = await request.json();

        if (request.status !== 201) {
            setErrorPopup(response.message);
            setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
        } else {
            setSuccessPopup(response.message);
            setTimeout(() => {
                setSuccessPopup(false);
                document.location.reload();
            }, 5000 * 1 + 200);
        }
    }

    return (
        <div className="new-poll">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            <h1>New Poll</h1>
            <div className="input-field">
                <label>Poll Title</label>
                <input type="text" placeholder="e.g. New Frontend Framework" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="input-field">
                <label>Poll Description</label>
                <input type="text" placeholder="e.g. We are thinking about switching frontend frameworks..." onChange={(e) => setDesc(e.target.value)} />
            </div>
            <CreatePollQuestion setQuestions={setQuestions} uploadPollHandler={uploadPollHandler} />
            <div className="poll-questions" ref={questionsRef}>
                {questions.length !== 0 ? 
                    questions.map((question, i) =>
                        question.type === "Single" ? 
                            <NewSingleChoice 
                                choiceTitle={question.title} 
                                choiceDesc={question.desc}
                                removeQuestion={() => {
                                    let tmp = questions;
                                    tmp.splice(i, 1);
                                    setQuestions(tmp);
                                    forceUpdate();
                                }} /> : 
                        question.type === "TextBox" ?
                            <NewTextBoxChoice 
                                choiceTitle={question.title} 
                                choiceDesc={question.desc}
                                removeQuestion={() => {
                                    let tmp = questions;
                                    tmp.splice(i, 1);
                                    setQuestions(tmp);
                                    forceUpdate();
                                }} /> : 
                        question.type === "Multiple" ?
                            <NewMultipleChoice
                                choiceTitle={question.title} 
                                choiceDesc={question.desc}
                                removeQuestion={() => {
                                    let tmp = questions;
                                    tmp.splice(i, 1);
                                    setQuestions(tmp);
                                    forceUpdate();
                                }} /> : ""
                    ) 
                    :
                    <h1>There's no questions yet; make some!</h1>}
            </div>
        </div>
    );
}

export default NewPoll;